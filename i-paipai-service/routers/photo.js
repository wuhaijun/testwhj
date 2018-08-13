'use strict';
const _ = require('lodash');
const router = require('koa-router')();
const fs = require('fs');
const moment = require('moment');
const config = require('config');
const QiniuUploader = require('../utils/QiniuUploader');
const Utils = require('../utils/Utils');
const KoaUploadMiddleware = require('./KoaUploadMiddleware');
const User = require('../models/User');
const Photo = require('../models/Photo');

Array.prototype.__push__ = function(val) {
    this.push(val);
    return this;
};

router.post('/api/photo/upload', KoaUploadMiddleware, function *() {
    let data = this.data || {};
    let files = this.files || {};
    let path = files.file && files.file.path;
    let filename = files.file && files.file.filename;
    if (!path || !path.trim()) {
        this.body = { errmsg: '没有选择要上传的文件' };
        return;
    }

    let openId = this.openId;
    let user = yield User.findOne({ openId });
    if (!user) {
        this.body = { errmsg: '用户的sessionId无效, 请尝试重新登录' };
        return;
    }

    let _id = user._id;
    let key = 'i-paipai/' + _id + '/' + filename;
    let respKey = yield QiniuUploader.upload(path, key);

    let stats = fs.statSync(path);
    let size = stats.size;

    let photo = new Photo({
        openId,
        key: respKey,
        size,
        location: data.location,
        address: data.address,
        tags: (data.tags || '').split(',').filter(it => it),
        source: 'qiniu',
        uploadedDate: moment() });

    yield photo.save();

    this.body = { photo: photo };
});

router.get('/api/photo/count', function *() {
    let query = yield generateQuery(this);
    let count = yield Photo.count(query);
    this.body = { count: count };
});

router.get('/api/photo/list', function *() {
    let query = yield generateQuery(this);
    let pageSize = parseInt(this.query.pageSize || 9);
    let pageNum = parseInt(this.query.pageNum || 1);
    let offset = pageSize * (pageNum - 1);

    let photos = yield Photo.find(query, { openId: 0 }).skip(offset).limit(pageSize).sort({ uploadedDate: -1 });
    let results = [];
    photos.forEach(photo => {
        photo = photo.toObject();
        photo.url = config.qiniu.outLink + photo.key;
        results.push(photo);
    });
    this.body = { photos: results };
});

router.get('/api/photo/locations', function *() {
    let openId = this.openId;
    let photos = yield Photo.find({ openId }, { key: 1, location: 1, tags: 1 });

    let result = photos.reduce((rv, x) => { (rv[x['location']] = rv[x['location']] || []).__push__(config.qiniu.outLink + x.key); return rv; }, {});
    let results = [];
    for (let k in result) {
        results.push({
            name: k,
            urls: result[k]
        })
    }
    this.body = { locations: results };
});

router.get('/api/photo/tags', function *() {
    let openId = this.openId;
    let photos = yield Photo.find({ openId }, { tags: 1 });
    let tags =_.uniq(photos.reduce((tags, val) => {
        return tags.concat(val.tags || []);
    }, [])).filter(it => it);

    this.body = { tags: tags };
});

router.get('/api/photo/categories', function *() {
    let openId = this.openId;
    let photos = yield Photo.find({ openId }, { key: 1, location: 1, tags: 1 });

    let mapByLocation = { };
    let mapByTag = {};

    photos.forEach(photo => {
        let location = photo.location;
        let tags = photo.tags || [];

        let url = config.qiniu.outLink + photo.key;
        mapByLocation[location] = ( mapByLocation[location] || []).__push__(url);
        if (!tags || tags.length == 0) (mapByTag['未分类'] = (( mapByTag['未分类'] || []).__push__(url)));
        else tags.forEach(tag => tag && tag.trim() && (mapByTag[tag] = (( mapByTag[tag] || []).__push__(url))));
    });

    let listByLocation = [];
    let listByTag = [];
    for (let k in mapByLocation) {
        if (k) listByLocation.push({ 'location': k, data: mapByLocation[k] })
    }
    for (let k in mapByTag) {
        if (k) listByTag.push({ 'tag': k, data: mapByTag[k] })
    }

    this.body = { listByLocation, listByTag };
});

router.get('/api/photo/search/suggest', function *() {
    let openId = this.openId;
    let keyword = this.query.keyword;

    this.body = { suggests: [] }
});

router.get('/api/photo/dates', function *() {
    let openId = this.openId;
    let firstDate = yield Photo.findOne({ openId }, { uploadedDate: 1 }).sort({ uploadedDate: 1 }).limit(1);
    let lastDate = yield Photo.findOne({ openId }, { uploadedDate: 1 }).sort({ uploadedDate: -1 }).limit(1);

    this.body = {
        firstDate: firstDate && firstDate.uploadedDate,
        lastDate: lastDate && lastDate.uploadedDate 
    };
});

function *generateQuery(ctx) {
    let openId = ctx.openId;
    let startDate = ctx.query.startDate;
    let endDate = ctx.query.endDate;
    let tag = ctx.query.tag;
    let location = ctx.query.location;
    let keyword = ctx.query.keyword;

    let query = { openId };
    if (startDate) {
        let uploadedDate = { $gte: startDate };
        if(endDate) {
            uploadedDate['$lte'] = endDate;
        }
        query['uploadedDate'] = uploadedDate;
    }

    if (keyword) {
        query['$or'] = [{ tags: keyword }, { location: keyword }]
    } else {
        if (tag) query['tags'] = tag;
        if (tag == '未分类') query['tags'] = '';
        if (location) query['location'] = location;
    }

    return query;
}

module.exports = router;