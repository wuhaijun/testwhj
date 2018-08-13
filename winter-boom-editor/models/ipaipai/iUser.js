const mongoose = require('mongoose');
const DB = require('../DB');

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

module.exports = DB.get('ipaipai').model('User', UserSchema);