'use strict';
const config = require('config');
const { SSOMiddleware, AuthorizationUtils } = require('koa-sso-auth-cli');

module.exports = function (server) {

    const loginRouters = require('./login');
    server.use(loginRouters.routes()).use(loginRouters.allowedMethods());
    const previewRouters = require('./preview');
    server.use(previewRouters.routes()).use(previewRouters.allowedMethods());

    AuthorizationUtils.setDefaultModule('boom');
    server.use(SSOMiddleware(server));

    const globalRouters = require('./global');
    const projectRouters = require('./project');
    const subscribeRouters = require('./subscribe');
    const homeRouters = require('./home');

    server.use(globalRouters.routes()).use(globalRouters.allowedMethods());
    server.use(projectRouters.routes()).use(projectRouters.allowedMethods());
    server.use(subscribeRouters.routes()).use(subscribeRouters.allowedMethods());
    server.use(homeRouters.routes()).use(homeRouters.allowedMethods());
};