/**
 * 该路由包含了一些后台所需的处理接口 
*/

const Theme = require('../models/Theme');
const DailyNews = require('../models/DailyNews');
const router = require('koa-router')();
const moment = require('moment');
const config = require('config');
const parse = require('co-body');
const rp = require('request-promise');
const request = require('request');
const stream = require('stream');

router.get('/api/tool/initTheme', function* () {
    let themeJson = require('../data/theme.json');
    for (let item of themeJson) {
        let name = item.name
        let theme = yield Theme.findOne({ name: name });
        if (theme) {
            yield Theme.update({ name: name }, { $set: { feeds: item.feeds, desc: item.desc, sort: item.sort } });
        } else {
            yield new Theme({ name: name, image: item.image, feeds: item.feeds }).save();

        }
    }
    console.log('update theme');
    this.body = { info: 'update theme' };
});

router.get('/api/tool/initDailyNews', function* () {
    let dailyNewsJson = require('../data/dailyNews.json');
    for (let item of dailyNewsJson) {
        let type = item.type;
        let status = item.status;
        let publishDate;
        if (item.publishDate)
            publishDate = moment(item.publishDate, 'YYYY.M.DD').toDate();
        for (let id of item.ids) {
            let news = yield DailyNews.findOne({ type: type, id: id });
            if (news) {
                yield DailyNews.update({ type: type, id: id }, { $set: { status: status, publishDate: publishDate } });
            } else {
                yield new DailyNews({ type: type, status: status, id: id, publishDate: publishDate }).save();
            }

        }
    }
    console.log('update dailyNews');
    this.body = { info: 'update dailyNews' };
});

/**
 * @api {post} /api/common/weqr 动态二维码
 * @apiName weqr
 * @apiGroup Common
 *
 * @apiParamExample {JSON} Request-Example:
 * {scene:"",page:"",width:"",auto_color:"",line_color:"",is_hyaline:""}
 * @apiHeader {String} sessionid
  * @apiSuccessExample {json} Success-Response:
 * @apiErrorExample {json} Error-Response:
 */
const fs = require('fs');

router.post('/api/common/weqr', function* () {
    let data = yield parse(this);
    let opts = {
        method: 'POST',
        qs: {id: config.get('weixin.appId')},
        url: config.get('weixin.api') + '/wxa/getwxacodeunlimit',
        json: data
    };
    let body = yield rp(opts);
    var array = '';
    this.header = {'Content-Type': 'image/jpeg'}
    this.body = body;
});

router.get('/api/common/weqr', function* () {
    let scene = this.query.scene;
    let page = this.query.page;
    console.log({scene,page});
    let opts = {
        method: 'POST',
        qs: {id: config.get('weixin.appId'),type :"image/jpeg"},
        url: config.get('weixin.api') + '/wxa/getwxacodeunlimit',
        json: {scene,page}
    };
    // let body = yield rp(opts);
    this.type = "image/jpeg";
    // this.body = yield rp(opts);
    this.body = request({
        method: 'POST',
        qs: {id: config.get('weixin.appId'),type :"image/jpeg"},
        url: config.get('weixin.api') + '/wxa/getwxacodeunlimit',
        json: {scene,page}
    }).pipe(stream.PassThrough());

});


module.exports = router;