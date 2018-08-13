'use strict';
const router = require('koa-router')();
const parse = require('co-body');
const UsedEmoji = require('../models/emoji/UsedEmoji');

router.get('/emoji/used_list', function *() {
    let query = { account: (this.session.account && this.session.account._id ) || '' };
    let emojis = yield UsedEmoji.find(query).sort({ updateTime: -1 ,count: -1 });

    this.body = { emojis: emojis.map(it => it.emoji) };
});

router.post('/emoji/used', function *() {
    let account = (this.session.account && this.session.account._id ) || '';
    let data = yield parse(this);
    let emoji = data.emoji || {};

    yield UsedEmoji.update({ 'emoji.content': emoji.content },
        { $set: { account, emoji, updateTime: new Date() },
          $inc: { count: 1 } }, { upsert: true });

    this.body = { status: true };
});

module.exports = router;
