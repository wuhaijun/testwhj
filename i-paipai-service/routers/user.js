'use strict';
const router = require('koa-router')();
const parse = require('co-body');
const User = require('../models/User');

router.post('/api/user/setUserInfo', function *() {
    let openId = this.openId;
    let data = yield parse(this);
    yield User.update({ openId }, { $set: data });
    this.body = { status: true };
});

module.exports = router;