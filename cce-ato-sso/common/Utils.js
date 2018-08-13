'use strict';

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

function testRegex(target, re) {
    if (!target || !re) return false;
    return re.test(target);
}

function isUrl(url) {
    var re = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    return testRegex(url, re);
}

function isEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return testRegex(email, re);
}

function isPassword(password) {
    // 至少包含一个数字和一个字母,且长度不少于6位
    var re = /^(?=.*[A-Za-z])(?=.*\d)[\d\D]{6,}$/;
    return testRegex(password, re);
}

module.exports = { isPassword, isEmail, isUrl, random, md5ByString};

const SALT = 'CCeGROUp-BOOM';
console.log(md5ByString('123456' + SALT));