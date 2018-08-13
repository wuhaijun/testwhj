'use strict';


const router = require('koa-router')();
const config = require('config');
const parse = require('co-body');
const _ = require('lodash');
const rp = require('request-promise');

const Article = require('../models/Article');
const ArticleContent = require('../models/ArticleContent');

const StyleItem = require('../models/Style');
const StyleType = require('../models/StyleType');
const StyleTemplate = require('../models/StyleTemplate');

const PAGE_SIZE =80;


router.get('/api/getUserInfo', function *() {
    this.body = { status: true, account: this.session.account }
});

router.get('/api/types', function *() {
    let typeList = yield StyleType.find({});
    this.body = { status: true, result: typeList };
});

router.get('/api/styles', function *() {
    let styleList = yield StyleItem.find({ status: { $in: [ 0, 1 ] } }).limit(20).sort({ updateTime: -1 });
    this.body = { status: true, result: styleList };
});

router.get('/api/style/type/:type', function *() {
    let type = this.params.type;
    let query = { status: { $in: [ 0, 1 ] } };
    if(type && type != 'undefined') {
        query['types'] = { $all: [type] };
    }

    let styleList = yield StyleItem.find(query).sort({ updateTime: -1 });
    this.body = { status: true, result: styleList };
});

router.get('/api/style/status/:status', function *() {
    let status = this.params.status;

    let styleList = yield StyleItem.find({ status: status }).sort({ updateTime: -1 });
    this.body = { status: true, result: styleList };
});

router.post('/api/style/delete/:_id', function *() {
    let _id = this.params._id;
    yield StyleItem.update({ _id: _id }, { $set: { status: -1 } });

    this.body = { status: true };
});

router.post('/api/style/publish/:_id', function *() {
    let _id = this.params._id;
    yield StyleItem.update({ _id: _id }, { $set: { status: 1 } });

    this.body = { status: true };
});

router.post('/api/style/publishAll', function *() {
    yield StyleItem.update({ status: 0 }, { $set: { status: 1 } }, { multi: true });

    this.body = { status: true };
});

router.post('/api/style/undelete/:_id', function *() {
    let _id = this.params._id;
    yield StyleItem.update({ _id: _id }, { $set: { status: 0 } });

    this.body = { status: true };
});

router.post('/api/style/update/:_id', function *() {
    let _id = this.params._id;
    let style = yield parse(this);
    style.updateTime = new Date();

    yield StyleItem.update({ _id: _id }, { $set: style });

    this.body = { status: true };
});

router.post('/api/style/add', function *() {
    let style = yield parse(this);
    let item = new StyleItem({
        name: style.name,
        types: style.types,
        html: style.html,
        status: 0,
        sort: 0,
        createTime: new Date(),
        updateTime: new Date()
    });
    yield item.save();

    this.body = { status: true, style: item };
});

router.get('/api/templateTypes', function *() {
    let types = new Set();
    let templateList = yield StyleTemplate.find({});
    for (let template of templateList) {
        template.types.forEach(function(type){
            types.add(type);
        });
    }
    let results = Array.from(types);
    this.body = { status: true, results: results };
});


router.post('/api/template/add', function *() {
    let template  = yield parse(this);
    let item = new StyleTemplate({
        name: template.name,
        types: template.types,
        styleIds: template.styleIds,
        status: 1,
        tags: template.tags,
        sort: 0,
        createTime: new Date(),
    });
    yield item.save();
    this.body = { status: true, template: item };
});


/***
 * 文章列表
 */

router.get('/article/list', function *() {
    let query = { };
    let count = yield Article.count(query);

    let page = _.toInteger(this.query.page) || 1;
    //let pageSize = _.toInteger(this.query.size) || PAGE_SIZE;
    let pageSize = count;

    let pagination = getPagination(page, pageSize, count);
    let list = yield Article.find(query).sort({lastUpdated: 'desc'}).skip(pagination.offset).limit(pageSize);
    this.body = {list, pagination};

});

function getPagination(page, pageSize, count) {
    let offset = (page - 1) * pageSize;
    let maxPage = _.toInteger((count - 1)/pageSize) + 1;
    let hasNext = page < maxPage;
    let hasPrev = page > 1;
    let nextPage = hasNext ? (page + 1) : null;
    let prevPage = hasPrev ? (page - 1) : null;
    return {
        page,
        pageSize,
        count,
        offset,
        maxPage,
        hasPrev,
        hasNext,
        prevPage,
        nextPage
    };
}



router.get('/article/details/:id', function *() {
    let id = this.params.id;
    let article = yield Article.findOne({_id: id});
    if(article) {
        let json = article.toObject();
        json.content = (yield ArticleContent.findOne({_id: id})).content;
        json.id = id;
        this.body = json;
    }else {
        this.body = {message: 'not found'};
    }
});







router.get('/*', function *() {
    yield this.render('index', { config: { SSO_SERVER: config.get('sso.server'), SSO_CLIENT: config.get('sso.client') }});
});

module.exports = router;