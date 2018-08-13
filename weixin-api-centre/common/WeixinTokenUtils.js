'use strict';
const config = require('config');
const rp = require('request-promise');
const ObjectId = require('mongodb').ObjectId;
const MongoSources = require('./MongoSources');
const Lock = require('./LockPromise');

const tokenMap = {};

function * getTokenInfoFromDB(id) {
    let db = MongoSources.getAccount();
    return db.collection('wechat_mp').findOne(
        {_id: id},
        {
            authorizer_access_token: 1,
            expires_in: 1,
            authorizer_appid: 1,
            authorizer_refresh_token: 1,
            authorizer_token_update_time: 1
        }
    );
}

function checkExpireTime(last_time, expires_in) {
    return Date.now() < (last_time.getTime() + (expires_in - 200) * 1000);
}

/* 获取开放平台的token */
const componentLock = Lock();
function * getComponentToken() {
    let wc = config.get('weixin');
    let col = MongoSources.getReceive().collection("wechat_open_component");
    let componentTokenInfo = tokenMap['component'];

    if(!componentTokenInfo) {
        componentTokenInfo = yield col.findOne({_id: "component_access_token"});
    }

    if(!componentTokenInfo ||
        !checkExpireTime(componentTokenInfo.lastUpdateDate, componentTokenInfo['expires_in'])) {
        console.log("wechat open token expires time out.");
        yield componentLock.lock();
        if(!componentTokenInfo ||
            !checkExpireTime(componentTokenInfo.lastUpdateDate, componentTokenInfo['expires_in'])) {
            let ticket  = yield col.findOne({_id: "component_verify_ticket"});
            if(!ticket || (ticket.lastUpdateDate.getTime() + 2000 * 1000) < Date.now()) {
                console.log("wechat open ticket expires time out. ticket time:", ticket.lastUpdateDate);
            }
            let now = new Date();
            let res = yield rp({
                method: 'POST',
                uri: 'https://api.weixin.qq.com/cgi-bin/component/api_component_token',
                body: {
                    "component_appid": wc.appId,
                    "component_appsecret": wc.appSecret,
                    "component_verify_ticket": ticket['component_verify_ticket']
                },
                json: true
            });
            if(!res['component_access_token']) {
                console.log('get component_access_token fail', res);
                return null;
            }
            res.lastUpdateDate = now;
            yield col.updateOne({_id: 'component_access_token'}, res, {upsert: true});
            componentTokenInfo = res;
        }
        componentLock.unlock();
    }
    return componentTokenInfo["component_access_token"];
}

function * refreshToken(tokenInfo) {
    let componentToken = yield getComponentToken();
    let res = yield rp({
        method: 'POST',
        url: `https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${componentToken}`,
        body: {
            "component_appid": config.get("weixin.appId"),
            "authorizer_appid": tokenInfo['authorizer_appid'],
            "authorizer_refresh_token": tokenInfo['authorizer_refresh_token']
        },
        json: true
    });


    if(res.errmsg) {
        console.error(res);
        throw new Error(res.errmsg);
    }

    res.authorizer_token_update_time = new Date();
    let db = MongoSources.getAccount();
    yield db.collection('wechat_mp').updateOne({_id: tokenInfo._id}, {$set: res});
    tokenInfo.authorizer_access_token = res.authorizer_access_token;

    return tokenInfo.authorizer_access_token;
}

/* 获取公众号访问token */
function * getAccessToken(id) {
    if(!id || id.trim().length == 0) {
        throw new Error('请填写有效的公众号id');
    }
    let tokenInfo = tokenMap[id];
    if(!tokenInfo) {
        tokenInfo = yield getTokenInfoFromDB(id);
    }
    if(!tokenInfo) {
        throw new Error('未查找到id为' + id + '的公众号');
    }
    if(checkExpireTime(tokenInfo.authorizer_token_update_time, tokenInfo.expires_in)) {
        return tokenInfo.authorizer_access_token;
    }

    //refresh token
    yield refreshToken(tokenInfo);
    return tokenInfo.authorizer_access_token;
};

module.exports = {
    getComponentToken, getAccessToken
};
