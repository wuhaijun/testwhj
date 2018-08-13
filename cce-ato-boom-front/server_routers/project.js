'use strict';
const router = require('koa-router')();
const Channel = require('../models/Channel');
const Project = require('../models/Project');
const ProjectText = require('../models/ProjectText');
const ProjectLikeAccount = require('../models/ProjectLikeAccount');
const ProjectCollect = require('../models/ProjectCollect');
const AccountTag = require('../models/AccountTag');
const ProjectViewLog = require('../models/ProjectViewLog');
const FeedSource = require('../models/FeedSource');
const Subscribe = require('../models/Subscribe');
const fileUrlUtil = require('../common/FileUrlUtil');
const ESClientFactory = require('../common/ESClientFactory');
const RedisUtil = require('../common/RedisUtil');
const parse = require('co-body');
const config = require('../common/config');
const AuthorizationUtils = require('koa-sso-auth-cli').AuthorizationUtils;

const moment = require('moment');
const _ =require('lodash');

const tagsJoin = ',';
const defaultPageSize = 24;

router.get('/api/hot/projects', function *() {
    let page = parseInt(this.query.page);
    let pageSize = parseInt(this.query.pageSize);
    let offset = (page - 1) * pageSize;
    if(page > 40) {
        this.body = [];
        return;
    }

    let channels = yield Channel.find({ parent: { $in: ['2', '3'] } });
    channels = channels.map( it => it._id );
    channels = ['2', '3', ...channels];

    let es = ESClientFactory.get();
    let query = { filtered: { filter: { bool: { must: [{term: {isDel: 0}}, {terms: {channel: channels}}] } } } };
    let sort = [{"datePublished": {"order": "desc"}}, {"dateCreated": {"order": "desc"}}];
    let projectIdList = (yield es.search({
        index: 'boom',
        type: 'project',
        from: offset,
        size: pageSize,
        body: { query, sort },
        _source: false
    })).hits.hits;

    projectIdList = _.map(projectIdList, p => p._id);
    let projects = yield Project.find({ _id: {$in: projectIdList }});
    projects = yield queryProjectListFeedAndChannel(projects);
    this.body = projects;
});

router.get('/api/recommend/projects', function *() {
    let page = parseInt(this.query.page);
    let pageSize = parseInt(this.query.pageSize);
    let offset = (page - 1) * pageSize;
    if(page > 40) {
        this.body = [];
        return;
    }

    let recommendFeeds = yield FeedSource.find({ type: 'wechat', 'weight.manual_recommend': 1 });
    let feedIds = recommendFeeds.map(feed => feed._id.toString());

    let es = ESClientFactory.get();
    let query = {
        filtered: {
            filter: {
                bool: {
                    must: [ { term: { isDel: 0 } }, { terms: { feed: feedIds }}]
                }
            }
        }
    };

    let sort = [{"datePublished": {"order": "desc"}}, {"dateCreated": {"order": "desc"}}];
    let projectIdList = (yield es.search({
        index: 'boom',
        type: 'project',
        from: offset,
        size: pageSize,
        body: { query, sort },
        _source: false
    })).hits.hits;

    projectIdList = _.map(projectIdList, p => p._id);

    let projects = yield Project.find({ _id: {$in: projectIdList }});
    projects = _.sortBy(projects, p => projectIdList.indexOf(p.id));

    projects = yield queryProjectListFeedAndChannel(projects);

    this.body = projects;
});

