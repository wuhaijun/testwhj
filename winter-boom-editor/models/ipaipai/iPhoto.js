const mongoose = require('mongoose');
const DB = require('../DB');

const PhotoSchema = new mongoose.Schema({
    openId: String,
    key: String,
    source: String,
    location: String,
    address: String,
    tags: Array,
    size: Number,
    uploadedDate: Date
});

module.exports = DB.get('ipaipai').model('Photo', PhotoSchema);