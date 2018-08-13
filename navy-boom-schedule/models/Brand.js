const mongoose = require('mongoose');
const DB = require('./DB');

const BrandSchema = new mongoose.Schema({
    _id: String,
    name: String,
    wechatAccounts: Array
});

module.exports = DB.get('schedule').model('Brand', BrandSchema);