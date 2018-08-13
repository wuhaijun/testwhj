'use strict';

const co = require('co');

require('dotenv').config();

const env = process.env;

/* mongo */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('./models/DB').init();


const server = require('koa')();
server.use(require('koa-static-server')({rootDir: 'doc', rootPath: '/doc'}));

installRouters(
    require('./routers/test')
);

server.use(require('koa-logger')());

server.use(function *(next) {
    try {
        yield next;
    }catch(e) {
        console.log(this.path, this.query, e, e.stack);
        this.body = {errcode: 500, errmsg: 'server error'};
    }
});

function installRouters(...routers) {
    for(let router of routers) {
        server.use(router.routes()).use(router.allowedMethods());
    }
}

installRouters(
    require('./routers/accounts'),
    require('./routers/article')
);

co(function * () {

    const Fetch = require('./common/Fetch');
    yield Fetch.init('http://' + env.WEIXIN_API);

    let port = 10002;
    server.listen(port);
    console.log('Weixin Boom API listening on port ' + port);

    require('./common/DeleteMpPreview')();

}).catch(function (err) {
    console.error(err);
});
