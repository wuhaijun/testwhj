'use strict';

const MongoConnection = require('../common/MongoConnection');
const rp = require('request-promise');
const config = require('config');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

function * getComponentToken() {
    let wc = config.get('weixin');
    let col = MongoConnection.get('receivedb').collection("wechat_open_component");
    let token  = yield col.findOne({_id: "component_access_token"});
    if(!token || (token.lastUpdateDate.getTime() + token['expires_in'] * 1000) < Date.now()) {
        console.log("wechat open token expires time out.");
        //@此处有并发风险
        let ticket  = yield col.findOne({_id: "component_verify_ticket"});
        if(!ticket || (ticket.lastUpdateDate.getTime() + 2000 * 1000) < Date.now()) {
            console.log("wechat open ticket expires time out.");
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
        token = res;
    }
    return token["component_access_token"];
}


module.exports = {
    getComponentToken
};
