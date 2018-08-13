const mongoose = require('mongoose');
const DB = require('../DB');

const StyleCollectSchema = new mongoose.Schema({
    accountId: String,
    hash: String,
    dynamic: String,
    html: String,
    styleId: String
});

module.exports = DB.get('editor').model('StyleCollect', StyleCollectSchema);
