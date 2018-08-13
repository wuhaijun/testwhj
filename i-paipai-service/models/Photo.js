const mongoose = require('mongoose');
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

module.exports = mongoose.model('Photo', PhotoSchema);