router.get('/api/project/list', function *() {
    let page = parseInt(this.query.page) || 1;
    if(page < 1) {
        page = 1;
    }else if(page > 40) {
        this.body = [];
        return;
    }

    let es = ESClientFactory.get();
    let mustFilter = [{term: {isDel: 0}}];
    let filtered = { filter: { bool: { must: mustFilter } } };
    let query = { filtered: filtered };
    let sort = [];

    if(this.query.channel) {
        let channel = yield Channel.findOne({_id: this.query.channel});
        if(!channel || (channel.open != 1 && _.indexOf(this.session.account.tenancies, channel.tenancy) == -1)) {
            this.body = [];
            return;
        }
        if (channel.level != 1) {
            mustFilter.push({term: {channel: this.query.channel}});
        } else {
            let channels = yield Channel.find({ parent: channel._id }, { _id: 1});
            if (channels.length == 0) {
                mustFilter.push({term: {channel: this.query.channel}});
            } else {
                mustFilter.push({terms: {channel: channels.map(c => c._id)}});
                // mustFilter.push({
                //     bool: { should: channels.map(channel => { return { term: { channel: channel._id } } }) }
                // });
            }
        }

        for(let k in this.query) {
            if(k.startsWith('p:')) {
                mustFilter.push({term: {["parameters." + k.substring(2)]: this.query[k]}});
            }
        }
    }


    if(this.query.feed) {
        let feedId = this.query.feed;
        let feedIdList;
        if(feedId == 'subscribe') {
            feedIdList = _.map(
                yield Subscribe.find({account: this.session.account._id}, {feed: 1}),
                f => f.feed
            );
        }else if(feedId.startsWith('t_')) {
            let topicId = feedId.substring(2);
            feedIdList = _.map(
                yield Subscribe.find({account: this.session.account._id, topic: topicId}, {feed: 1}),
                f => f.feed
            );
        } else {
            feedIdList = [feedId];
        }
        mustFilter.push({terms: {feed: feedIdList}});
    }

    if(this.query.tag) {
        mustFilter.push({term: {tags: this.query.tag}});
    }

    let kw = this.query.keyword;
    if(kw) {
        if(kw.startsWith('tag:')) {
            kw = kw.substring(4);
            mustFilter.push({term: {tags: _.lowerCase(kw)}});
        }else {
            filtered.query = {
                bool : {
                    should: [
                        {match: {title: kw}},
                        {term: {tags: kw}},
                        {match: {desc: kw}},
                        {match: {text: kw}}
                    ]
                }
            };
            sort.push({"_score": {"order": "desc"}});
        }
    }

    sort.push({"datePublished":   {"order": "desc"}});

    let offset = (page - 1) * defaultPageSize;
    let projectIdList = (yield es.search({
        index: 'boom',
        type: 'project',
        from: offset,
        size: defaultPageSize,
        body: {query, sort},
        _source: false,
    })).hits.hits;
    projectIdList = _.map(projectIdList, p => p._id);

    let projectList = yield Project.find( {_id: { $in: projectIdList }} );

    /*
     这一行代码还是必要的 mongo会缓存查询结果。虽然一般情况下，会按照projectIdList的顺序返回list，但是在没有明确指定排序时候并不是一定的。
     */
    projectList = _.sortBy(projectList, p => projectIdList.indexOf(p.id));

    // 查询每个project的feed和channel
    projectList = yield queryProjectListFeedAndChannel(projectList);

    this.body = projectList || [];
});

router.get('/api/project/detail/:id', function *() {
    let id = this.params.id;
    let project;
    project = yield Project.findOne({_id: id, isDel: 0}, {
        originViews: 0,
        originLikes: 0,
        originForwards: 0,
        originShares: 0
    });
    if(!project) {
        this.body = {};
        return;
    }
    yield viewLog(this, project);
    let json = project.toObject();

    let accountId = this.session.account._id;
    let collection = yield ProjectCollect.findOne({_id: accountId +'#' + project._id});
    let like = yield ProjectLikeAccount.findOne({_id: accountId + '#' + project._id});

    json.isLike = like? true: false;
    json.collection = {
        isCollected: collection? true: false,
        tags: (collection && collection.tags) || []
    };

    let text = yield ProjectText.findOne({_id: project._id});
    json.text = text && text.text;
    json.likeProjects = yield likeProjects(project);

    json = yield queryProjectFeedAndChannel(json);
    this.body = json;
});

router.post('/api/project/saveCollectionTags', function *() {
    let data = yield parse(this);
    let pid = data.pid;
    let tags = data.tags;

    if(!tags || tags.length == 0) {
        this.body = { error: 'no tags' };
        return;
    }

    let project = yield Project.findOne({_id: pid, isDel: 0});
    if(!project) {
        this.body = { result: 'not found project info'};
        return;
    }

    let accountId = this.session.account._id;
    let uid = accountId + '#' + project._id;
    let pc = yield ProjectCollect.findOne({_id: uid});
    if(!pc) {
        this.body = { result: 'not found collection info', data: {} };
        return;
    }

    yield ProjectCollect.update({ _id: uid }, { $set: { tags: tags } });
    yield AccountTag.update({ _id: accountId }, { $addToSet: { tags: { $each: tags } } }, {upsert: true});

    this.body =  { result: 'ok', data: { account: accountId, pid: pid, tags: tags } };
});

