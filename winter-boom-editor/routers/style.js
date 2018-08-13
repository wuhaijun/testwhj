'use strict';
const router = require('koa-router')();
const parse = require('co-body');
const _ = require('lodash');
const co = require('co');
const {getPagination} = require('../common/PaginationUtils');
const StyleType = require('../models/style/StyleType');
const Style = require('../models/style/Style');
const StyleStat = require('../models/style/StyleStat');
const StyleCollect = require('../models/style/StyleCollect');
const StyleAccountStat = require('../models/style/StyleAccountStat');
const StyleTemplate = require('../models/style/StyleTemplate');

router.get('/styles', function *() {
    yield this.render('index');
});

router.get('/api/types', function *() {
    let styleTypes = [];
    let typeList = yield StyleType.find({});
    typeList.forEach(item => {
        styleTypes.push(item.name);
    });
    let results = Array.from(styleTypes);
    this.body = { status: true, result: results };
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

router.get('/api/template', function *() {
    let query = { status: 1,types: this.query.type};
    let count = yield StyleTemplate.find(query).count();
    let page = _.toInteger(this.query.page) || 1;
    let pageSize = _.toInteger(this.query.size) || 1;
    let pagination = getPagination(page, pageSize, count);
    let templateList = yield StyleTemplate.find(query).skip(pagination.offset).sort({createTime:-1}).limit(pageSize);
    let templates = [];
    for (let template of templateList) {
        //let styles = yield Style.find({ _id : { $in: template.styleIds } });
        let styles = [];
        for(let id of template.styleIds){
            let style = yield Style.findOne({ _id : id });
            styles.push(style);
        }
        templates.push({ template, styles });
    }
    this.body = { status: true, results: templates, pagination: pagination };
});

router.get('/api/styles/:type', function *() {
    let type = this.params.type;
    let platform = "boom";
    let query = { status: 1,platform: platform } ;
    if(type && type != 'all') {
        query['types'] = { $all: [type] };
    }
    let styleList = yield Style.find(query).sort({ _id: -1 });
    this.body = { status: true, result: styleList };
});

router.post('/api/style/use', function *() {
    let { styleId } = yield parse(this);

    if(!styleId) {
        this.body = { status: false };
        return;
    }

    let style = yield Style.findOne({_id: styleId}, {type: 1, types: 1});
    if(!style) {
        this.body = {status: false};
        return;
    }

    let accountId = this.session.account && this.session.account._id;

    let styleStat =  new StyleStat({ styleId, accountId, createTime: new Date()});
    yield styleStat.save();

    this.body = { status: true, result: styleStat };
});

router.get('/api/style/use',function *() {
    let accountId = this.session.account && this.session.account._id;
    let styleStatList = yield StyleStat.find({ accountId: accountId}).sort({createTime:-1});
    let styleIdSet = new Set();
    for(let i = 0;styleIdSet.size < 60 && i<styleStatList.length ;i++) {
        styleIdSet.add(styleStatList[i].styleId);
    }
    let ids = Array.from(styleIdSet);
    let styles = yield Style.find({_id:{$in:ids}, status: 1}).lean();
    const collectSet = yield __getStyleIdFromCollectByAccountId(accountId);
    const styleIdMappingCollectId = yield __getStyleIdMapingCollectIdFromCollectByAccountId(accountId);
    let stylesMap = {};
    for (let style of styles) {
        style.favourite = collectSet.has(style._id.toString());
        style.favouriteId = styleIdMappingCollectId[style._id];
        stylesMap[style._id] = style;
    }
    let results = [];
    styleIdSet.forEach(id=>{
        results.push(stylesMap[id]);
    });

    this.body = { styles:results, status: true, total: 60 };
})

/**
 * FUNC 返回当前用户已经收藏的样式ID数组
 * ————————————————————————————————————————————————*
 * 参数1: accountId string,必须，用户ID
 * 返回结果: ['xxx','xxx2']
*/
const __getStyleIdFromCollectByAccountId = function* (accountId) {
    let styleIdSet = new Set();
    if (!accountId) return styleIdSet;
    let styles = yield StyleCollect.find({ accountId: accountId });
    for (let item of styles) {
        styleIdSet.add(item.styleId);
    }
    return styleIdSet;
}

/**
 * FUNC 返回当前用户已经收藏的样式ID与CollectId对应关系
 * ————————————————————————————————————————————————*
 * 参数1: accountId string,必须，用户ID
 * 返回结果: {'xx':'xx','aa':'aa'}
*/
const __getStyleIdMapingCollectIdFromCollectByAccountId = function* (accountId) {
    if (!accountId) return {};
    let styles = yield StyleCollect.find({ accountId: accountId });
    let styleIdMappingCollectId = {};
    for (let item of styles) {
        if (!item.styleId) continue;
        styleIdMappingCollectId[item.styleId] = item._id;
    }
    return styleIdMappingCollectId;
}

router.get('/api/style/top', function *() {
    let accountId = this.session.account && this.session.account._id;
    let styleId = this.query.styleId;

    if (!accountId || !styleId) {
        this.body = { status: false };
        return;
    }
    let style = yield Style.findOne({_id: styleId}, {type: 1, types: 1});
    if(!style) {
        this.body = {status: false};
        return;
    }
    yield StyleAccountStat.update({accountId}, {$addToSet: {topList: styleId}}, {upsert: true});

    this.body = {status: true};
});

router.get('/api/style/untop', function *() {
    let accountId = this.session.account && this.session.account._id;
    let styleId = this.query.styleId;

    if (!accountId || !styleId) {
        this.body = { status: false };
        return;
    }

    let sas = yield StyleAccountStat.findOne({accountId}, {topList: 1});
    if(!sas) {
        this.body = {status: true};
        return;
    }
    let topList = sas.topList || [];
    let r = _.remove(topList, id => id == styleId);
    if(r.length > 0) {
        yield StyleAccountStat.update({_id: sas._id}, {$set: {topList: topList}});
    }

    this.body = {status: true};
});

module.exports = router;