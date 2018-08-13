'use strict';
const co = require('co');
const path = require('path');
const koa = require('koa');
const logger = require('koa-logger');
const render = require('koa-swig');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const config = require('config');
const KoaRouter = require('koa-router')();

require('dotenv').config({ silent: true });
const ENV = process.env.NODE_ENV || 'develop';

const app = koa();

// app.use(require('koa-static')(path.join(__dirname, 'build')));
app.use(require('koa-static-server')({ rootDir: 'public', rootPath: '/public' }));
app.use(require('koa-static-server')({ rootDir: 'public/build', rootPath: '/public/build' }));

app.use(function* (next) {
    try {
        yield next;
    } catch (e) {
        console.error(e);
        this.body = { status: false, message: '系统内部错误,请联系管理员!' }
    }
});

app.context.render = render({
    root: path.join(__dirname, (ENV == 'production') ? 'public/views' : 'views'),
    autoescape: true,
    ext: 'html'
});

app.keys = ['cce-ato-sso-2016', 'keys'];
app.use(session({
    key: 'cce-ato-sso',
    store: redisStore(config.get('redis')),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 * 30
    }
}));

function initRouters() {
    let loginRouter = require('./server_routers/login.router.js').router;
    app.use(loginRouter.routes()).use(loginRouter.allowedMethods());

    let apiRouter = require('./server_routers/api.router.js');
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

    let wecahtGrantRouter = require('./server_routers/wechat.grant');
    app.use(wecahtGrantRouter.routes()).use(wecahtGrantRouter.allowedMethods());

    let mpRouter = require('./server_routers/mp.router.js');
    app.use(mpRouter.routes()).use(mpRouter.allowedMethods());


    // route the path to render index
    KoaRouter.get("/*", function* () {
        yield this.render('index');
    });
    app.use(KoaRouter.routes()).use(KoaRouter.allowedMethods());

}

const MongoConnection = require('./common/MongoConnection');
const RedisConnection = require('./common/RedisConnection');
const AuthorizationUtils = require('koa-sso-auth-cli').AuthorizationUtils;
co(function* () {

    yield RedisConnection.init();
    yield MongoConnection.connect(config.get('mongo.receivedb'), 'receivedb');
    yield MongoConnection.connect(config.get('mongo.account'), 'account');

    let db = MongoConnection.getAccountDB();
    let modules = yield db.collection('modules').find().toArray();
    AuthorizationUtils.initBuild(modules);
    initRouters();

    let port = config.get('port');
    app.listen(port);
    console.log('cce-ato-sso listening on port ' + port + ' with env:' + ENV);

}).catch(e => {
    console.error(e);
});
