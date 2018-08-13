'use strict';
const router = require('koa-router')();
const Project = require('../models/Project');
const Subscribe = require('../models/Subscribe');
const SubscribeTopic = require('../models/SubscribeTopic');
const FeedSource = require('../models/FeedSource');
const FeedSourceCategory = require('../models/FeedSourceCategory');
const FeedSourceCategoryGroup = require('../models/FeedSourceCategoryGroup');
const AccountEvent = require('../models/AccountEvent');
const AccountInfo = require('../models/AccountInfo');
const Elasticsearch = require('../common/Elasticsearch');
const ESClientFactory = require('../common/ESClientFactory');
const parse = require('co-body');

const _ = require('lodash');

router.get('/api/hot/feedSources', function *() {
    let page = parseInt(this.query.page);
    let pageSize = parseInt(this.query.pageSize);
    let totalPage = 10;
    page = (page - 1) % totalPage + 1;
    let offset = (page - 1) * pageSize;

    let hotFeeds = yield Subscribe.aggregate([
        { $group: {
            _id: '$feed',
            count: { $sum: 1 }
        } },
        { "$sort": { "count": -1 } },
        { "$limit": pageSize * totalPage }
    ]);

    let maxCount = hotFeeds[0] && hotFeeds[0].count;
    let hotCounts = hotFeeds.map((it, index) => {
        let w = it.count;
        // current page, ins weight
        if (index >= offset && index < offset + pageSize) {
            w += maxCount;
        }
        return { w: w, _id: it._id };
    });

    let result = [];
    randomWithWeight(hotCounts.slice(), result, hotCounts.length > pageSize ? pageSize : hotCounts.length);

    let hotFeedIds = result.map(it => it._id);
    let feedSources = yield FeedSource.find({ _id: { $in: hotFeedIds } });
    this.body = feedSources;

});

router.get('/api/recommend/feedSources', function *() {
    let page = parseInt(this.query.page);
    let pageSize = parseInt(this.query.pageSize);
    let totalPage = 10;
    page = (page - 1) % totalPage + 1;
    let offset = (page - 1) * pageSize;

    let total = totalPage * pageSize;

    let accountId = this.session.account._id;
    let subscribes = yield Subscribe.find({ account: accountId });
    let subscribe_feed_ids = subscribes.map(sub => sub.feed);
    let subscribe_feeds = yield FeedSource.find({ _id: { $in: subscribe_feed_ids } });
    let subscribe_tags = _.flatten(subscribe_feeds.map(sf => sf.tags || []));

    let recommend_feeds = yield FeedSource.find({ _id: { $nin: subscribe_feed_ids }, tags: { $in: subscribe_tags } }).limit(total).sort({ dateCreated: -1 });

    let w1 = 10;
    let w2 = 1;
    let wms = recommend_feeds.map(it => {
        return { w: w1, _id: it._id };
    });

    if (recommend_feeds.length < total) {
        let recommend_feeds2 = yield FeedSource.find({ _id: { $nin: subscribe_feed_ids }}).limit(total - recommend_feeds.length).sort({ dateCreated: -1 });
        let wms2 = recommend_feeds2.map(it => {
            return { w: w2, _id: it._id };
        });
        wms.push(...wms2);
    }

    let recommends = wms.map((it, index) => {
        let w = it.w;
        // current page, ins weight
        if (index >= offset && index < offset + pageSize) {
            w += w1*3;
        }
        return { w: w, _id: it._id };
    });

    let result = [];
    randomWithWeight(recommends.slice(), result, recommends.length > pageSize ? pageSize : recommends.length);
    let feedIds = result.map(it => it._id);

    this.body = yield FeedSource.find({ _id: { $in: feedIds } });
});

router.get('/api/subscribe/feedSourceTypeList', function *() {
    this.body = yield FeedSourceCategory.find({}).sort({orderIndex: -1});
});

router.get('/api/subscribe/feedSourceCategoryGroupList', function *() {
    let groups = yield FeedSourceCategoryGroup.find({ }).sort({ orderIndex: -1 });
    let categories = yield FeedSourceCategory.find({ }).sort({ orderIndex: -1 });
    this.body = { groups: groups, categories: categories }
});

