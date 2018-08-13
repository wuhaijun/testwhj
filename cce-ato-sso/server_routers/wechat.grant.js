'use strict';

const ObjectId = require('mongodb').ObjectId;
const MongoConnection = require('../common/MongoConnection');
const {getComponentToken} = require('../common/WechatUtils');
const rp = require('request-promise');
const config = require('config');
const _ = require('lodash');

const router = require('koa-router')({
    prefix: '/wechat'
});

router.get('/bind', function * () {
    let query = this.query;
    let auth_code = query['auth_code'];
    if(!auth_code) {
        console.log('bind not found auth_code', query);
        yield this.render('weixin/grant_fail', {errormsg: '未返回正确授权码'});
        return;
    }

    let account = yield getAccount(this);
    if(!account) {
        yield this.render('weixin/grant_fail', {errormsg: '当前用户意外失效'});
        return;
    }

    let token = yield getComponentToken();
    let now = new Date();
    let url = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${token}`;
    let res = yield rp({
        method: 'POST',
        url: url,
        body: {
            "component_appid": config.get("weixin.appId"),
            "authorization_code": auth_code
        },
        json: true
    });

    let info = res['authorization_info'];
    if(!info) {
        console.log('bind not found info', res);
        yield this.render('weixin/grant_fail', {errormsg: '授权失败'});
        return;
    }
    info.authorizer_token_update_time = now;
    info.last_update_date = now;

    let db = MongoConnection.get('account');
    let col = db.collection("wechat_mp");
    yield col.updateOne({_id: info.authorizer_appid}, info, {upsert: true});

    yield db.collection('accounts').updateOne(
        {_id: account._id}, {$addToSet: {bindWechatMpList: info.authorizer_appid}}
    );

    url = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=${token}`;
    res = yield rp({
        method: 'POST',
        url: url,
        body: {
            "component_appid": config.get("weixin.appId"),
            "authorizer_appid": info.authorizer_appid
        },
        json: true
    });
    if(res['authorizer_info']) {
        res.isActive = true;
        yield col.updateOne({_id: info.authorizer_appid}, {$set: res}, {upsert: true});
    }else {
        console.log('authorizer_info not found', res);
        yield this.render('weixin/grant_fail', {errormsg: '获取公众号信息失败'});
        return;
    }

    yield db.collection('wechat_mp_bind_log').insertOne({
        appid: info.authorizer_appid,
        account: account._id
    });

    yield this.render('weixin/grant_success');
});

//router.get('/debug', function * () {
//    yield this.render('weixin/grant_success');
//});

router.get('/prebind', function * () {
    let url = yield getComponentLoginUrl();
    if(!url) {
        this.body = {errormsg: '系统故障，无法获取微信授权链接'};
        return;
    }
     this.body = {url: url};
   // this.body = `<a target="_blank" href="${url}">授权</a>`;
});

router.get('/grant/list', function * () {
    let db = MongoConnection.get('account');
    let account = yield getAccount(this);
    if(!account || !account.bindWechatMpList) {
        this.body = [];
        return;
    }
    let mpList = yield db.collection('wechat_mp')
        .find({_id: {$in: account.bindWechatMpList}}, {authorizer_info: 1}).toArray();
    mpList = _.map(mpList, o => {
        o.authorizer_info._id = o._id;
        return o.authorizer_info;
    });
    this.body = mpList;
});

router.get('/grant/remove/:id', function * () {
    let db = MongoConnection.get('account');
    let account = yield getAccount(this);
    if(!account) {
        this.body =  {status: false, errmsg: '用户意外失效'};
        return;
    }
    let list = account.bindWechatMpList;
    _.remove(list, o => o == this.params.id)
    yield db.collection('accounts').updateOne(
        {_id: ObjectId(this.session.accountId)}, {$set: {bindWechatMpList: list}}
    );
    this.body = {status: true};
});

function * getAccount(ctx) {
    let accountId = ctx.session.accountId;
    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({_id: ObjectId(accountId)});
    return account;
}

function * getComponentLoginUrl() {
    let wc = config.get('weixin');
    let token = yield getComponentToken();
    let pre_auth_code = yield rp({
        method: 'POST',
        uri: 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token='
            + token,
        body: {
            "component_appid": wc.appId
        },
        json: true
    });

    if(!pre_auth_code['pre_auth_code']) {
        console.log("pre_auth_code is null", pre_auth_code);
        return null;
    }

    let callbackUrl = `http://${config.get('host')}/wechat/bind`;
    let url = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${wc.appId}&pre_auth_code=${pre_auth_code["pre_auth_code"]}&redirect_uri=${callbackUrl}`;
    return url;

}

module.exports = router;