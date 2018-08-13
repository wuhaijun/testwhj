'use strict';
const config = require('config');
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongo_uri = 'mongodb://192.168.100.83:27017/winter';
mongoose.connect(mongo_uri);
const Style = require('./models/style/Style.js');
const StyleItem = require('./models/style/StyleItem.js');

let types = {
    "ttl":"标题",
    "ttl-2":"线框标题",
    "ttl-1":"编号标题",
    "ttl-3":"图片标题",
    "pgh":"段落文字",
    "pgh-1":"边框内容",
    "pgh-2":"底色内容",
    "img":"图片",
    "img-1":"单图",
    "img-2":"多图",
    "bgr":"图片",
    "bgr-1":"信纸",
    "bgr-2":"单图",
    "pl-1":"线条分割",
    "pl":"分割线",
    "pl-2":"单图",
    "ft":"关注原文",
    "ft-1":"引导关注",
    "ft-2":"二维码",
    "tpl":"模板",
    "tpl-1":"卡通风",
    "tpl-2":"宫廷风",
    "tpl-3":"杂志风",
    "tpl-4":"清新风",
    "pgh-3":"序号内容",
    "ttl-4":"哈哈标题",
    "dynamic-style":"图片",
    "dynamic-style-1":"动态svg",
    "dynamic-style-2":"测试",
    "img-3":"滑动图",
    "dynamic-style-3":"测试2",
    "xctj":"新春特辑",
    "xctj_cj":"春节",
    "xctj_qrj":"情人节"
};

co(function *() {
    let oldStyles = yield StyleItem.find({ });
    for (let i = 0; i<oldStyles.length; i++ ) {
         yield new Style({
             _id: oldStyles[i]._id,
             tags: [],
             types: [types[(oldStyles[i].types|| [0, 0])[0]], types[(oldStyles[i].types|| [0, 0])[1]]],
             html: oldStyles[i].html,
             status: oldStyles[i].status,
             platform: 'boom',
             dynamic: oldStyles[i].dynamic,
             createTime: oldStyles[i].createTime,
             updateTime: oldStyles[i].updateTime
         }).save();
    }
    mongoose.connection.close();
});