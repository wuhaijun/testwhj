'use strict';
const parse = require('co-body');
const {post} = require('../common/Fetch');
const router = require('koa-router')({
    prefix: '/accounts'
});

/**
 * @api {post} /accounts/mpList 获取公众号信息
 * @apiName mpList
 * @apiGroup Acounts
 *
 *
 * @apiError {String} errcode 错误码
 * @apiError {String} errmsg 错误信息
 */
router.post('/mpList', function * () {
    this.body = yield post('/accounts/info/batchget', {}, yield parse(this));
});

module.exports = router;
