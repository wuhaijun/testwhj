'use strict';

const router = require('koa-router')();
const KoaUploadMiddleware = require('../common/KoaUpload');
const IDUtils = require('../common/IDUtils');
const QiniuFileUtils = require('../common/QiniuFileUtils');
const ImageUploadFile = require('../models/image/ImageUploadFile');
const ImageCategory = require('../models/image/ImageCategory');
const {getPagination} = require('../common/PaginationUtils');
const request = require('request');
const parse = require('co-body');
const path = require('path');
const os = require('os');
const fs = require('fs');
const _ = require('lodash');
require('bluebird').promisifyAll(fs);

const target_dir = 'upload/image/';

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
    if(!name || _.trim(name).length == 0) {
        this.body = {status: 'error', errmsg: '未提交name'};
        return;
    }
    if(name.length > 10) {
        name = name.substring(0, 10);
    }
    let category = new ImageCategory({
        account: accountId,
        name: name
    });
    yield category.save();
    this.body = {status: 'ok'};
});

router.post('/images/categories/update/:id', function * () {
    let id = this.params.id;
    if(!id) {
        this.body = {status: 'error', errmsg: '未提交id'};
        return;
    }
    let accountId = this.session.account._id;
    let data = yield parse(this);
    let name = data.name;
    if(!name || _.trim(name).length == 0) {
        this.body = {status: 'error', errmsg: '未提交name'};
        return;
    }
    if(name.length > 10) {
        name = name.substring(0, 10);
    }
    try {
        let category = yield ImageCategory.findOne({
            _id: id,
            account: accountId
        });
        if(category) {
            yield category.update({$set: {name: name}});
        }
        this.body = {status: 'ok'};
    }catch (e) {
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
        if(category) {
            yield ImageUploadFile.update({category: id}, {$set: {category: null}}, { multi: true });
            yield category.remove();
        }
        this.body = {status: 'ok'};
    }catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '删除报错'};
    }
});

router.get('/images/list', function * () {
    let category = this.query.category;
    let accountId = this.session.account._id;
    let query = {account: accountId, category: category || null};

    let count = yield ImageUploadFile.count(query);
    let page = _.toInteger(this.query.page) || 1;
    let pageSize = _.toInteger(this.query.size) || 20;

    let pagination = getPagination(page, pageSize, count);
    let list = yield ImageUploadFile.find(query).sort({_id: 'desc'}).skip(pagination.offset).limit(pageSize);
    this.body = {list, pagination};
});

router.post('/images/update/:id', function * () {
    let id = this.params.id;
    if(!id) {
        this.body = {status: 'error', errmsg: '未提交id'};
        return;
    }
    let accountId = this.session.account._id;
    let data = yield parse(this);
    let name = data.name;
    if(!name || _.trim(name).length == 0) {
        this.body = {status: 'error', errmsg: '未提交name'};
        return;
    }
    if(name.length > 30) {
        name = name.substring(0, 30);
    }
    try {
        let image = yield ImageUploadFile.findOne({
            _id: id,
            account: accountId
        });
        if(image) {
            yield image.update({$set: {name: name}});
        }
        this.body = {status: 'ok'};
    }catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '更新报错'};
    }
});

router.get('/images/move', function * () {
    let accountId = this.session.account._id;
    let category;
    try {
        category = yield ImageCategory.findOne({_id: this.query.category, account: accountId});
    }catch(e){
        console.error(e);
    }
    if(!category) {
        this.body = {status: 'error', errmsg: 'category is not found'};
        return;
    }

    let imageIdList = this.query['image[]'];
    if(!imageIdList) {
        imageIdList = this.query['image'];
    }
    if(!imageIdList) {
        this.body = {status: 'error', errmsg: 'image is not found'};
        return;
    }
    if(typeof(imageIdList) === 'string') {
        imageIdList = [imageIdList];
    }
    let imageList = ImageUploadFile.find({_id: {$in: imageIdList}, account: accountId});
    yield ImageUploadFile.update({_id: {$in: _.map(imageList, i => i._id)}}, {$set: {category: category.id}}, {multi: true});
    yield subImageCount4Category(imageList);
    this.body = {status: 'ok'};
});

router.get('/images/delete', function * () {
    let accountId = this.session.account._id;
    let imageIdList = this.query['image[]'];
    if(!imageIdList) {
        imageIdList = this.query['image'];
    }
    if(!imageIdList) {
        this.body = {status: 'error', errmsg: 'image is not found'};
        return;
    }
    try {
        let imageList = yield ImageUploadFile.find({
            _id: {$in: imageIdList},
            account: accountId
        });
        for(let image of imageList) {
            yield QiniuFileUtils.deleteResource(image.key);
            yield image.remove();
        }

        yield subImageCount4Category(imageList);
        this.body = {status: 'ok'};
    }catch (e) {
        console.error(e);
        this.body = {status: 'error', errmsg: '删除报错'};
    }
});

function * subImageCount4Category(imageList) {
    let gr = _.groupBy(imageList, i => i.category);
    for(let k in  gr) {
        if(k != 'null' || k != 'undefined') {
            yield ImageCategory.update({_id: k}, {$inc: {imageCount: -gr[k].length}});
        }
    }
}

router.post('/upload/image', KoaUploadMiddleware, function *() {
    let files = this.files;
    let image = files.image;
    let category = this.data && this.data.category;
    if(image) {
        let accountId = this.session.account._id;
        let uploadFile = yield upload(image, category, accountId);
        if(uploadFile) {
            this.body = 'success:' + JSON.stringify({key: uploadFile.key});
            return;
        }
    }
    this.body = 'error:not found';
});

function * upload(imageFile, categoryId, accountId) {
    let md5FileName = yield QiniuFileUtils.md5(imageFile.path);
    let dir = target_dir + accountId + '/';
    let key = dir + md5FileName;
    let uploadFile = yield ImageUploadFile.findOne({ account: accountId, key: key });
    if (!uploadFile) {
        let category;
        if(categoryId) {
            category = yield ImageCategory.findOne({_id: categoryId, account: accountId});
        }

        let result = yield QiniuFileUtils.uploadLocalFile({
            localFilePath: imagePath,
            targetDir: dir,
            targetFileName: md5FileName,
            forceUpload: true
        });
        if(result != key) {
            console.error('upload error', result, key);
            return null;
        }
        let stat = yield QiniuFileUtils.stat(key);

        uploadFile = new ImageUploadFile({
            account: accountId,
            name: imageFile.filename,
            category: category && category.id,
            key: key,
            size: stat.fsize,
            mimeType: stat.mimeType
        });
        yield uploadFile.save();
        if(category) {
            yield category.update({$inc: {imageCount: 1}});
        }
    }
    return uploadFile;
}

function * download(url) {
    let tempFileName = IDUtils.md5ByString(url);
    let arr = url.split('/');
    let filePath = path.join(os.tmpDir(), tempFileName + arr[arr.length - 1]);
    yield new Promise((rl, rj) => {
        let stream = fs.createWriteStream(filePath);
        stream.on('finish',function(){
            rl();
        });
        request.get(url).on('error', function (err) {
            rj(err);
        }).pipe(stream);
    });
    return filePath;
}

module.exports = {
    router,
    download,
    target_dir
};