const mongoose = require('mongoose');
const DB = require('./DB');

const WechatAuthSchema = new mongoose.Schema({
    _id: String,
    suppliers: Array,
    agents: Array
});

module.exports = DB.get('schedule').model('WechatAuth', WechatAuthSchema);