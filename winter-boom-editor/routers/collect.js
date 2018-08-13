'use strict';
const router = require('koa-router')();
const parse = require('co-body');
const _ = require('lodash');

const IDUtils = require('../common/IDUtils');
const StyleCollect = require('../models/style/StyleCollect');

router.post('/api/collect/save', function* () {
    let { html, dynamic, styleId } = yield parse(this);
    if (!html) {
        this.body = { status: false, errmsg: 'not found html' };
        return;
    }

    let accountId = this.session.account && this.session.account._id;
    let hash = accountId + '#' + IDUtils.md5ByString(html);
    let style = yield StyleCollect.findOne({ hash });

    if (!style) {
        style = new StyleCollect({
            hash, accountId, dynamic, html, styleId
        });
        yield style.save();
    }
    this.body = { status: true, _id: style.id };
});

router.get('/api/collect/delete', function* () {
    let id = this.query.id;
    if (!id) {
        this.body = { status: false, errmsg: 'not found id' };
        return;
    }
    let accountId = this.session.account && this.session.account._id;
    let sc = yield StyleCollect.findOne({ _id: id, accountId }, { accountId: 1 });
    if (!sc) {
        this.body = { status: false, errmsg: 'can not access' };
        return;
    }

    yield sc.remove();
    this.body = { status: true };
});

router.get('/api/collect/list', function* () {
    let accountId = this.session.account && this.session.account._id;
    let list = yield StyleCollect.find({ accountId }).sort({ _id: -1 });
    this.body = { status: true, list };
});

module.exports = router;
