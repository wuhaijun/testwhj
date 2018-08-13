'use strict';
const _ = require('lodash');
const parse = require('co-body');
const router = require('koa-router')();
const config = require('config');
const MongoConnection = require('../common/MongoConnection');
const ObjectID = require('mongodb').ObjectID;
const AuthorizationUtils = require('koa-sso-auth-cli').AuthorizationUtils;
const Utils = require('../common/Utils');
const EmailUtils = require('../email/EmailUtils');
const SALT = 'CCeGROUp-BOOM';
const rp = require('request-promise');
const client = require('../common/RedisConnection').get();

router.get('/', function* () {
    this.redirect('/user/login' + this.search);
});

router.get('/welcome', function* () {
    let token = this.session.token;
    if (!token) {
        this.body = '<script>alert("登录已过期, 请重新登录"); location.href="/user/login";</script>';
        return;
    }
    let account = yield client.getAsync('token-' + token);
    if (!account) {
        this.body = '<script>alert("登录已过期, 请重新登录"); location.href="/user/login";</script>';
        return;
    }

    yield this.render('navigation');
});

router.get('/user/login', function* () {
    let token = this.session.token;
    let account = yield client.getAsync('token-' + token);
    let default_system = config.get('sso.default_system');

    if (token && account) {
        let auth_callback = this.query.auth_callback;
        if (!auth_callback) {
            this.redirect(default_system);
        } else {
            let code = yield generateCode(token);
            this.redirect(auth_callback + '?code=' + code);
        }
    } else {
        client.del('token-' + token);
        this.session = null;
        yield this.render('index');
    }
});

router.get('/script/checklogin.js', function* () {
    this.type = 'text/javascript';
    let token = this.session.token;
    let account = yield client.getAsync('token-' + token);
    if (token && account) {
        this.body = 'window.location.href = "/login";'
    } else {
        this.body = '//';
    }
});

router.get('/api/user/logout', function* () {
    let token = this.session.token;
    client.del('token-' + token);
    this.session = null;

    let auth_callback = this.query.auth_callback;
    this.redirect('/?auth_callback=' + auth_callback);
});

router.post('/api/user/login', function* () {
    let token = this.session.token;
    let account = yield client.getAsync('token-' + token);
    let data = yield parse(this);

    // had login
    if (token && account) {
        let code = yield generateCode(token);
        this.body = { status: true, result: code };
    } else {
        let username = data.username;
        let password = data.password;
        let openid = data.openid;
        password = Utils.md5ByString(password + SALT);

        let db = MongoConnection.get('account');
        account = yield db.collection('accounts').findOne({ username: username });

        if (!account) {
            this.body = { status: false, code: 0, message: '该用户名还没有注册!' };
            return;
        }

        if (account.password !== password) {
            this.body = { status: false, code: 1, message: '用户名或密码不正确!' };
            return;
        }

        if (openid) {
            let wxAccount = yield db.collection('wechat_account').findOne({ 'openid': openid });
            if (!wxAccount) {
                this.body = { status: false, code: 2, message: '微信openId错误' };
            }
            account.weixin = wxAccount.weixin;
            yield db.collection('accounts').updateOne({ username: username }, { $set: { weixin: wxAccount } });
        }

        //if (!account.validDate) {
        //    this.body = { status: false, code: 2, message: '请您登录邮箱完成校验!' };
        //    return;
        //}

        account.authorizations = yield buildAuthorizations(db, account);

        client.del('token-' + token);
        yield this.regenerateSession();
        token = yield generateToken(account);
        let code = yield generateCode(token);
        this.session.token = token;
        this.session.accountId = account._id.toString();

        this.body = { status: true, result: code };
    }
});

router.post('/api/user/sendForgetPasswordEmail', function* () {
    let data = yield parse(this);
    let email = data.email;

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (!account) {
        this.body = { status: false, message: '该邮箱还没有注册!' };
        return;
    }

    //if (!account.validDate) {
    //    this.body = { status: false, message: '请您登录邮箱完成校验!' };
    //    return;
    //}

    let validCode = Utils.random();
    let validUrl = 'http://' + config.get('host') + '/user/resetPassword?code=' + validCode;
    yield db.collection('accounts').updateOne({ _id: account._id }, { $set: { validCode: validCode } });

    yield EmailUtils.sendEmail(email, 'forget-password.template.html', { url: validUrl });

    // TODO redirect a page to tell send ok
    this.body = { status: true };
});

