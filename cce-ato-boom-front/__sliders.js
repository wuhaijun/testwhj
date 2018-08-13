'use strict';
const config = require('config');
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongo_uri = 'mongodb://boom:boom@dds-bp13d9353a884c541.mongodb.rds.aliyuncs.com:3717/boom';
mongoose.connect(mongo_uri);
const Slider = require('./models/Slider');

const args = process.argv.slice(2);
const version = args[0] || 'development_1';


//const sliders = [
//    { pid: "5947a2cbef85ef00105d3dd4", title: "线下印刷工艺-第一弹", desc: '设计者应该了解的包装印刷工艺知识', cover: "线下印刷工艺-第一弹.jpeg" },
//    { pid: "59438fddef85ef00105d3dc3", title: "打破时空壁垒，告别宜家式的传统体验营销", desc: 'CCE与科勒合作AR+Mapping亮相上海国际厨卫展', cover: "打破时空壁垒，告别宜家式的传统体验营销.jpeg" },
//    { pid: "594390afef85ef00105d3dc5", title: "在facebook上抓娃娃机", desc: '远程游戏加直播的创新O2O互动', cover: "在facebook上抓娃娃机.jpeg" }
//];

const sliders = [
    { pid: "59e72574c4a95800105d1021", title: "专题研习#123 App宣传片？", desc: 'App常用，而宣传片不常见', cover: "http://oxrcvtr6x.bkt.clouddn.com/%E4%B8%93%E9%A2%98%E7%A0%94%E4%B9%A0%23123%20APP%E5%AE%A3%E4%BC%A0%E7%89%87.jpg" },
    { pid: "5a055d2fc4a95800105d126d", title: "Mapping技术让橱窗模特瞬间变身", desc: '店员再也不用辛苦为模特换装了', cover: "http://oxrcvtr6x.bkt.clouddn.com/Mapping%E6%8A%80%E6%9C%AF%E8%AE%A9%E6%A9%B1%E7%AA%97%E6%A8%A1%E7%89%B9%E7%9E%AC%E9%97%B4%E5%8F%98%E8%BA%AB.jpeg" },
    { pid: "5a0908dec4a95800105d1278", title: "想阅读这本书，请到气温在零下的室外", desc: '只有感同身受才会心怀怜悯', cover: "http://oxrcvtr6x.bkt.clouddn.com/%E6%83%B3%E9%98%85%E8%AF%BB%E8%BF%99%E6%9C%AC%E4%B9%A6%EF%BC%8C%E8%AF%B7%E5%88%B0%E6%B0%94%E6%B8%A9%E5%9C%A8%E9%9B%B6%E4%B8%8B%E7%9A%84%E5%AE%A4%E5%A4%96.jpg" }
];


let data = sliders;
co(function *() {

    yield Slider.update({ version: version }, { $set: { version: version + '_bak_' + Date.now() } }, { multi: true, upsert: false });
    for (let i = 0; i<data.length; i++ ) {
        try {
            yield new Slider(Object.assign({}, data[i], { version: version })).save();
        } catch (e) {
            console.log(e);
        }
    }
    mongoose.connection.close();
});