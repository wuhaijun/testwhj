const mongoose = require('mongoose');
const DB = require('../DB');

const ImageWechatCacheSchema = new mongoose.Schema({
    _id: String,    //原始url
    url: String,    //公众号图片地址
});

module.exports = DB.get('editor').model('ImageWechatCache', ImageWechatCacheSchema);