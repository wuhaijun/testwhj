'use strict';
const path = require('path');
const co = require('co');
const _ = require('lodash');
const node_config = require('config');
let config = require('./common/config');
const RedisStore = require('koa-redis');
const session = require('koa-generic-session');

require('dotenv').config({ silent: true });
const ENV = process.env.NODE_ENV || 'develop';

/* qiniu */
require('./common/QiniuFileUtils').init(
    process.env.QINIU_AK,
    process.env.QINIU_SK
);

config.set({
    SSO_SERVER: node_config.get('sso.server'),
    SSO_CLIENT: node_config.get('sso.client'),
    QINIU_OUT_LINK: node_config.get('qiniu.outLink')
});

/* mongo */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('./models/DB').init();
const StyleAccountStat = require('./models/style/StyleAccountStat');

/* koa */
const Koa = require('koa');
const KoaRouter = require('koa-router');
const server = Koa();
server.use(require('koa-static-server')({ rootDir: 'public', rootPath: '/static' }));
server.keys = ['winter-boom-Editor'];
let sessionConfig = {
    key: 'winter-boom-editor',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 * 30
    }
};
if (ENV == 'production') sessionConfig.store = RedisStore(node_config.get('redis'));
server.use(session(sessionConfig));

const compress = require('koa-compress');
server.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));

const SwigRender = require('koa-swig');
server.context.render = SwigRender({
    root: path.join(__dirname, (ENV == 'production') ? 'public/views' : 'views'),
    autoescape: true,
    cache: false,
    ext: 'html'
});

server.use(function* (next) {
    try {
        yield next;
    } catch (e) {
        if (!e) {
            this.body = 'no...';
            return;
        }
        if (e.name == 'NotFoundError') {
            this.status = 404;
            yield this.render('404');
        } else {
            if (e.stack) {
                console.log(e.stack);
            } else {
                console.log(e);
            }
            this.body = '服务器故障,请联络管理员';
        }
    }
});

const { SSOMiddleware, SSOCliInit, SSO_API_Client, AuthorizationUtils } = require('koa-sso-auth-cli');
co(function* () {
    yield SSOCliInit({
        default_module: 'editor',
        sso_server: node_config.get('sso.server'),
        sso_api_server: node_config.get('sso.server_api'),
        sso_client: node_config.get('sso.client')
    });

    let homeRouter = new KoaRouter();

    homeRouter.get('/', function* () {
        let account = this.session.token &&
            (yield SSO_API_Client.getUserInfo(this.session.token));
        if (account) {
            this.session.account = account;
        }
        yield this.render('home', {
            account: account,
            config: config.getConfig(),
            modules:
                account &&
                _.filter(
                    AuthorizationUtils.listHasAuthModules(
                        this.session.account && this.session.account.authorizations.accountAuth
                    ),
                    m => m.id != 'editor'
                )
        });
    });

    server.use(homeRouter.routes()).use(homeRouter.allowedMethods());

    //filter
    server.use(SSOMiddleware(server));

    let rootRouter = new KoaRouter();

    rootRouter.get('/editor', function* () {
        let account = this.session.token &&
            (yield SSO_API_Client.getUserInfo(this.session.token));
        if (account) {
            this.session.account = account;
        }
        let debug = this.query.debug;
        yield this.render(debug ? 'debug' : 'index', {
            account: account,
            config: config.getConfig(),
            styleAccountStat:
                (account && (yield StyleAccountStat.findOne({ accountId: account._id })))
                || { topList: [], latestUseMap: {} },
            modules:
                account &&
                _.filter(
                    AuthorizationUtils.listHasAuthModules(
                        this.session.account && this.session.account.authorizations.accountAuth
                    ),
                    m => m.id != 'editor'
                )
        });
    });

    rootRouter.get('/styles', function* () {
        let account = this.session.token &&
            (yield SSO_API_Client.getUserInfo(this.session.token));
        if (account) {
            this.session.account = account;
        }

        yield this.render('index', {
            account: account,
            config: config.getConfig()
        })
    });

    server.use(rootRouter.routes()).use(rootRouter.allowedMethods());

    const emojiRouter = require('./routers/emoji');
    const styleRouter = require('./routers/style');
    const centerVisitorRouter = require('./routers/center_visitor');
    server.use(emojiRouter.routes()).use(emojiRouter.allowedMethods());
    server.use(styleRouter.routes()).use(styleRouter.allowedMethods());
    server.use(centerVisitorRouter.routes()).use(centerVisitorRouter.allowedMethods());




    let loginRouter = new KoaRouter();
    loginRouter.get('/login', function* () {
        this.redirect('/editor');
    });
    server.use(loginRouter.routes()).use(loginRouter.allowedMethods());

    const articleRouter = require('./routers/article');
    const collectionRouter = require('./routers/collection');
    const imageRouter = require('./routers/images');
    const wechatRouter = require('./routers/wechat');
    const collectRouter = require('./routers/collect');
    const centerRouter = require('./routers/center');
    server.use(articleRouter.routes()).use(articleRouter.allowedMethods());
    server.use(imageRouter.routes()).use(imageRouter.allowedMethods());
    server.use(collectionRouter.routes()).use(collectionRouter.allowedMethods());
    server.use(wechatRouter.routes()).use(wechatRouter.allowedMethods());
    server.use(collectRouter.routes()).use(collectRouter.allowedMethods());
    server.use(centerRouter.routes()).use(centerRouter.allowedMethods());

    let port = node_config.get('port') || 8877;
    server.listen(port);
    console.log('Editor listening on port ' + port);
}).catch(function (e) {
    console.error(e);
});
