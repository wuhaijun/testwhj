'use strict';
const co = require('co');
const session = require('koa-generic-session');
require('dotenv').config({silent: true});

const config = require('config');
const Koa = require('koa');
const server = Koa();

server.use(function *(next) {
    try {
        yield next;
    }catch(e) {
        this.body = { 'status': 'error', msg: 'system inner error.' };
    }
});
server.use(require('koa-static-server')({
    rootDir: 'public',
    rootPath: '/static',
    maxage: 10000000
}));

/* mongo */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongo_uri = config.get('mongo.paipai') || 'mongodb://localhost:27017/paipai';
mongoose.connect(mongo_uri);

co(function* () {
    const RedisConnection = require('./utils/RedisConnection');
    yield RedisConnection.init();
});

require('./routers')(server);
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (!isNaN(port) && port >= 0) {
        return port;
    }
    return 2018;
}
const port = normalizePort(config.get('port') || '2018');
server.listen(port);
console.log('paipai service listening on port ' + port);