router.get('/api/subscribe/guideFeedSourceList', function *() {
    let categoryIds = this.query.categoryIds;
    let categoryIdList = (categoryIds || "").split(',');
    let category = yield FeedSourceCategory.find({ _id: { $in: categoryIdList } });

    let tags = category.map(it => it.tags).reduce((acc, cur) => acc.concat(cur), []);

    let query = { 'weight.score': { $gte: 100 } };
    if(tags.length != 0) {
        query.tags = { $in: tags };
    }

    this.body  = yield FeedSource.find(query, {originId: 0}).sort({ 'weight.score': -1 }).limit(100);
});

router.get('/api/subscribe/feedSourceList', function *() {
    let query = {};
    let sort = [];

    if (this.query.keyword) {
        query.bool = {
            should : [
                {match: {name: {query: this.query.keyword, boost: 8}}},
                {term: {tags: this.query.keyword}},
                {match: {desc: this.query.keyword}}
            ]
        };

        sort.push({"_score": {"order": "desc"}});
    }else {
        query.match_all = {};
    }

    if (this.query.type && this.query.type != 'ALL') {
        let category = {};
        try {
            category = yield FeedSourceCategory.findOne({_id: this.query.type});
        }catch(e) {
            console.error(e);
        }
        query = {
            filtered: {
                query: query,
                filter: {
                    terms: {
                        tags: category.tags
                    }
                }
            }
        }
    }

    sort.push({ "weight.score": { "order": "desc" }});

    // let es = new Elasticsearch('boom', 'feedsource');
    // let results = yield es.search(query, 90, sort);
    // let feedList = _.map(results.hits.hits, s => {
    //     let r = s._source;
    //     r._id = s._id;
    //     delete r.originId;
    //     return r;
    // });
    // this.body = feedList;
    let es = ESClientFactory.get();
    let feedIdList = (yield es.search({
        index: 'boom',
        type: 'feedsource',
        size: 90,
        body: {query, sort},
        _source: false,
    })).hits.hits;
    feedIdList = _.map(feedIdList, p => p._id);
    let feedList = yield FeedSource.find( {_id: { $in: feedIdList }}, {originId: 0});
    feedList = _.sortBy(feedList, f => feedIdList.indexOf(f.id));
    this.body = feedList;
});

router.post('/api/subscribe/follow', function *() {
    let data = yield parse(this);
    let feedName = data.feed.name;
    let feedId = data.feed._id;
    let topicId = data.topicId;
    let accountId = this.session.account._id;
    let id = accountId + '#' + feedId;
    if(yield Subscribe.count({_id: id})) {
        this.body = {result: 'fail', message: 'the feed source is already subscribed.'};
        return;
    }
    if((yield Subscribe.count({account: accountId})) > 500) {
        this.body = {result: 'fail', message: 'subscribe too many'};
        return;
    }
    if( !(yield SubscribeTopic.count({_id: topicId})) || !(yield FeedSource.count({_id: feedId}))) {
        this.body = {result: 'fail', message: 'topic or feed is not exists.'};
        return;
    }
    yield new Subscribe({
        _id: id,
        name: feedName || '默认分类',
        topic: topicId,
        feed: feedId,
        account: accountId
    }).save();
    this.body = {result: 'success'};
});

router.post('/api/subscribe/newTopic', function *() {
    let data = yield parse(this);
    let name = data.name;
    let accountId = this.session.account._id;

    if((yield SubscribeTopic.count({account: accountId})) > 50) {
        this.body = {result: 'fail', message: 'topic too many'};
        return;
    }

    let topic = new SubscribeTopic({
        name: name || '默认分类',
        account: accountId
    });

    yield topic.save();
    this.body = {result: 'success', topic: topic};
});

router.post('/api/subscribe/updateTopic', function *() {
    let data = yield parse(this);
    let accountId = this.session.account._id;

    yield SubscribeTopic.update({_id: data.topicId, account: accountId}, {$set: {name: data.name}});

    this.body = {result: 'success'};
});

router.post('/api/subscribe/updateTopicFeed', function *() {
    let data = yield parse(this);
    let accountId = this.session.account._id;

    yield Subscribe.update({topic: data.topicId, feed: data.feedId, account: accountId}, {$set: {name: data.name}});

    this.body = {result: 'success'};
});

router.post('/api/subscribe/deleteTopic', function *() {
    let data = yield parse(this);
    let topicId = data.topicId;
    if(!topicId) {
        this.body = {result: 'fail', message: 'target topic not found.'};
        return;
    }
    yield SubscribeTopic.remove({_id: topicId});
    yield Subscribe.find({topic: topicId}).remove();
    this.body = {result: 'success'};
});

