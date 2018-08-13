const router = require('koa-router')();
const request = require('request');
const stream = require('stream');

const {getAccessToken} = require('../common/WeixinTokenUtils');

router.get('/*', errorHandle, function * () {
    let query = yield buildQuery(this.query);
    let url = 'https://api.weixin.qq.com' + this.path;
    this.body = request({
        method: 'GET',
        uri: url,
        qs: query
    }).pipe(stream.PassThrough());
});

router.post('/*', errorHandle, function * () {
    let query = yield buildQuery(this.query);
    let url = 'https://api.weixin.qq.com' + this.path;
    if(this.query.type) {
        this.type = this.query.type;
    }
    //this.type = 'image/jpeg';
    this.body = this.req.pipe(request({
        method: 'POST',
        uri: url,
        qs: query,
    })).pipe(stream.PassThrough());
});

function * errorHandle(next) {
    try {
        yield next;
    }catch (e) {
        console.log(e.stack);
        this.body = {
            errmsg: e.message
        };
    }
}

function * buildQuery(query) {
    let accessToken = yield getAccessToken(query.id);
    if(!accessToken) {
        throw Error('未知原因，无法获得access_token');
    }
    query.access_token = accessToken;
    delete query.id;
    return query;
}

module.exports = router;