router.get('/user/resetPassword', function* () {
    let code = this.query.code;
    if (!code) {
        this.body = '<script>alert("别闹...我错了");location.href="/user/login";</script>';
        return;
    }
    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ validCode: code });
    if (!account) {
        this.body = ('<script>alert("链接已经失效");location.href="/user/login";</script>');
        return;
    }
    //if (!account.validDate) {
    //    this.body = ('<script>alert("请先通过邮箱校验");location.href="/user/login";</script>');
    //    return;
    //}
    yield this.render('index');

});


router.post('/api/user/resetPassword', function* () {
    let data = yield parse(this);
    let code = data.code;
    let password = data.password;

    if (!code || !password) {
        this.body = { status: false, message: '找不到验证码' };
        return;
    }
    password = Utils.md5ByString(password + SALT);

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ validCode: code });
    if (!account) {
        this.body = { status: false, message: '链接已经失效' };
        return;
    }
    //if (!account.validDate) {
    //    this.body = { status: false, message: '您的邮箱地址还没通过验证' };
    //    return;
    //}

    yield db.collection('accounts').updateOne({ validCode: code }, { $set: { password: password, validCode: null } });

    this.body = { status: true };
});

router.post('/api/user/register', function* () {
    let data = yield parse(this);
    let email = data.email;
    let password = data.password;
    let openid = data.openid;

    if (!email || !password || _.trim(email).length == 0 || _.trim(password).length == 0) {
        this.body = { status: false, message: '别闹, 数据都没提交' };
        return;
    }

    if (email.length > 100 || password.length > 100) {
        this.body = { status: false, message: '数据过长' };
        return;
    }

    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        this.body = { status: false, message: '别闹, 提交点儿能用的。' };
        return;
    }

    password = Utils.md5ByString(password + SALT);

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (account) {
        this.body = { status: false, message: '该邮箱已被注册' };
        return;
    }

    account = {};
    if (openid) {
        let wxAccount = yield db.collection('wechat_account').findOne({ 'openid': openid });
        if (!wxAccount) {
            this.body = { status: false, code: 2, message: '微信openId错误' };
        }
        account.weixin = wxAccount;
    }

    let validCode = Utils.random();
    account.username = email;
    account.password = password;
    account.dateCreated = new Date();
    account.tenancies = {};
    account.validCode = validCode;

    let tenancies = yield db.collection('tenancy').find({
        registerAutoJoin: true,
        mailSuffix: email.substring(email.indexOf('@') + 1)
    }).toArray();

    _.each(tenancies, t => {
        account.tenancies[t._id] = {
            roles: t.defaultRoles
        };
    });

    yield db.collection('accounts').insertOne(account);

    let validUrl = 'http://' + config.get('host') + '/api/user/valid?code=' + validCode + '&email=' + email;
    yield EmailUtils.sendEmail(email, 'register-valid.template.html', { url: validUrl });
    this.body = { status: true };
    if (openid) {
        account.authorizations = yield buildAuthorizations(db, account);
        yield this.regenerateSession();
        let token = yield generateToken(account);
        let code = yield generateCode(token);
        this.session.token = token;
        this.session.accountId = account._id.toString();
        this.body.wxLogin = true;
        this.body.redirectUrl = config.get('sso.default_system');
    }
});

router.get('/user/registerOk', function* () {
    let email = this.query.email;

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (!account) {
        this.body = '<script>alert("邮箱没有被注册");location.href="/user/login";</script>';
    }
    yield this.render('index');
});

