'use strict';
const os = require('os');
const bluebird = require('bluebird');
const fs = require('fs');
const fileRemove = bluebird.promisify(fs.unlink);

const path = require('path');
const parse = require('co-busboy');
const _ = require('lodash');
const IDUtils = require('./IDUtils');

module.exports = function *(next) {
    if (!this.request.is('multipart/*')) {
        return yield next;
    }
    let parts = parse(this);
    let part;
    let files = {};
    let data = {};
    while (part = yield parts) {
        if (part.length) {
            let key = part[0];
            let value = part[1];
            let ori = data[key];
            if(ori) {
                if(typeof ori == 'string') {
                    data[key] = [ori, value];
                }else {
                    ori.push(value);
                }
            }else {
                data[key] = value;
            }
        } else {
            if(part.filename && part.filename.length > 0) {
                let filename = IDUtils.random() + part.fieldname;
                let stream = fs.createWriteStream(path.join(os.tmpDir(), filename));
                part.pipe(stream);
                let f = {
                    path: stream.path,
                    filename: filename,
                    originFilename: part.filename,
                    field: part.fieldname
                };
                let ori = files[part.fieldname];
                if(ori) {
                    if(ori.length) {    //已经是数组
                        ori.push(f);
                    }else {
                        files[part.fieldname] = [ori, f];
                    }
                }else {
                    files[part.fieldname] = f;
                }
            }else {
                //@TODO part的api还不清楚,当文件没有上传时的处理还有待进一步处理
                part.pipe(fs.createWriteStream(path.join(os.tmpDir(), 'null')));
            }
        }
    }

    this.data = data;
    this.files = files;

    let error;
    try {
        yield next;
    }catch (e) {
        error = e;
    }

    function* del(path) {
        if(yield new Promise(function (resolve) {
                fs.exists(path, function (exists) {
                    resolve(exists);
                });
            })) {
            yield fileRemove(path);
            // console.log('delete ' + path);
        }else {
            // console.log('not exists ' + path);
        }
    }

    for(let k in files) {
        let f = files[k];
        if(f.length) {
            for(let sf of f) {
                yield del(sf.path)
            }
        }else {
            yield del(f.path)
        }
    }

    if(error) {
        throw error;
    }

};