router.post('/api/project/toggleCollect', function *() {
    let data = yield parse(this);
    let id = data.id;

    let project = yield Project.findOne({_id: id, isDel: 0});
    if(!project) {
        this.body = {error: 'not found'};
        return;
    }

    let accountId = this.session.account._id;
    let uid = accountId + '#' + project._id;
    let pc = yield ProjectCollect.findOne({_id: uid});
    if (pc) {
        yield pc.remove();
        this.body = {operator: 'cancel'};
    } else {
        yield new ProjectCollect({_id: uid, account: accountId, pid: project._id, collectedDate: new Date()}).save();
        this.body = {operator: 'add'};
    }
});

router.get('/api/project/collections', function *() {

    let hasFulltext = AuthorizationUtils.checkKoaSession(this, 'collect.search.fulltext');

    let page = this.query.page || 1;

    if(page < 1) {
        page = 1;
    }else if(page > 20) {
        page = 20;
    }
    let offset = (page - 1) * defaultPageSize;

    let tags = this.query.tags && this.query.tags.split(',');
    let keyword = this.query.keyword;

    let query = {account: this.session.account._id};
    if(tags) {
        query.tags = {$all: tags};
    }

    let collected;
    if(keyword && hasFulltext) {
        collected = yield ProjectCollect.find(query , { pid: 1 } );
    }else {
        collected = yield ProjectCollect.find(query , { pid: 1 } ).sort({collectedDate: -1}).skip(offset).limit(defaultPageSize);
    }
    if(!collected || collected.length == 0) {
        this.body = [];
        return;
    }
    let collectedId = _.map(collected, c => c.pid || c._id.split('#')[1]);

    let projectIdList;
    if (keyword && hasFulltext) {

        let es = ESClientFactory.get();
        let sort = [{"_score": {"order": "desc"}}, {"datePublished":   {"order": "desc"}}];
        let query = {
            filtered: {
                filter: {
                    bool: {
                        must: [
                            { term: { isDel:0 }},
                            { terms: { _id: collectedId }}
                        ]
                    }
                },
                query: {
                    bool : {
                        should: [
                            {match: {title: keyword}},
                            {match: {tags: keyword}},
                            {match: {desc: keyword}},
                            {match: {text: keyword}}
                        ]
                    }
                }
            }
        };

        let plist = (yield es.search({
            index: 'boom',
            type: 'project',
            from: offset,
            size: defaultPageSize,
            body: { query, sort }
        })).hits.hits;

        projectIdList = _.map(plist, p => p._id);
    }else {
        projectIdList = collectedId;
    }

    let projectList = yield Project.find({_id: {$in: projectIdList}});
    projectList = _.sortBy(projectList, p => projectIdList.indexOf(p.id));

    projectList = yield queryProjectListFeedAndChannel(projectList);

    this.body = projectList;
});

router.get('/api/project/collections/tags', function *() {
    let collected = yield ProjectCollect.find({account: this.session.account._id});
    let tags = _.uniq(_.flatten(_.map(collected, c => c.tags)));

    this.body = tags;
});

router.get('/api/project/like/:id', function *() {
    let id = this.params.id;
    let project = yield Project.findOne({_id: id, isDel: 0});

    if(!project) {
        this.body = {error: 'not found'};
        return;
    }

    let accountId = this.session.account._id;

    let uid = accountId + '#' + project._id;

    let pla = yield ProjectLikeAccount.findOne({_id: uid});

    if(pla) {
        project.likes -= 1;
        yield pla.remove();
    }else {
        project.likes += 1;
        yield new ProjectLikeAccount({_id: uid, account: accountId}).save();
    }
    yield project.save();

    this.body = 'ok';
});

router.get('/api/project/download/:id', function *() {
    let id = this.params.id;
    let project = yield Project.findOne({_id: id, isDel: 0}, {downloadName :1, downloadFile : 1});

    if(!project) {
        this.body = {error: 'not found'};
        return;
    }

    yield viewLog(this, project);

    this.body = {url: fileUrlUtil.downloadUrl(project)};
});

