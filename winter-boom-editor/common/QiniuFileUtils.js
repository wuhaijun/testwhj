'use strict';
const IdUtils = require('./IDUtils');
const qiniu = require('qiniu');
const _ = require('lodash');

let BUCKET = 'editor';

function init(access_key, secret_key, bucket = 'editor') {

    qiniu.conf.ACCESS_KEY = access_key;
    qiniu.conf.SECRET_KEY = secret_key;

    BUCKET = bucket;
};

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
        qiniu.io.putFile(new qiniu.rs.PutPolicy(BUCKET).token(), key, localFilePath, extra, function (err, ret) {
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
        client.remove(BUCKET, key, function(err, ret) {
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
        client.stat(BUCKET, key, function(err, ret) {
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

function uptoken() {
    var putPolicy = new qiniu.rs.PutPolicy(BUCKET);
    return putPolicy.token();
}

function* list(prefix) {
   return yield new Promise((resolve,reject) => {
    qiniu.rsf.listPrefix(BUCKET, prefix, null, null, null, function(rerr, ret,res){
        if (res.statusCode==200) {
             //console.log(ret);
             resolve(ret)
            // console.log(rerr);
          } else {
            //console.log(ret);
            //console.log(res);
           console.log(rerr);
          }
      });
   }) 
}

module.exports = {
    init,
    uploadLocalFile,
    deleteResource,
    deleteResources,
    md5,
    getFix,
    stat,
    uptoken,
    list
};
