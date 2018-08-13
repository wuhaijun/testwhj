'use strict';
const router = require('koa-router')();
const Style = require('../models/style/Style');
const StyleType = require('../models/style/StyleType');
const StyleStar = require('../models/style/StyleStar');
const StyleCollect = require('../models/style/StyleCollect');
const StyleCopy = require('../models/style/StyleCopy');
const parse = require('co-body');

/**
 * API POST /api/center/star
 *  存储用户点赞的样式
 * ————————————————————————————————————————————————*
 * 参数1: styleId string,必须,样式ID
*/
router.post('/api/center/star', function* () {
    let { styleId } = yield parse(this);
    let accountId = this.session.account && this.session.account._id;
    if (!styleId) {
        this.body = { status: false, errmsg: 'styleId is necessary' };
        return;
    }
    let style = yield StyleStar.findOne({ accountId: accountId, styleId: styleId });
    if (!style) {
        let styleStar = new StyleStar({ accountId, styleId });
        yield styleStar.save();
    }
    this.body = { status: true, msg: 'star' }
})


/**
 * API POST /api/center/star/cancel
 * 删除用户点赞的样式
 * ————————————————————————————————————————————————*
 * 参数1: styleId string,必须,样式ID
*/
router.post('/api/center/star/cancel', function* () {
    let { styleId } = yield parse(this);
    let accountId = this.session.account && this.session.account._id;
    if (!styleId) {
        this.body = { status: false, errmsg: 'styleId is necessary' };
        return;
    }
    let styleStar = yield StyleStar.findOne({ accountId: accountId, styleId: styleId });
    if (styleStar) {
        yield styleStar.remove();
    }
    this.body = { status: true, msg: 'cancel star' }
})

/**
 * API GET /api/center/favourite
 *  获取用户收藏的样式列表
 * ————————————————————————————————————————————————*
 * 返回结果 {styles:[],total:0,status:true} 
*/
router.get('/api/center/favourite', function* () {
    let accountId = this.session.account && this.session.account._id;
    let styles = yield StyleCollect.find({ accountId: accountId }).sort({ _id: -1 }).lean();
    let total = yield StyleCollect.count({ accountId: accountId });

    const countStyleCollectMap = yield __countStyleCollect()

    for (let style of styles) {
        style.favourite = true;
        style.favouriteId = style._id;
        style.favouriteCount = countStyleCollectMap[style.styleId] || 0;
    }

    this.body = { styles, total, status: true };
})

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
 * API POST /api/center/favourite
 *  存储用户收藏的样式
 * ————————————————————————————————————————————————*
 * 参数1: styleId string,必须,样式ID
 * 参数2:  string,必须,样式html
*/
router.post('/api/center/favourite', function* () {
    let { styleId, html } = yield parse(this);
    let accountId = this.session.account && this.session.account._id;
    if (!styleId) {
        this.body = { status: false, errmsg: 'styleId is necessary' };
        return;
    }
    let style = yield StyleCollect.findOne({ accountId: accountId, styleId: styleId });
    let styleCollect = {};
    if (!style) {
        styleCollect = new StyleCollect({ accountId, styleId, html });
        yield styleCollect.save();
    }
    this.body = { status: true, msg: 'favourite',favouriteId:styleCollect._id }
})


/**
 * API POST /api/center/favourite/cancel
 * 删除用户收藏的样式
 * ————————————————————————————————————————————————*
 * 参数1: styleId string,必须,样式ID
*/
router.post('/api/center/favourite/cancel', function* () {
    let { styleId } = yield parse(this);
    let accountId = this.session.account && this.session.account._id;
    if (!styleId) {
        this.body = { status: false, errmsg: 'styleId is necessary' };
        return;
    }
    let styleCollect = yield StyleCollect.findOne({ accountId: accountId, styleId: styleId });
    if (styleCollect) {
        yield styleCollect.remove();
    }
    this.body = { status: true, msg: 'cancel favourite' }
})

module.exports = router;