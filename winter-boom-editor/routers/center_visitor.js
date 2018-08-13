'use strict';
const router = require('koa-router')();
const Style = require('../models/style/Style');
const StyleType = require('../models/style/StyleType');
const StyleStar = require('../models/style/StyleStar');
const StyleCollect = require('../models/style/StyleCollect');
const StyleCopy = require('../models/style/StyleCopy');
const parse = require('co-body');

/**
 * API GET /api/center/styles
 * 获取样式中心样式接口
 * ——————————————————————————————————————————————*
 * 参数1: type string,可选,样式的类型
 * 参数2: limit int,可选,分页参数
 * 参数3: skip int,可选,分页参数
 * 参数4: keyword string,可选,数据库查询参数
 * 参数5: category string,可选,用以区分页面是从哪个类型进入
 * 返回结果: 对象 {styles:[],total:0,status:true}  
 */
router.get('/api/center/styles', function* () {
    let { type, limit = 20, skip = 0, keywords, category } = this.query;
    if(type === "最近使用") this.redirect('/api/style/use');

    const queryParams = __buildQueryParams(category, type, keywords);
    let styles = yield Style.find(queryParams).limit(parseInt(limit)).skip(parseInt(skip)).sort({updateTime:-1}).lean();
    let total = yield Style.find(queryParams).count();

    let accountId = this.session.account && this.session.account._id;
    const countStyleStarMap = yield __countStyleStar();
    const countStyleCollectMap = yield __countStyleCollect();
    const starSet = yield __getStyleIdFromStarByAccountId(accountId);
    const collectSet = yield __getStyleIdFromCollectByAccountId(accountId);
    const styleIdMappingCollectId = yield __getStyleIdMapingCollectIdFromCollectByAccountId(accountId);

    for (let style of styles) {
        style.star = starSet.has(style._id.toString());
        style.favourite = collectSet.has(style._id.toString());
        style.starCount = countStyleStarMap[style._id] || 0;
        style.favouriteCount = countStyleCollectMap[style._id] || 0;
        style.favouriteId = styleIdMappingCollectId[style._id];
    }

    this.body = { styles, total, status: true };
});

/**
 * FUNC 创建Mongo查询参数
 * ———————————————————————————————————————————————*
 * 参数1: category string,页面选择的tab
 * 参数2: type string,样式类型
 * 参数3: keyword string,查询参数
 * 返回结果: 可直接用于Mongo查询的对象
*/
const __buildQueryParams = (category, type, keywords) => {
    let queryParams = { status: 1 };
    if (type && type != '全部') queryParams = Object.assign(queryParams, { types: { $in: [type] } });
    if (keywords) {
        let keywordArray = keywords.split(' ');
        queryParams = Object.assign(queryParams, { $or: [{ tags: { $all: keywordArray } }] });
    }
    return queryParams;
}

/**
 * FUNC 返回样式被喜欢的数量
 * ————————————————————————————————————————————————*
 * 返回结果: {styleId:0}
*/
const __countStyleStar = function* () {
    const count = yield StyleStar.aggregate([{ $group: { '_id': "$styleId", 'total': { $sum: 1 } } }]);
    let result = {};
    for (let item of count) {
        result[item._id] = item.total;
    }
    return result;
}

/**
 * FUNC 返回样式被收藏的数量
 * ————————————————————————————————————————————————*
 * 返回结果: {styleId:0}
*/
const __countStyleCollect = function* () {
    const count = yield StyleCollect.aggregate([{ $group: { '_id': "$styleId", 'total': { $sum: 1 } } }]);
    let result = {};
    for (let item of count) {
        result[item._id] = item.total;
    }
    return result;
}

/**
 * FUNC 返回当前用户已经喜爱的样式ID数组
 * ————————————————————————————————————————————————*
 * 参数1: accountId string,必须，用户ID
 * 返回结果: ['xxx','xxx2']
*/
const __getStyleIdFromStarByAccountId = function* (accountId) {
    let styleIdSet = new Set();
    if (!accountId) return styleIdSet;
    let styles = yield StyleStar.find({ accountId: accountId });
    for (let item of styles) {
        styleIdSet.add(item.styleId);
    }
    return styleIdSet;
}

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

/**
 * API GET /api/center/types
 *  获取所有的样式类型
 * ———————————————————————————————————————————————*
 * 返回结果: {result:[{name:xxx,children:[]}],status:true}
*/
router.get('/api/center/types', function* () {
    let typeList = yield StyleType.find({});
    this.body = { status: true, result: typeList };
});

/**
 * API POST /api/center/copy
 *  记录用户复制
 * ————————————————————————————————————————————————*
 * 参数1: styleId string,必须,样式ID
*/
router.post('/api/center/copy', function* () {
    let { styleId } = yield parse(this);
    let accountId = this.session.account && this.session.account._id;
    if (!styleId) {
        this.body = { status: false, errmsg: 'styleId is necessary' };
        return;
    }
    let date = new Date();
    let styleCopy = new StyleCopy({ accountId: accountId, styleId, date });
    yield styleCopy.save();
    this.body = { status: true, msg: 'copy' }
})


module.exports = router;