'use strict';
const _ = require('lodash');
const co = require('co');
const session = require('koa-generic-session');
const RedisStore = require('koa-redis');
require('dotenv').config({ silent: true });
const env = process.env;
const ENV = env.NODE_ENV || 'develop';
console.log('server start width env:' + ENV);

const config = require('./common/config');
const nodeConfig = require('config');
config.set({
    host: nodeConfig.get('host') || 'localhost:7777',
    sso_server: nodeConfig.get('sso.server'),
    sso_client: nodeConfig.get('sso.client')
});

/* koa */
const Koa = require('koa');
const server = Koa();

server.use(function* (next) {
    try {
        yield next;
    } catch (e) {
        console.log(this.path, this.query, e, e.stack);
        this.status = 404;
        yield this.render('404');
    }
});

server.use(require('koa-static-server')({
    rootDir: 'public',
    rootPath: '/static',
    maxage: 10000000
}));

server.keys = ['bigdata cce-Ato-bOOm-froNt-2016'];
let sessionConfig = {
    key: 'cce-ato-boom-front',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 * 30
    }
};
if(ENV == 'production') sessionConfig.store = RedisStore(nodeConfig.get('redis'));
server.use(session(sessionConfig));

const path = require('path');

const SwigRender = require('koa-swig');
server.context.render = SwigRender({
    root: path.join(__dirname, (ENV == 'production') ? 'public/views' : 'views'),
    autoescape: true,
    // cache: 'memory', // disable, set to false 
    cache: false,
    ext: 'html'
});

/* mongo */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongo_uri = nodeConfig.get('mongo') || 'mongodb://localhost:27017/boom';
mongoose.connect(mongo_uri);

/* elasticsearch */
const esFactory = require('./common/ESClientFactory');
esFactory.init({ host: nodeConfig.get('es') || 'localhost:9200' });

const SSO_CLI = require('koa-sso-auth-cli');
const AuthorizationUtils = SSO_CLI.AuthorizationUtils;
const SSO_API_Client = SSO_CLI.SSO_API_Client;
co(function* () {
    yield SSO_CLI.SSOCliInit({
        default_module: 'boom',
        sso_server: nodeConfig.get('sso.server'),
        sso_api_server: nodeConfig.get('sso.api_server'),
        sso_client: nodeConfig.get('sso.client')
    });

    require('./server_routers')(server);

    let KoaRouter = require('koa-router')();

    KoaRouter.get('/*', function* () {
        yield this.render('main', {
            initConfig: config.getConfig(),
            modulesConfig: AuthorizationUtils.getModules(),
            accountId: this.session.account && this.session.account._id,
            clientAuthConfig: this.session.account && this.session.account.authorizations.accountAuth
        });
    });



    server.use(KoaRouter.routes()).use(KoaRouter.allowedMethods());

    function normalizePort(val) {
        const port = parseInt(val, 10);
        if (!isNaN(port) && port >= 0) {
            return port;
        }
        return 7777;
    }
    const port = normalizePort(nodeConfig.get('port') || '7777');
    server.listen(port);
    console.log('BOOM Front listening on port ' + port);

}).catch(function (e) {
    console.error(e);
});
