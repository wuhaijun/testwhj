'use strict';
let config = require('config');
let qiniu = require('qiniu');


let generateUploadToken = (expires = 3600, keyToOverwrite) => {
    let accessKey = config.qiniu.accessKey;
    let secretKey = config.qiniu.secretKey;
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    let options = {
        scope: config.qiniu.bucket + (keyToOverwrite ? `:${ keyToOverwrite }` : ''),
        expires: expires
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);

    console.log(`generate upload token: ${ uploadToken }`);
    return uploadToken;
};

let upload = (localFilePath, key, callback) => {
    callback = __isFunction__(key) ? key : callback;
    key = __isString__(key) ? key :  __getFileName__(localFilePath);

    let qiniuConfig = new qiniu.conf.Config();
    qiniuConfig.zone = qiniu.zone[config.qiniu.zone];
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    let uploadToken = generateUploadToken();

    if (__isFunction__(callback)) {
        formUploader.putFile(uploadToken, key, localFilePath, putExtra, (respErr, respBody, respInfo) => {
            callback(respBody.key, respErr);
        });
    } else {
        return new Promise((resolve, reject) => {
            formUploader.putFile(uploadToken, key, localFilePath, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject(respErr);
                } else {
                    resolve(respBody.key);
                }
            });
        });
    }
};

let format = date => {
    return date && date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay() + '-' + date.getTime();
};

let __getFileName__ = localFilePath => (localFilePath || '').replace(/^(.*\/)?(.+)$/, '$2');
let __isFunction__ = func => Object.prototype.toString.call(func) === '[object Function]';
let __isString__ = func => Object.prototype.toString.call(func) === '[object String]';

module.exports = { upload, format };