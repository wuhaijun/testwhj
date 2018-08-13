'use strict';

const router = require('koa-router')();
const KoaUploadMiddleware = require('../common/KoaUpload');
const QiniuFileUtils = require('../common/QiniuFileUtils');
const ImageUploadFile = require('../models/image/ImageUploadFile');
const ImageCategory = require('../models/image/ImageCategory');
const {getPagination} = require('../common/PaginationUtils');
const parse = require('co-body');
const _ = require('lodash');
const iPhoto = require('../models/ipaipai/iPhoto');
const iUser = require('../models/ipaipai/iUser');
const config = require('config');
const PassThrough = require('stream').PassThrough;
const co = require('co');

var fs = require('fs')
    , gm = require('gm').subClass({imageMagick: true});


const {TARGET_DIR, upload, download} = require('./services/image-service');

router.get('/images/categories/list', function * () {
    let accountId = this.session.account._id;
    let total = yield ImageUploadFile.count({account: accountId});
    let list = yield ImageCategory.find({account: accountId});
    this.body = {
        total: total,
        nocategoryCount: (total - _.sum(_.map(list, o=>o.imageCount))),
        list: list
    };
});

router.post('/images/categories/save', function * () {
    let accountId = this.session.account._id;
    let data = yield parse(this);
    let name = data.name;
    if (!name || _.trim(name).length == 0) {
        this.body = {status: 'error', errmsg: '未提交name'};
        return;
    }
    if (name.length > 10) {
        name = name.substring(0, 10);
    }
    let category = new ImageCategory({
        account: accountId,
        name: name
    });
    yield category.save();
    this.body = {status: 'ok', category: category};
});

router.post('/images/categories/update/:id', function * () {
    let id = this.params.id;
    if (!id) {
        this.body = {status: 'error', errmsg: '未提交id'};
        return;
    }
    let accountId = this.session.account._id;
    let data = yield parse(this);
    let name = data.name;
    if (!name || _.trim(name).length == 0) {
        this.body = {status: 'error', errmsg: '未提交name'};
        return;
    }
    if (name.length > 10) {
        name = name.substring(0, 10);
    }
    try {
        let category = yield ImageCategory.findOne({
            _id: id,
            account: accountId
        });
        if (category) {
            yield category.update({$set: {name: name}});
        }
        this.body = {status: 'ok'};
    } catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '更新报错'};
    }
});

router.get('/images/categories/delete/:id', function * () {
    let accountId = this.session.account._id;
    let id = this.params.id;
    try {
        let category = yield ImageCategory.findOne({
            _id: id,
            account: accountId
        });
        if (category) {
            yield ImageUploadFile.update({category: id}, {$set: {category: null}}, {multi: true});
            yield category.remove();
        }
        this.body = {status: 'ok'};
    } catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '删除报错'};
    }
});

router.get('/images/list', function * () {
    let category = this.query.categoryId;
    let accountId = this.session.account._id;
    let query = {account: accountId};

    if (category != 'ALL') {
        if (category == 'NO_CATEGORY') {
            query['$or'] = [{category: {$exists: false}}, {category: ''}, {category: null}];
        } else {
            // query['category'] = category;
            query['category'] = {'$in':[category,'paste']};
        }
    }

    let count = yield ImageUploadFile.count(query);
    let page = _.toInteger(this.query.page) || 1;
    let pageSize = _.toInteger(this.query.size) || 20;
    let pagination = getPagination(page, pageSize, count);
    let list = yield ImageUploadFile.find(query).sort({dateCreated: 'desc'}).skip(pagination.offset).limit(pageSize);
    this.body = {list, pagination};
});

router.post('/images/update/:id', function * () {
    let id = this.params.id;
    if (!id) {
        this.body = {status: 'error', errmsg: '未提交id'};
        return;
    }
    let accountId = this.session.account._id;
    let data = yield parse(this);
    let name = data.name;
    if (!name || _.trim(name).length == 0) {
        this.body = {status: 'error', errmsg: '未提交name'};
        return;
    }
    if (name.length > 30) {
        name = name.substring(0, 30);
    }
    try {
        let image = yield ImageUploadFile.findOne({
            _id: id,
            account: accountId
        });
        if (image) {
            yield image.update({$set: {name: name}});
        }
        this.body = {status: 'ok'};
    } catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '更新报错'};
    }
});

router.get('/images/move', function * () {
    let accountId = this.session.account._id;
    let category;
    try {
        category = yield ImageCategory.findOne({_id: this.query.category, account: accountId});
    } catch (e) {
        console.error(e);
    }
    if (!category) {
        this.body = {status: 'error', errmsg: 'category is not found'};
        return;
    }

    let imageIdList = this.query['image[]'];
    if (!imageIdList) {
        imageIdList = this.query['image'];
    }
    if (!imageIdList) {
        this.body = {status: 'error', errmsg: 'image is not found'};
        return;
    }
    if (typeof(imageIdList) === 'string') {
        imageIdList = [imageIdList];
    }
    let imageList = yield ImageUploadFile.find({_id: {$in: imageIdList}, account: accountId});

    yield ImageUploadFile.update({_id: {$in: _.map(imageList, i => i._id)}}, {$set: {category: category.id}}, {multi: true});
    yield subImageCount4Category(imageList);
    yield incImageCount4Category(category._id, imageList.length);
    this.body = {status: 'ok'};
});

