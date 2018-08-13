const mongoose = require('mongoose');
const DB = require('./DB');

const WechatAccountSchema = new mongoose.Schema({
    _id: String,
    name: String,
    desc: String
});

module.exports = DB.get('schedule').model('WechatAccount', WechatAccountSchema);