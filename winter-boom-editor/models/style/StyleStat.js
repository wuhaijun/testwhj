const mongoose = require('mongoose');
const DB = require('../DB');

const StyleStatSchema = new mongoose.Schema({
    styleId: String,
    accountId: String,
    createTime: Date,
    types: Array
});

module.exports = DB.get('editor').model('StyleStat', StyleStatSchema);
