const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const ProjectCollectSchema = new mongoose.Schema({
    _id: String,
    openId: String,
    pid: String,
    collectedDate: Date,
    tags: Array
});

module.exports = mongoConnection.getBoomMobileDB().model('MobileProjectCollect', ProjectCollectSchema);