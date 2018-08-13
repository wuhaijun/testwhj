const uuid = require('node-uuid');
const crypto = require('crypto');

function random() {
    var uid = uuid.v1();
    var md5 = crypto.createHash('md5');
    md5.update(uid);
    return md5.digest('hex');
}

function md5ByString(str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

function md5ByFile(filePath, callback) {
    var crypto = require('crypto');
    var fs = require('fs');

    var stream = fs.createReadStream(filePath);
    var fsHash = crypto.createHash('md5');

    stream.on('data', function (d) {
        fsHash.update(d);
    });

    stream.on('end', function () {
        var md5 = fsHash.digest('hex');
        callback(md5);
    });
}

const salt = 'CCeGROUp-BOOM';

module.exports = {random, md5ByFile, md5ByString, salt};