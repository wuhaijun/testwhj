'use strict';
const config = require('config');
const client = require('../utils/RedisConnection').get();
const Utils = require('../utils/Utils');
const REDIS_SESSION_PREFIX = Utils.REDIS_SESSION_PREFIX;

module.exports = function (server) {
    const login = require('./login');
    server.use(login.routes()).use(login.allowedMethods());
    const tool = require('./tool');
    server.use(tool.routes()).use(tool.allowedMethods());

    server.use(function* (next) {
        try {
            let headers = this.headers;
            let sessionId = headers.sessionid;
            if (!sessionId) {
                this.body = { errmsg: '未登录用户不能执行此次访问', errcode: 10000 };
                return;
            }
            let openId = yield client.getAsync(REDIS_SESSION_PREFIX + sessionId);
            if (openId) {
                this.sessionId = sessionId;
                this.openId = openId;
                yield next;
            } else {
                this.body = { errmsg: '用户登录状态过期,请重新登录', errcode: 10000 };
            }
        } catch (e) {
            console.log(e);
        }
    });

    const theme = require('./theme');
    server.use(theme.routes()).use(theme.allowedMethods());
    const project = require('./project');
    server.use(project.routes()).use(project.allowedMethods());

    const user = require('./user');
    server.use(user.routes()).use(user.allowedMethods());
};