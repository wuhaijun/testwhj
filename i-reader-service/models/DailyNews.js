const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const DailyNewsSchema = new mongoose.Schema({
    type: String,         // feed公众号、project文章
    id: String,           //文章或者公众号id
    publishDate: Date,    //对于文章来说，需要显示的时间
    status: Number        //0:停用，1:正常，-1：失效
});
module.exports = mongoConnection.getBoomMobileDB().model('DailyNews', DailyNewsSchema);