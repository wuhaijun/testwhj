const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const UserSchema = new mongoose.Schema({
    openId: String,
    sessionKey: String,
    unionId: String,
    avatarUrl: String,
    nickName: String,
    gender: Number,
    language: String,
    city: String,
    province: String,
    country: String,
    createdDate: Date,
    lastLoginDate: Date
});
// module.exports = mongoose.boomMobileDB.model('User', UserSchema);
module.exports = mongoConnection.getBoomMobileDB().model('MobileUser', UserSchema);