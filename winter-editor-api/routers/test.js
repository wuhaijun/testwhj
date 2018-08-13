'use strict';
const {fetch} = require('../common/Fetch');
const router = require('koa-router')();

router.get('/debug', function * () {
    this.body = 'debug';
});

router.get('/rp', function * () {
    this.body = yield fetch('/get');
});

module.exports = router;
