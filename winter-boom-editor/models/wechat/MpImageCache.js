const mongoose = require('mongoose');
const DB = require('../DB');

const MpImageCacheSchema = new mongoose.Schema({
    oriUrl: String,    //origin editor url
    mpUrl: String,   //wechat mp url
});

module.exports = DB.get('editor').model('MpImageCache', MpImageCacheSchema);