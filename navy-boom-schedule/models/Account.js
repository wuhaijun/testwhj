const mongoose = require('mongoose');
const DB = require('./DB');

const AccountSchema = new mongoose.Schema({
    _id: String,
    username: String,
    nickname: String,
    roles: Array // supplier: 供应商, agent: 代理商
});

module.exports = DB.get('schedule').model('Account', AccountSchema);