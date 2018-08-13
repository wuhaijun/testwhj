const mongoose = require('mongoose');
const DB = require('../DB');

var UploadFileSchema = new mongoose.Schema({
    account: String,
    key: String,
    dir: String,
    size: Number,
    mimeType: String,
    mpMap: {type: mongoose.Schema.Types.Mixed, default: {}}, //公众号 media_id 映射
    originUrl: String, //记录从其他url抓取的图片地址
    dateCreated: {type: Date, default: Date.now()},
});

module.exports = DB.get('editor').model('UploadFile', UploadFileSchema);