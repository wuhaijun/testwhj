'use strict';
const path = require('path');
const co = require('co');
const _ = require('lodash');
const node_config = require('config');
let config = require('./common/config');
const session = require('koa-generic-session');

config.set({
    SSO_SERVER: node_config.get('sso.server'),
    SSO_CLIENT: node_config.get('sso.client'),
    EDITOR: node_config.get('editor')
});

/* mongo */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('./models/DB').init();

/* koa */
const Koa = require('koa');
const KoaRouter = require('koa-router');
const server = Koa();
server.keys = ['Navy-boom-Schedule'];
server.use(session({
    key: 'navy-boom-schedule',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 * 30
    }
}));

const SwigRender = require('koa-swig');
server.context.render = SwigRender({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: false,
    ext: 'html'
});

server.use(function *(next) {
    try {
        yield next;
    }catch(e) {
        if(!e) {
            this.body = 'no...';
            return;
        }
        if(e.name == 'NotFoundError') {
            this.status = 404;
            yield this.render('404');
        }else {
            if(e.stack) {
                console.log(e.stack);
            }else {
                console.log(e);
            }
            this.body = '服务器故障,请联络管理员';
        }
    }
});

server.use(require('koa-static-server')({rootDir: 'public', rootPath: '/static'}));

let router = new KoaRouter();
const {SSOMiddleware, SSOCliInit, SSO_API_Client, AuthorizationUtils} = require('koa-sso-auth-cli');
co(function * () {
    yield SSOCliInit({
        default_module: 'schedule',
        sso_server: node_config.get('sso.server'),
        sso_api_server: node_config.get('sso.server_api'),
        sso_client: node_config.get('sso.client')
    });
    server.use(SSOMiddleware(server));
    require('./routers')(server);

    router.get('/*', function * () {
        let account = yield SSO_API_Client.getUserInfo(this.session.token);
        this.session.account = account;
        yield this.render('index', {
            account: account,
            config: config.getConfig(),
            modules:
                _.filter(
                    AuthorizationUtils.listHasAuthModules(
                        this.session.account && this.session.account.authorizations.accountAuth
                    ),
                    m => m.id != 'schedule'
                )
        });
    });
    server.use(router.routes()).use(router.allowedMethods());

    let port = node_config.get('port') || 8787;
    server.listen(port);
    console.log('Editor listening on port ' + port);
}).catch(function (e) {
    console.error(e);
});
