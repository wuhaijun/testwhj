const mongoose = require('mongoose');
const DB = require('./DB');

const PointArticleSchema = new mongoose.Schema({
    articleId: String,
    pointId: String,
    wechatId: String,
    tags: Array,
    publishDate: String,
    dateCreated: {type: Date, default: Date.now},
    lastSynced: {type: Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now}
});

module.exports = DB.get('schedule').model('PointArticle', PointArticleSchema);