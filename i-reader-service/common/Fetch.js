'use strict';
let rp;

//@TODO 使用request-promise请求的损耗或许可以优化
function * init(baseUrl) {
    rp = require('request-promise').defaults({
        baseUrl
    });

    let result = yield get('/get');
    console.log('send test request, result:', result);
}

function * get(path, params) {
    let opts = {
        method: 'GET',
        url: path,
        qs: params
    };
    return yield parseRes(opts);
}

function * post(path, params, data, multipart=false) {
    let opts = {
        method: 'POST',
        qs: params,
        url: path
    };
    if(multipart) {
        opts.formData = data;
    }else {
        opts.json = data;
    }
    return yield parseRes(opts);
}

function * parseRes(opts) {
    let body = yield rp(opts);
    if(typeof body == 'object') {
        return body;
    }
    console.log(body)
    return JSON.parse(body);
}

module.exports = {
    init, post
}
