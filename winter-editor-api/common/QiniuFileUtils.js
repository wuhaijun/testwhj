'use strict';
const IdUtils = require('./IDUtils');
const qiniu = require('qiniu');
const _ = require('lodash');

qiniu.conf.ACCESS_KEY = 'AcAyRoJsSDPuRsiOO5kzluXgFXZ954R6B_j4ZM3C';
qiniu.conf.SECRET_KEY = 'ZX2i7vOFTwIJBFN7PtmGS2zlHR-xO-K6ieqt7mz3';

const bucket = 'editor';

function* uploadLocalFile({localFilePath, targetDir, targetFileName, mimeType, forceUpload}) {
    let extra = new qiniu.io.PutExtra(null,mimeType);
    if(!targetDir) {
        targetDir = '';
    }
    if (targetDir.length > 0 & targetDir[targetDir.length - 1] != '/') {
        targetDir += '/';
    }
    let key;
    if(targetFileName) {
        key = targetDir + targetFileName;
    }else {
        key = targetDir + (yield md5(localFilePath));
    }
    if(!forceUpload) {

    }
    yield new Promise(function (resolve, reject) {
        qiniu.io.putFile(new qiniu.rs.PutPolicy(bucket).token(), key, localFilePath, extra, function (err, ret) {
            if(err) {
                console.log('upload err', err);
                reject(err);
            }else {
                console.log(ret.key, ret.hash);
                resolve(key);
            }
        });
    });

    return key;
}

function* deleteResource(key) {
    let client = new qiniu.rs.Client();
    return yield new Promise((resolve, reject) => {
        client.remove(bucket, key, function(err, ret) {
            if (err) {
                console.log('rs remove err', err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

function* deleteResources(keyList) {
    for(let key of keyList) {
        yield deleteResource(key);
    }
}

function* stat(key) {
    let client = new qiniu.rs.Client();
    return yield new Promise((resolve, reject) => {
        client.stat(bucket, key, function(err, ret) {
            if (err) {
                if(err.code === 612) {
                    resolve(null);
                    return;
                }
                reject(err);
            } else {
                resolve(ret);
            }
        });
    });
}

function getFix(filename) {
    if(!filename) {
        return null;
    }
    let index = filename.lastIndexOf('.');
    if(index == -1 || (filename.length - index) > 10) {
        //@TODO 没有明确后缀的，先一律按jpg处理。
        return 'jpg';
    }
    return filename.substring(index + 1);
}

function * md5(localFilePath) {
    let narr = localFilePath.split('/');
    let originFilename = narr[narr.length - 1];
    let fix = getFix(originFilename);
    let md5 = yield IdUtils.md5ByFile(localFilePath);
    return md5 + '.' + fix;
}

module.exports = {
    uploadLocalFile,
    deleteResource,
    deleteResources,
    md5,
    getFix,
    stat
};
