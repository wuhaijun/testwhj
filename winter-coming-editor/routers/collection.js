'use strict';

const router = require('koa-router')();
const _ =require('lodash');

const ProjectCollect = require('../models/collection/ProjectCollect');
const Project = require('../models/collection/Project');
const ProjectText = require('../models/collection/ProjectText');

router.get('/collection/list', function *() {
    let aid = this.session.account._id;
    let pcs = yield ProjectCollect.find({ account: aid }).sort({ collectedDate: -1 }).limit(20);
    let pids = pcs.map(pc => pc.pid );
    let list = yield Project.find({ _id: { $in: pids } });
    list = _.sortBy(list, p => pids.indexOf(p.id));

    this.body = list;
});

router.get('/collection/getText/:id', function *() {
    let pt = yield ProjectText.findOne({ _id: this.params.id });
    this.body = pt;
});

module.exports = router;
