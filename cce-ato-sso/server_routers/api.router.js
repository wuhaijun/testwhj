const client = require('../common/RedisConnection').get();
const router = require('koa-router')();
const rp = require('request-promise');
const _ = require('lodash');
const config = require('config');
const ObjectID = require('mongodb').ObjectID;
const {getComponentToken} = require('../common/WechatUtils');
const MongoConnection = require('../common/MongoConnection');
const AuthorizationUtils = require('koa-sso-auth-cli').AuthorizationUtils;

router.get('/api/code/check', function *() {
    let code = this.query.code;
    if (code) {
        let token = yield client.getAsync('code-' + code);
        if(!token) {
            this.body = { status: false, message: 'code已过期, 请重新获取' };
            return;
        }
        let account = yield client.getAsync('token-' + token);
        if (!account) {
            this.body = { status: false, message: 'token已过期, 请重新登录' };
            return;
        }
        this.body = { status: true, result: token };

    } else {
        this.body = { status: false, message: '没有找到code' };
    }
});

router.get('/api/token/check', function *() {
    let token = this.query.token;
    if (!token) {
        this.body = { status: false, message: '没有找到token' };
        return;
    }
    let exists = yield client.existsAsync('token-' + token);
    if(!exists) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    this.body = { status: true };
});

router.get('/api/getUserInfo', checkTokenAccount, function * () {
    let db = MongoConnection.get('account');
    let account = this.account;
    let roleList = yield db.collection('tenancy_roles')
        .find({_id: {$in: _.flatten(
            _.map(account.tenancies, v => v.roles)
        )}})
        .toArray();
    let defaultRole = yield db.collection('customer_roles').findOne({_id: 'default'});
    let authorizations = AuthorizationUtils.buildAccountAuth(roleList, defaultRole);
    this.body = { status: true, result: {
            _id: account._id,
            username: account.username,
            nickname: account.nickname,
            validDate: account.validDate,
            avatar: account.avatar,
            bindWechatMpList: account.bindWechatMpList,
            authorizations: authorizations,
            tenancies: _.map(account.tenancies, (v, k) => k),
            validDate:account.validDate,
            weixin:account.weixin
        }
    };
});

router.get('/api/getModules', function *() {
    this.body = { status: true, result: AuthorizationUtils.getModules()};
});

router.get('/api/getMPList', checkTokenAccount, function *() {
    let db = MongoConnection.get('account');
    let account = this.account;
    let bindWechatMpList = account.bindWechatMpList;
    if(!bindWechatMpList) {
        this.body = { status: true, result: [] };
        return;
    }
    let mpList = yield db.collection('wechat_mp')
        .find({_id: {$in: bindWechatMpList}}, {authorizer_info: 1}).toArray();
    mpList = _.map(mpList, o => {
        o.authorizer_info._id = o._id;
        return o.authorizer_info;
    });
    this.body = { status: true, result: mpList };
});

router.get('/api/getMpAccessToken/:id', checkTokenAccount, function *() {

    let account = this.account;
    let mpId = this.params.id;
    if(_.indexOf(account.bindWechatMpList, mpId) == -1) {
        this.body = { status: false, message: '无权访问该公众号'};
        return;
    }

    let db = MongoConnection.get('account');
    let col = db.collection("wechat_mp");
    let mp = yield col.findOne({_id: mpId});
    if(!mp) {
        this.body = { status: false, message: '没有授权的公众号'};
        return;
    }

    if('fail' == (yield refreshToken(col, mp))) {
        this.body = { status: false, message: '刷新公众号失败'};
        return;
    }

    this.body = { status: true, result: mp.authorizer_access_token};
});

function * refreshToken(col, mp) {
    if(Date.now() > ( mp.authorizer_token_update_time.getTime() + (mp.expires_in - 200) * 1000 ) ) {
        let token = yield getComponentToken();
        console.log('refresh token', mp.authorizer_appid, mp['authorizer_refresh_token']);
        let url = `https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${token}`;
        let res = yield rp({
            method: 'POST',
            url: url,
            body: {
                "component_appid": config.get("weixin.appId"),
                "authorizer_appid": mp['authorizer_appid'],
                "authorizer_refresh_token": mp['authorizer_refresh_token']
            },
            json: true
        });

        if(res.errmsg) {
            return 'fail';
        }

        res.authorizer_token_update_time = new Date();
        yield col.updateOne({_id: mp._id}, {$set: res});
        mp.authorizer_access_token = res.authorizer_access_token;
    }
    return 'ok';
}

function * checkTokenAccount(next) {
    let db = MongoConnection.get('account');
    let token = this.query.token;
    if (!token) {
        this.body = { status: false, message: '没有找到token' };
        return;
    }
    let account = JSON.parse(yield client.getAsync('token-' + token));
    if(!account) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    account = yield db.collection('accounts').findOne({_id: ObjectID(account._id)});
    if(!account) {
        this.body = {status: false, message: '该用户不存在'};
        return;
    }
    this.account = account;
    yield next;
}

module.exports = router;