router.get('/images/delete', function * () {
    let accountId = this.session.account._id;
    let imageIdList = this.query['image[]'];
    if (!imageIdList) {
        imageIdList = this.query['image'];
    }
    if (!imageIdList) {
        this.body = {status: 'error', errmsg: 'image is not found'};
        return;
    }
    try {
        let imageList = yield ImageUploadFile.find({
            _id: {$in: imageIdList},
            account: accountId
        });
        for (let image of imageList) {
            try {
                yield QiniuFileUtils.deleteResource(image.key);
            } catch (e) {
                console.error('images delete qiniu error', e);
            }
            yield image.remove();
        }

        yield subImageCount4Category(imageList);
        this.body = {status: 'ok'};
    } catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '删除报错'};
    }
});

function * subImageCount4Category(imageList) {
    let gr = _.groupBy(imageList, i => i.category || '');
    for (let k in  gr) {
        if (k) {
            yield ImageCategory.update({_id: k}, {$inc: {imageCount: -gr[k].length}});
        }
    }
}

function * incImageCount4Category(categoryId, count) {
    yield ImageCategory.update({_id: categoryId}, {$inc: {imageCount: count}});
}

router.post('/upload/image', KoaUploadMiddleware, function *() {
    let files = this.files;
    let images = files.image;
    let category = this.data && this.data.categoryId;

    if (!images) {
        this.body = {status: 'fail', errmsg: '没有上传图片'};
        return;
    }
    if (Object.prototype.toString.call(images) == '[object Object]') {
        images = [images];
    }

    let keys = [];
    let accountId = this.session.account._id;
    for (let image of images) {
        if (image) {
            let uploadFile = yield upload(image, category, accountId);
            if (uploadFile) keys.push(uploadFile.key);
        }
    }
    this.body = {status: 'ok', keys: keys, files: images};
});

router.get('/images/ipaipai/list',function *() {
    let account = this.session.account;
    if(typeof(account.weixin) == "undefined" || typeof(account.weixin.unionid) == "undefined") {
        this.body = {status:'fail',errmsg:'没有绑定微信'};
        return;
    }
    let queryObj = yield getIpaipaiPhotos(this,account)
    let results = [];
    queryObj.photos.forEach(photo => {
        photo = photo.toObject();
        photo.url = config.qiniu.outLink + photo.key;
        results.push(photo);
    });
    this.body = { photos: results , total:queryObj.total };
});

function *getIpaipaiPhotos(ctx,account) {
    if(typeof(account.weixin) == "undefined" || typeof(account.weixin.unionid) == "undefined") {
        ctx.body = {status:'fail',errmsg:'没有绑定微信'};
        return {photos : [],total : 0};
    }
    let ipaipaiOpenId = yield getIpaipaiOpenId(account.weixin.unionid);
    if(!ipaipaiOpenId) return {photos:[],total:0};
    ctx.openId = ipaipaiOpenId;
    let query = yield generateQuery(ctx);
    let {limit = 10,skip = 0} = ctx.query;
    let photos = yield iPhoto.find(query, { openId: 0 }).limit(parseInt(limit)).skip(parseInt(skip)).sort({ uploadedDate: -1 });
    let total = yield iPhoto.find(query, { openId: 0 }).count();
    return {photos, total};
}


function *getIpaipaiOpenId(unionid = "") {
    let user = yield iUser.findOne({unionId:unionid});
    if(user) return user.openId;
    return null;
}

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

/**
 * 服务器端时间推送流拼接
*/
const sse = (stream,event, data) => {
    return stream.push(`event:${ event }\ndata: ${ JSON.stringify(data) }\n\n`)
}

/**
 *服务器端事件推送检查ipaipai是否有新图片上传
*/
router.get('/images/ipaipai/check_bak',function *(){
    let stream = new PassThrough();
    let account = this.session.account;
    this.set({
        'Content-Type':'text/event-stream',
        'Cache-Control':'no-cache',
        Connection: 'keep-alive'
    });

    let queryObj = yield getIpaipaiPhotos(this,account);
    let oldSize = queryObj.total;
    sse(stream,'message',{update: false});
    this.body = stream;
    let _this = this;
    setInterval(() => {
        co(function *(){
            let queryObj = yield getIpaipaiPhotos(_this,account);
            let nowSize = queryObj.total;
            let update = false;
            if(oldSize != nowSize) {
                update = true;
                oldSize = nowSize;
            }
            sse(stream,'message',{update: update});
        });
    },3000); 
});

router.get('/images/ipaipai/check',function *() {
    let oldSize = this.query.oldSize;
    let account = this.session.account;
    let queryObj = yield getIpaipaiPhotos(this,account);
    let nowSize = queryObj.total;
    let update = false;
    if(oldSize != nowSize) {
        update = true;
    }
    this.body = {update};
});

router.get('/images/uptoken',function *() {
    this.body = QiniuFileUtils.uptoken();
});

/**
 * 
 */
router.post('/images/save',function *() {
    let data = yield parse(this);
    let images = data.images;
    let accountId = this.session.account._id;
    for(let i = 0;i < images.length;i++) {
        let image = images[i];
        let uploadFile = new ImageUploadFile({
            account: accountId,
            name: image.name,
            category: image.category,
            key: image.key,
            size: image.size,
            mimeType: image.mimeType
        });
        let result = yield uploadFile.save();
    }
    this.body = {status: true};  
});

router.get('/images/bg/list',function *() {
    let respObj = yield QiniuFileUtils.list("bgimage");
    this.body = respObj;
})

module.exports = router;

