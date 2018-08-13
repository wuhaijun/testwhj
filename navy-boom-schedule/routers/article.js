'use strict';

const router = require('koa-router')();
const parse = require('co-body');
const config = require('config');
const rp = require('request-promise');
const Article = require('../models/Article');
const ArticleContent = require('../models/ArticleContent');
const Point = require('../models/Point');
const WechatAccount = require('../models/WechatAccount');
const PointArticle = require('../models/PointArticle');
const Account = require('../models/Account');
const AccountUtils = require('../common/AccountUtils');


router.get('/article/list', function *() {
    let accountId = this.session.account._id;
    let pageSize = this.query.pageSize/1 || 0;
    let pageNum = this.query.pageNum/1 || 0;

    let articles = yield Article.find({ account: accountId }).skip(pageSize * (pageNum - 1)).limit(pageSize).sort({dateCreated: -1});
    this.body = { status: true, results: articles };
});

router.get('/pointArticle/list', function *() {
    let accountId = this.session.account._id;
    let wechatId = this.query.wechatId;
    let publishDate = this.query.date;

    let query = { wechatId, publishDate };
    let account = yield Account.findOne({ _id: accountId });
    if (AccountUtils.isSupplier(account, wechatId) && !AccountUtils.isAgent(account, wechatId)) {
        query['supplier'] = accountId;
    } else if (!AccountUtils.isAgent(account, wechatId)) {
        this.body = { status: true, results: [] };
        return;
    }
    let pointIds = (yield Point.find(query)).map(it => it._id);

    let results = [];
    let pointArticles = yield PointArticle.find({ wechatId, publishDate, pointId: { $in: pointIds } });
    for (let i=0; i<pointArticles.length; i++) {
        let pointArticle = pointArticles[i];
        let wechat = yield WechatAccount.findOne({ _id: pointArticle.wechatId });
        let point = yield Point.findOne({ _id: pointArticle.pointId });
        let article = yield Article.findOne({ _id: pointArticle.articleId });

        results.push({ _id: pointArticle._id, pointArticle, wechat, point, article });
    }
    this.body = { status: true, results: results, pointIds };
});

router.post('/pointArticle/add', function *() {
    let data = yield parse(this);
    let articleId = data.articleId;
    let pointId = data.pointId;
    let publishDate = data.publishDate;
    let tags = data.tags;

    let pointArticle = yield PointArticle.findOne({ pointId });
    if (pointArticle) {
        yield PointArticle.update({ _id: pointArticle._id }, { $set: { publishDate, articleId, tags, lastUpdated: new Date()} });
    } else {
        data.dateCreated = new Date();
        data.lastUpdated = new Date();
        pointArticle = yield new PointArticle(data).save();
    }

    pointArticle = yield PointArticle.findOne({ _id: pointArticle._id });
    let wechat = yield WechatAccount.findOne({ _id: pointArticle.wechatId });
    let point = yield Point.findOne({ _id: pointArticle.pointId });
    let article = yield Article.findOne({ _id: pointArticle.articleId });

    this.body = { status: true, result: { _id: pointArticle._id, pointArticle, wechat, point, article } };
});

router.post('/pointArticle/delete', function *() {
    let data = yield parse(this);
    let _id = data._id;
    yield PointArticle.remove({ _id: _id });

    this.body = { status: true };
});

router.get('/article/content', function * () {
    let _id = this.query._id;
    let articleContent = yield ArticleContent.findOne({ _id: _id });

    this.body = { status: true, result: articleContent.content || '' };
});

router.get('/article/push', function * () {
    this.body = yield req(this, '/article/push');
});

router.get('/article/sync', function * () {
    this.body = yield req(this, '/article/sync');
});

router.get('/article/preview', function * () {
    this.body = yield req(this, '/article/preview');
});

function * req(ctx, path) {
    let query = ctx.query;
    query.account = ctx.session.account._id;
    let opts = {
        url: config.get('editor_api') + path,
        qs: query,
        useQuerystring: true
    };
    let body = yield rp(opts);
    if(typeof body == 'object') {
        return body;
    }
    return JSON.parse(body);
}

module.exports = router;
 