router.post('/api/subscribe/move', function *() {
    let data = yield parse(this);
    let topicId = data.topicId;
    let feedId = data.feed._id;
    let accountId = this.session.account._id;
    let id = accountId + '#' + feedId;
    if(!feedId || !(yield Subscribe.count({_id: id})) > 0) {
        this.body = {result: 'fail', message: 'subscribe not found.'};
        return;
    }
    if(!topicId || !(yield SubscribeTopic.count({_id: topicId})) > 0) {
        this.body = {result: 'fail', message: 'target topic not found.'};
        return;
    }
    yield Subscribe.update({_id: id}, {$set: {topic: topicId}});
    this.body = {result: 'success'};
});

router.post('/api/subscribe/delete', function *() {
    let data = yield parse(this);
    let feedId = data.feedId;
    if(!feedId) {
        this.body = {result: 'fail', message: 'target feed not found.'};
        return;
    }
    let accountId = this.session.account._id;
    let id = accountId + '#' + feedId;
    yield Subscribe.remove({_id: id});
    this.body = {result: 'success'};
});

router.get('/api/subscribe/listPreviewFeedProjects/:feedId', function *() {
    let feedId = this.params.feedId;
    let feed = yield FeedSource.findOne({ _id: feedId });
    let es = ESClientFactory.get();

    let projectIdList = (yield es.search({
        index: 'boom',
        type: 'project',
        from: 0,
        size: 12,
        body: {
            query: {filtered: {
                filter: { bool: { must:  [
                    {term: {isDel: 0}},
                    {term: {feed: feedId}}
                ]} }
            }},
            sort: {"datePublished":   {"order": "desc"}}
        },
        _source: false
    })).hits.hits;
    projectIdList = _.map(projectIdList, p => p._id);
    let projectList = yield Project.find(
        {_id: {$in: projectIdList}}
    );
    projectList = _.sortBy(projectList, p => projectIdList.indexOf(p.id));

    this.body = { feed: feed, list: projectList };
});

router.get('/api/clearEvent', function *() {
    let account = this.session.account;
    yield AccountEvent.remove({ _id: account._id });
    this.body = { status: 'success' };
});

router.post('/api/guide/subscribe/save', function *() {
    let data = yield parse(this);
    let account = this.session.account;

    let feedCategoryGroup = data.feedCategoryGroup;
    let feedCategories = data.feedCategories;
    let feeds = data.feeds;

    if (feedCategoryGroup && feedCategoryGroup.trim()) {
        yield AccountInfo.update({ _id: account._id }, { $set: { job: feedCategoryGroup } }, { upsert: true });
    }

    if (feedCategories && feedCategories.length > 0) {
        yield AccountInfo.update({ _id: account._id }, { $addToSet: { likeFeedCategories: { $each: feedCategories } } }, { upsert: true });
    }

    let topicResult;
    if (feeds && feeds.length > 0) {
        let topic = yield SubscribeTopic.findOne({ name: '未分组', account: account._id });
        if(!topic) {
            topic = new SubscribeTopic({
                name: '未分组',
                account: account._id
            });
            yield topic.save();
        }

        let topicId = topic._id;

        for (let i=0; i<feeds.length; i++) {
            let feed = feeds[i];
            yield Subscribe.update({ _id: account._id + '#' + feed._id },
                { $set: { name: feed.name, topic: topicId, feed: feed._id, account: account._id } }, { upsert: true });
        }
        topicResult = { _id: topicId, name: topic.name };
    }
    yield AccountEvent.update({ _id: account._id }, { $addToSet: { events: 'guided' } }, { upsert: true });

    this.body = { status: 'success', data: topicResult };
});

// [{ w: int, any }, { w: int, any }, {}]
function randomWithWeight(arr, result = [], count = 0) {

    if (count >= arr.length) {
        result = arr;
        return;
    }

    if (count > 0 && arr.length != 0) {
        arr.sort((a, b) => b.w - a.w);
        let ws = arr.map(it => it.w);
        let array = ws.slice();
        if (array.length == 1) {
            result.push(arr[0]);
            return;
        }

        let min = array[array.length - 1];
        array = array.map(it => Math.floor(it / min));

        let indexArray = [];
        array.forEach((item, index) => {
            for (let i = 0; i < item; i++) {
                indexArray.push(index);
            }
        });

        let sum = array.reduce((a, b) => a + b, 0);
        let random = Math.floor(Math.random() * sum);
        let index = indexArray[random];

        result.push(arr[index]);

        arr.splice(index, 1);
        randomWithWeight(arr, result, count-1);
    }
}

module.exports = router;