router.post('/api/user/sendRegisterValidEmail', function* () {
    let data = yield parse(this);
    let email = data.email;

    if (!email) {
        this.body = { status: false, message: '找不到邮箱地址' };
        return;
    }

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ username: email });
    if (!account) {
        this.body = { status: false, message: '该邮箱没有注册' };
        return;
    }

    if (account.validDate) {
        this.body = { status: true, message: '该邮箱已通过验证' };
        return;
    }

    let validCode = Utils.random();
    let validUrl = 'http://' + config.get('host') + '/api/user/valid?code=' + validCode + '&email=' + email;

    yield db.collection('accounts').updateOne({ _id: account._id }, { $set: { validCode: validCode } });
    yield EmailUtils.sendEmail(email, 'register-valid.template.html', { url: validUrl });
    this.body = { status: true };

});

router.get('/api/user/valid', function* () {
    let code = this.query.code;
    let email = this.query.email;

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ validCode: code });
    if (account) {
        if (account.validDate) {
            this.body = '<script>alert("您已经通过注册校验");location.href="/user/login";</script>';
        } else {
            yield db.collection('accounts').update({ _id: account._id }, { $set: { validDate: new Date() } });
            this.body = '<script>alert("您已经通过注册校验,请登录");location.href="/user/login";</script>';
        }
    } else {
        let redirectUrl = '/user/registerOk?email=' + email;
        this.body = '<script>alert("链接已过期,请重新发送");location.href="' + redirectUrl + '";</script>';
    }
});

router.get('/userCenter', function* () {
    let token = this.session.token;
    if (!token) {
        this.body = '<script>alert("登录已过期, 请重新登录");location.href="/user/login";</script>';
        return;
    }
    let account = yield client.getAsync('token-' + token);
    if (!account) {
        this.body = '<script>alert("登录已过期, 请重新登录");location.href="/user/login";</script>';
        return;
    }

    yield this.render('index');
});

router.get('/api/userCenter/getUserInfo', function* () {
    let token = this.session.token;
    if (!token) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    let account = yield client.getAsync('token-' + token);
    if (!account) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    account = JSON.parse(account);

    let db = MongoConnection.get('account');
    account = yield db.collection('accounts').findOne({ _id: new ObjectID(account._id) }, { password: 0 });
    let authorizations = yield buildAuthorizations(db, account);
    account.modules = AuthorizationUtils.listHasAuthModules(authorizations.accountAuth);

    this.body = { status: true, account: account, default_system: config.get('sso.default_system') };
});

router.post('/api/userCenter/updateUserInfo', function* () {

    let token = this.session.token;
    if (!token) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    let oldAccount = yield client.getAsync('token-' + token);
    if (!oldAccount) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    oldAccount = JSON.parse(oldAccount);

    let data = yield parse(this);
    let account = data.account;

    if (account._id !== oldAccount._id) {
        this.body = { status: false, message: '用户信息有误,不能修改' };
        return;
    }

    let _id = new ObjectID(account._id);
    delete account.username;
    delete account._id;

    let db = MongoConnection.get('account');
    yield db.collection('accounts').update({ _id: _id }, { $set: account });
    this.body = { status: true };

});

router.post('/api/userCenter/updatePassword', function* () {
    let token = this.session.token;
    if (!token) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    let oldAccount = yield client.getAsync('token-' + token);
    if (!oldAccount) {
        this.body = { status: false, message: 'token已过期, 请重新登录' };
        return;
    }
    oldAccount = JSON.parse(oldAccount);

    let data = yield parse(this);
    let _id = data._id;
    let oldPassword = Utils.md5ByString(data.oldPassword + SALT);
    let newPassword = Utils.md5ByString(data.newPassword + SALT);

    if (_id !== oldAccount._id) {
        this.body = { status: false, message: '用户信息有误,不能修改' };
        return;
    }

    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ _id: new ObjectID(_id) });
    if (account.password !== oldPassword) {
        this.body = { status: false, message: '输入的旧密码不正确' };
        return;
    }

    yield db.collection('accounts').updateOne({ _id: account._id }, { $set: { password: newPassword } });

    // logout
    client.del('token-' + token);
    this.session = null;

    this.body = { status: true };

});

