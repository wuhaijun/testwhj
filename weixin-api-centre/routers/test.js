'use strict';
const fs = require('fs');
const parse = require('co-body');
const stream = require('stream');
const path = require('path');
const request = require('request');
const router = require('koa-router')();

router.get('/get', function * () {
    this.body = {status: 'ok'};
});
//
// router.post('/*', function * () {
//     this.body = 'ok';
// });

router.post('/post', function * () {
    console.log('type', this.type);
    let data = yield parse(this);
    console.log(data);
    this.body = {status: 'ok'};
});

router.get('/abc', function * () {
    let filePath = '/Users/n-189/Downloads/0610_1.jpg';
    let extName = path.extname(filePath);
    console.log('ext', extName);
    this.type = extName;
    this.body = fs.createReadStream(filePath);
});

router.get('/pipe', function * () {
    console.log('get type', stream.PassThrough() instanceof stream.Readable);
    this.type = 'html';
    this.body = request.post('http://localhost:10001/post').pipe(stream.PassThrough());
});

router.post('/pipe', function * () {
    this.type = 'text';
    this.body = this.req.pipe(request.post('http://localhost:10001/post')).pipe(stream.PassThrough());
});

module.exports = router;
