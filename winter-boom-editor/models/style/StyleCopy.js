const mongoose = require('mongoose');
const DB = require('../DB');

const StyleCopySchema = new mongoose.Schema({
    accountId: String,
    styleId: String,
    date: Date
});

module.exports = DB.get('editor').model('StyleCopy', StyleCopySchema);
