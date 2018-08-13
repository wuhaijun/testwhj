const mongoose = require('mongoose');
const DB = require('../DB');

const PreviewSchema = new mongoose.Schema({
    mp: String,
    article: String,
    mediaId: String,
    url: String,
    shortUrl: String,
    articleDate: {type: Date, default: Date.now},
    syncDate: {type: Date, default: Date.now}
});

module.exports = DB.get('editor').model('Preview', PreviewSchema);
