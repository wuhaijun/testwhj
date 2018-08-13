'use strict';

let config = require('config');



module.exports = function (app) {

    //app.use(require('koa-sso-auth-cli')({
    //    sso_server: config.get('sso.server'),
    //    sso_client: config.get('sso.client')
    //}, app));

    const apiRouters = require('./api.router');
    app.use(apiRouters.routes()).use(apiRouters.allowedMethods());
};