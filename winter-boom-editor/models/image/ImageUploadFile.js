const mongoose = require('mongoose');
const DB = require('../DB');

var ImageUploadSchema = new mongoose.Schema({
    account: String,
    name: String,
    longName: String,
    category: String,
    key: String,
    dir: String,
    size: Number,
    mimeType: String,
    originUrl: String,
    mpMap: {type: mongoose.Schema.Types.Mixed, default: {}}, //公众号 media_id 映射
    dateCreated: Date
});

module.exports = DB.get('editor').model('ImageUploadFile', ImageUploadSchema);