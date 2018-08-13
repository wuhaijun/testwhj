module.exports = function(server) {

    let articleRouter = require('./article');
    let wechatRouter = require('./wechat');


    server.use(articleRouter.routes()).use(articleRouter.allowedMethods());
    server.use(wechatRouter.routes()).use(wechatRouter.allowedMethods());
};