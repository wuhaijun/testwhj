'use strict';
const router = require('koa-router')();
const Project = require('../models/Project');
const ThemeCollect = require('../models/ThemeCollect');
const Theme = require('../models/Theme');
const ProjectNote = require('../models/MobileProjectNote');
const ProjectCollect = require('../models/MobileProjectCollect');
const defaultPageSize = 24;
const _ = require('lodash');

const themeCountBase = require('../data/themeCountBase.json');

/**
 * @api {get} /api/user/info 用户信息
 * @apiName info
 * @apiGroup User
 * @apiHeader {String} sessionid
 * @apiSuccessExample {json} Success-Response:
 * { projectCollectCount : 0, projectNoteCount : 0, themeCollectCount:0 }
 */
router.get('/api/user/info', function* () {
    let openId = this.openId;
    let projectCollectCount = yield ProjectCollect.count({ openId: openId });
    let projectNoteCount = yield ProjectNote.count({ openId: openId });
    let themeCollectCount = yield ThemeCollect.count({ openId: openId });
    this.body = { projectCollectCount, projectNoteCount, themeCollectCount };
});

/**
 * @api {get} /api/projectNote/list 标注列表
 * @apiName project note list
 * @apiGroup User
 * @apiHeader {String} sessionid
 * @apiParam {Number{1..40}} page =1 分页参数
 * @apiSuccessExample {json} Success-Response:
 * [{}]
 */
router.get('/api/projectNote/list', function* () {
    let page = parseInt(this.query.page) || 1;
    if (page < 1) {
        page = 1;
    } else if (page > 40) {
        this.body = [];
        return;
    }
    let offset = (page - 1) * defaultPageSize;
    let openId = this.openId;
    let projectNote = yield ProjectNote.find({ openId: openId }).sort({ notedDate: -1 }).limit(defaultPageSize).skip(offset);
    
    let projectIdList = _.map(projectNote,p=>p.pid);
    let projectList = yield Project.find({ _id: { $in: projectIdList } });
    let projectIdMapping = _.keyBy(projectList,'_id');

    let result = [];
    for(let note of projectNote) {
        console.log(note)
        note = note.toObject();
        note.projectTitle = projectIdMapping[note.pid].title;
        result.push(note);
    }

    this.body = result;
});

/**
 * @api {get} /api/themeCollect/list 关注主题列表
 * @apiName theme collect list
 * @apiGroup User
 * @apiHeader {String} sessionid
 * @apiParam {Number{1..40}} page =1 分页参数
 * @apiSuccessExample {json} Success-Response:
 * [{}]
 */
router.get('/api/themeCollect/list', function* () {
    let page = parseInt(this.query.page) || 1;
    if (page < 1) {
        page = 1;
    } else if (page > 40) {
        this.body = [];
        return;
    }
    let offset = (page - 1) * defaultPageSize;
    let openId = this.openId;

    let themeCountList = yield ThemeCollect.aggregate([{ $group: { _id: "$tid", count: { $sum: 1 } } }]);
    let themeCountMap = {};
    for (let theme of themeCountList) {
        themeCountMap[theme._id] = theme.count;
    }

    let themeCollectIdList = yield ThemeCollect.find({ openId: openId }).sort({ notedDate: -1 }).limit(defaultPageSize).skip(offset);
    themeCollectIdList = _.map(themeCollectIdList, t => t.tid);
    let themeList = yield Theme.find({ _id: { $in: themeCollectIdList } });
    let result = [];
    for (let theme of themeList) {
        let temp = { _id: theme._id, name: theme.name, desc: theme.desc, isCollect: true, count: themeCountBase[theme.name] + (themeCountMap[theme._id] || 0) };
        result.push(temp);
    }
    this.body = result;
});

module.exports = router;