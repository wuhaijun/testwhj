'use strict';

const co = require('co');
const server = require('koa')();
const config = require('config');

installRouters(require('./routers/test'));

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
    require('./routers/accounts'), //非微信接口
    require('./routers/weixin')
);


co(function * () {

    const MongoSources = require('./common/MongoSources');
    yield MongoSources.connect('account', config.get('mongo.account'));
    yield MongoSources.connect('receive', config.get('mongo.receive'));

    let port = 10001;
    server.listen(port);
    console.log('Weixin API Centre listening on port ' + port);

}).catch(function (err) {
    console.error(err);
});
