'use strict';
const router = require('koa-router')();
const Channel = require('../models/Channel');
const moment = require('moment');
const ChannelFilter = require('../models/ChannelFilter');
const SubscribeTopic = require('../models/SubscribeTopic');
const Subscribe = require('../models/Subscribe');
const FeedSource = require('../models/FeedSource');
const Feedback = require('../models/Feedback');
const AccountEvent = require('../models/AccountEvent');
const AccountTag = require('../models/AccountTag');
const { SSO_API_Client } = require('koa-sso-auth-cli');
const parse = require('co-body');
const _ = require('lodash');
const config = require('config');
const EmailUtils = require('../email/EmailUtils');

router.get('/feedback/:module', function *() {
    let account = this.session.account;
    yield this.render('feedback', { account: account, module: this.params.module });
});

router.post('/api/feedback/add', function *() {
    try {
        let data = yield parse(this);
        let account = this.session.account;
        let email = data.email || account.username;
        let content = data.content;
        let module = data.module;
        let accountId = account._id;
        let dateCreated = new Date();

        yield new Feedback({ email, content, module, accountId, dateCreated }).save();
        yield EmailUtils.sendEmail(config.get('feedback_email'), 'feedback.template.html',
            { email, content, module, accountId, dateCreated: moment(dateCreated).format() });

    } catch (e) {
        console.error(e);
        this.body = { status: 'error' };
    }

    this.body = { status: 'ok' };
});

//@TODO 这里的account只是个实验,到底如何组织个人人证信息还是一个待考虑的话题
router.get('/api/global', function * () {

    let account = yield SSO_API_Client.getUserInfo(this.session.token);
    this.session.account = account;

    let channels = yield Channel.find({$or: [{tenancy: {$in: account.tenancies}}, {open: 1}]});
    let topics = yield SubscribeTopic.find({account: account._id});
    let subscribes = yield Subscribe.find({account: account._id});
    let feeds = yield FeedSource.find({_id: {$in: _.map(subscribes, s=>s.feed)}}, {originId: 0});
    let event = yield AccountEvent.findOne({_id: account._id.toString() });

    let model = {};
    let accountTag = yield AccountTag.findOne({ _id: account._id });

    account.tags = accountTag ? accountTag.tags : [];
    account.events = event && event.events || [];
    model.account = account;
    model.channels = channels;
    model.topics = topics;
    model.subscribes = subscribes;
    model.feeds = feeds;

    this.body = model;
});

router.get('/api/channel/filters/:channelId', function *() {
    let account = this.session.account;
    let channelId = this.params.channelId;
    let channel = yield Channel.findOne({ _id: channelId, tenancy: {$in: account.tenancies }});
    if (channel) {
        let filters = channel.filters;
        if (filters && filters.length != 0) {
            let result = yield ChannelFilter.find({ _id: { $in: filters } });
            this.body = { status: 'ok', result: result };
            return;
        }
    }

    this.body = { status: 'ok', result: [] };
});

module.exports = router;