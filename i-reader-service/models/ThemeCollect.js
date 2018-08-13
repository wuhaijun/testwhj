const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const ThemeCollectSchema = new mongoose.Schema({
    _id: String, 
    openId: String, //用户openId
    tid: String,   //主题ID
    collectedDate: Date
});

module.exports = mongoConnection.getBoomMobileDB().model('ThemeCollect', ThemeCollectSchema);