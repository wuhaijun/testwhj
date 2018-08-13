'use strict';

const router = require('koa-router')();
const parse = require('co-body');
const _ = require('lodash');

const Article = require('../models/editor/Article');
const ArticleContent = require('../models/editor/ArticleContent');

const {getPagination} = require('../common/PaginationUtils');

const PAGE_SIZE = 20;

router.get('/article/list', function *() {
    let query = {account: this.session.account._id};
    let count = yield Article.count(query);

    let page = _.toInteger(this.query.page) || 1;
    let pageSize = _.toInteger(this.query.size) || PAGE_SIZE;

    let pagination = getPagination(page, pageSize, count);
    let list = yield Article.find(query).sort({lastUpdated: 'desc'}).skip(pagination.offset).limit(pageSize);
    this.body = {list, pagination};
});

router.get('/article/syncList', function *() {
    let query = {account: this.session.account._id, status: {$ne: 3}};
    let count = yield Article.count(query);

    let page = _.toInteger(this.query.page) || 1;
    let pageSize = _.toInteger(this.query.size) || PAGE_SIZE;

    let pagination = getPagination(page, pageSize, count);
    let list = yield Article.find(query).sort({lastUpdated: 'desc'}).skip(pagination.offset).limit(pageSize);
    this.body = {list, pagination};
});

router.get('/article/get/:id', function *() {
    let id = this.params.id;
    let article = yield Article.findOne({_id: id, account: this.session.account._id});
    if(article) {
        let json = article.toObject();
        json.content = (yield ArticleContent.findOne({_id: id})).content;
        this.body = json;
        json.id = id;
    }else {
        this.body = {message: 'not found'};
    }
});

router.post('/article/save', function *() {
    let data = yield parse(this);
    let article = new Article({
        account: this.session.account._id,
        title: data.title,
        cover: data.cover,
        author: data.author,
        digest: data.digest,
        sourceUrl: data.source,
        status: 1
    });
    yield article.save();
    yield new ArticleContent({
        _id: article._id,
        content: data.content
    }).save();

    this.body = {status: 'ok', id: article.id, _id: article.id}
});

router.post('/article/update/:id', function *() {
    let id = this.params.id;
    let article = yield Article.findOne({_id: id, account: this.session.account._id});
    if(!article) {
        this.body = {status: 'error', errmsg: 'article is not found'};
        return;
    }
    let data = yield parse(this);
    let now = new Date();
    let r = yield Article.update(
        {_id: id},
        {$set: {
            title: data.title,
            cover: data.cover,
            author: data.author,
            digest: data.digest,
            sourceUrl: data.source,
            lastUpdated: now,
            status: article.status == 3 ? 2 : 1
        }});
    if(r.nModified > 0) {
        yield ArticleContent.update({_id: id}, {$set: {
            content: data.content,
            lastUpdated: now
        }});
    }

    this.body = {status: 'ok', id: id}
});

router.get('/article/delete/:id', function *() {
    let id = this.params.id;
    let article = yield Article.findOne({_id: id, account: this.session.account._id});
    if(article) {
        yield article.remove();
        this.body = {message: 'ok'};
    }else {
        this.body = {message: 'not found'};
    }
});

module.exports = router;