//@TODO 这只是一个前期的去重方案
function* viewLog(ctx, project) {
    if(!ctx.session || !ctx.session.account) {
        return;
    }
    let id = project.id;
    let accountId = ctx.session.account._id;
    let uid = accountId + '#' + id;
    let pvl = yield ProjectViewLog.findOne({_id: uid});
    if(!pvl) {
        yield Project.update(
            {_id: id},
            {$inc: {views: 1}}
        );
        project.views = (project.views || 0) + 1;

        yield new ProjectViewLog({
            _id: uid,
            account: accountId,
            pid: id,
            ptype: project.type,
            pfeed: project.feed,
            projectCreatedDate: project.dateCreated
        }).save();
    }
}

function *queryProjectFeedAndChannel(project) {
    if (!project) return;
    let feedId = project.feed;
    let channelId = project.channel;

    if (feedId) {
        let feed = yield FeedSource.findOne({ _id: feedId });
        project.origin = feed ? {
            _id: feed._id,
            name: feed.name,
            type: feed.type,
            originType: 'feed'
        } : { originType: 'feed' };
    } else if (channelId) {
        let channel = yield Channel.findOne({ _id: channelId });
        let parent;
        if (channel.level != 1) {
            parent = yield Channel.findOne({ _id: channel.parent });
        }

        project.origin = channel ? {
            _id: channel._id,
            name: channel.name,
            pname: parent && parent.name,
            type: channel.type,
            icon: channel.icon,
            originType: 'channel'
        } : { originType: 'channel' }
    }
    return project;
}

function * queryProjectListFeedAndChannel(projectList) {
    if (!projectList || projectList.length == 0) return [];

    let feedIds = projectList.map(p => p.feed);
    let channelIds = projectList.map(p => p.channel);

    let feeds = [];
    if (feedIds.length != 0) {
        feeds = yield FeedSource.find({ _id: { $in: feedIds } });
    }
    let feedMap = feeds.reduce((result, feed) => {
        result[feed._id] = feed;
        return result;
    }, {});

    let channels = [];
    if (channelIds.length != 0) {
        let __channels__ = yield Channel.find({ _id: { $in: channelIds } });
        for (let i=0; i<__channels__.length; i++) {
            let cnl = __channels__[i];
            cnl = cnl.toObject();
            if (cnl.level != 1) {
                let parent = yield Channel.findOne({ _id: cnl.parent });
                cnl.parentName = parent.name;
            }
            channels.push(cnl);
        }
    }

    let channelMap = channels.reduce((result, channel) => {
        result[channel._id] = channel;
        return result;
    }, {});

    let results = [];
    projectList.forEach(project => {
        project = project.toObject();
        if (project.feed) {
            let feed = feedMap[project.feed];
            project.origin = feed ? {
                _id: feed._id,
                name: feed.name,
                type: feed.type,
                originType: 'feed'
            } : { originType: 'feed' };

        } else {
            let channel = channelMap[project.channel];
            project.origin = channel ? {
                _id: channel._id,
                name: channel.name,
                pname: channel.parentName,
                type: channel.type,
                icon: channel.icon,
                originType: 'channel'
            } : { originType: 'channel' }
        }

        results.push(project);
    });
    return results;
}

function* likeProjects(project) {
    let mustFilter = [
        {term: {isDel: 0}}
    ];
    let filtered = {
        filter: {
            bool: {
                must: mustFilter,
                must_not: [{term: {_id: project.id}}]
            }
        }
    };
    let query = {filtered};

    if(project.channel) {
        mustFilter.push({term: {channel: project.channel}});
    }

    if(project.feed) {
        mustFilter.push({term: {feed: project.feed}});
    }

    mustFilter.push({terms: {tags: project.tags}});

    let es = ESClientFactory.get();
    let projectIdList = (yield es.search({
        index: 'boom',
        type: 'project',
        from: 0,
        size: 3,
        body: {query},
        _source: false
    })).hits.hits;
    projectIdList = _.map(projectIdList, p => p._id);

    let projectList = yield Project.find({ _id: {$in: projectIdList }});
    projectList = yield queryProjectListFeedAndChannel(projectList);

    return projectList;
}

module.exports = router;