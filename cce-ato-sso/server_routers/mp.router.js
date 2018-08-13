'use strict';
const _ = require('lodash');
const parse = require('co-body');
const router = require('koa-router')();
const config = require('config');
const rp = require('request-promise');
const co = require('co');
const MongoConnection = require('../common/MongoConnection');
const buildAuthorizations = require('./login.router.js').buildAuthorizations;
const generateCode = require('./login.router.js').generateCode;
const generateToken = require('./login.router.js').generateToken;
const client = require('../common/RedisConnection').get();

let mpAccessToken = null;
let mpExpiresIn = 7200;
let jsApiTicket = null;

const onMenuShareTimeline = "onMenuShareTimeline";
const onMenuShareAppMessage = "onMenuShareAppMessage";

router.get('/api/jssdk/config', function* () {
    let url = this.query.url;
    let signObj = sign(jsApiTicket, url);
    delete signObj.jsapi_ticket;
    signObj.appId = config.get('weixin.jssdk.appId');
    this.body = signObj;
});

router.get('/api/webAuth/code', function* () {
    this.body = getWebAuthCodeUrl(this.query.redirectUrl);
});

router.get('/api/webAuth/userinfo', function* () {
    let code = this.query.code;
    let resp = yield saveWebAuthUserInfo(code);
    if (resp.hasAccount) {
        let account = resp.account;
        account.authorizations = yield buildAuthorizations(db, account);
        yield this.regenerateSession();
        let token = yield generateToken(account);
        let code = yield generateCode(token);
        this.session.token = token;
        this.session.accountId = account._id.toString();
        this.body = { status: true, result: code };
    } else {
        this.body = { status: true, result: '' };
    }
})

/**
 * Call when project start.
*/
co(function* () {
    yield getJssdkToken();
    console.log('Get mp accessToken:' + mpAccessToken);
    yield getJsApiTicket();
    console.log('Get JsApiTicket:' + jsApiTicket);
});


/**
 * Set up a interval method to update accessToken and jsApiTicket.
*/
setInterval(() => {
    co(function* () {
        yield getJssdkToken();
        console.log('update mp accessToken:' + mpAccessToken);
        yield getJsApiTicket();
        console.log('Update JsApiTicket:' + jsApiTicket);
    });
}, (mpExpiresIn - (5 * 60)) * 1000);


function* getJssdkToken() {
    let appId = config.get('weixin.jssdk.appId');
    let appSecret = config.get('weixin.jssdk.appSecret');
    let tokenResp = yield rp({
        uri: config.get('weixin.jssdk.accessToken').replace('#APPID#', appId).replace('#APPSECRET#', appSecret),
        json: true
    });
    if (tokenResp.errcode) {
        console.log(tokenResp);
    }
    mpAccessToken = tokenResp.access_token;
    mpExpiresIn = tokenResp.expires_in;
}

function* getJsApiTicket() {
    let ticketResp = yield rp({
        uri: config.get('weixin.jssdk.jsApiTicket').replace('#ACCESS_TOKEN#', mpAccessToken),
        json: true
    });
    jsApiTicket = ticketResp.ticket;
}

/**The code below which is the sign method copy from WX*/

const createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

const createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

const raw = function (args) {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
const sign = function (jsapi_ticket, url) {
    let ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    let string = raw(ret);
    let jsSHA = require('jssha');
    let shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');

    return ret;
};

const getWebAuthCodeUrl = (redirectUrl) => {
    return config.get('weixin.webAuth.code').replace('#APPID#', config.get('weixin.webAuth.appId')).replace('#REDIRECT_URI#', redirectUrl).replace('#SCOPE#', 'snsapi_userinfo');
}

function* saveWebAuthUserInfo(code) {
    let db = MongoConnection.get('account');
    let accessTokenUrl = config.get('weixin.webAuth.accessToken')
        .replace('#APPID#', config.get('weixin.webAuth.appId'))
        .replace('#SECRET#', config.get('weixin.webAuth.appSecret'))
        .replace('#CODE#', code);
    let resp = yield rp({ uri: accessTokenUrl, json: true });
    let openid = resp.openid;
    let accessToken = resp.access_token;
    let wechatAccountObj = yield db.collection('wechat_account').findOne({ openid: openid, ssoType: 'webAuth' });
    if (!wechatAccountObj) {
        let userInfoUrl = config.get('weixin.webAuth.userInfo').replace('#ACCESS_TOKEN#', accessToken).replace('#OPENID#', openid);
        let userInfoObj = yield rp({ uri: userInfoUrl, json: true });
        userInfoObj.ssoType = 'webAuth';
        if (userInfoObj.errcode) return { status: false };
        yield db.collection('wechat_account').insertOne(userInfoObj);
        return { hasAccount: false, status: true };
    }
    let accountObj = yield db.collection('accounts').findOne({ 'weixin.unionid': wechatAccountObj });
    return (accountObj ? { hasAccount: true, account: accountObj, status: true } : { hasAccount: false, status: true });
}

module.exports = router;