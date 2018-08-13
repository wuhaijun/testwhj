const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const ProjectShareSchema = new mongoose.Schema({
    openId: String,
    pid: String,
    shareDate: Date,
    type: String
});

module.exports = mongoConnection.getBoomMobileDB().model('MobileProjectShare', ProjectShareSchema);