router.get('/api/weixin/oauth2', function* () {
    let code = this.query.code;
    //TODO state需要根据规则进行校验
    let state = this.query.state;
    let username = this.query.username;
    let appId = config.get("weixin.oauth2.appId");
    let appSecret = config.get("weixin.oauth2.appSecret");
    let accessTokenUrl = config.get("weixin.oauth2.accessToken").replace("#APPID#", appId).replace("#SECRET#", appSecret).replace("#CODE#", code);
    let tokenRespObj = yield rp({
        uri: accessTokenUrl,
        json: true
    });
    if (tokenRespObj.errcode > 0) {
        this.body = '<script>alert("二维码已过期");location.href="/"</script>';
        return;
    }

    let db = MongoConnection.get('account');

    if (username) {
        let account = yield db.collection('accounts').findOne({ username: username });
        let userinfoObj = yield getWxUserinfo(tokenRespObj.openid, tokenRespObj.access_token);
        yield db.collection('accounts').updateOne({ username: username }, { $set: { weixin: userinfoObj } }, false, true);
        yield this.regenerateSession();
        let token = yield generateToken(account);
        let code = yield generateCode(token);
        this.session.token = token;
        this.session.accountId = account._id.toString();
        this.redirect(config.get('sso.default_system'));
        return
    }

    let account = yield db.collection('accounts').findOne({ 'weixin.openid': tokenRespObj.openid });
    if (!account) {
        let userinfoObj = yield getWxUserinfo(tokenRespObj.openid, tokenRespObj.access_token);
        yield db.collection('wechat_account').insertOne(userinfoObj);
        this.redirect('/user/wxcallback?openid=' + tokenRespObj.openid + '&nickname=' + encodeURIComponent(userinfoObj.nickname));

    } else {
        account.authorizations = yield buildAuthorizations(db, account);
        yield this.regenerateSession();
        let token = yield generateToken(account);
        let code = yield generateCode(token);
        this.session.token = token;
        this.session.accountId = account._id.toString();
        this.redirect(config.get('sso.default_system'));
    }
});

router.post('/api/weixin/cancel', function* () {
    let data = yield parse(this);
    let username = data.username;
    let db = MongoConnection.get('account');
    yield db.collection('accounts').updateOne({ username: username }, { $unset: { weixin: '' } }, false, true);
    this.body = { status: true };
});

router.get('/user/login/unValid', function* () {
    let username = this.query.username;
    let redirectUrl = this.query.redirectUrl;
    if (redirectUrl === "null") {
        redirectUrl = config.get('sso.default_system');
    }
    let db = MongoConnection.get('account');
    let account = yield db.collection('accounts').findOne({ username: username });
    if (!account) {
        this.redirect(config.get('sso.default_system'));
        return;
    }
    account.authorizations = yield buildAuthorizations(db, account);
    yield this.regenerateSession();
    let token = yield generateToken(account);
    let code = yield generateCode(token);
    this.session.token = token;
    this.session.accountId = account._id.toString();
    this.redirect(redirectUrl);

});

function* getWxUserinfo(openid, token) {
    let userinfoUrl = config.get("weixin.oauth2.userinfo").replace("#OPENID#", openid).replace("#ACCESS_TOKEN#", token);
    return yield rp({
        uri: userinfoUrl,
        json: true
    });
}

function* buildAuthorizations(db, account) {
    let roleList = yield db.collection('tenancy_roles')
        .find({
            _id: {
                $in: _.flatten(
                    _.map(account.tenancies, v => v.roles)
                )
            }
        })
        .toArray();

    let defaultRole = yield db.collection('customer_roles').findOne({ _id: 'default' });
    return AuthorizationUtils.buildAccountAuth(roleList, defaultRole);
}

function* generateCode(token) {
    let code = Utils.random();
    yield client.setAsync('code-' + code, token);
    yield client.expireAsync('code-' + code, 5);
    return code;
}

function* generateToken(account) {
    let token = Utils.random();
    let key = 'token-' + token;
    yield client.setAsync(key, JSON.stringify({
        _id: account._id
    }));
    yield client.expireAsync(key, 86400 * 30);
    return token;
}

module.exports = {
    router: router,
    buildAuthorizations: buildAuthorizations,
    generateCode: generateCode,
    generateToken: generateToken
};