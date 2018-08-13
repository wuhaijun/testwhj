const mongoose = require('mongoose');
const DB = require('../DB');

const ArticleSchema = new mongoose.Schema({
    account: String,
    title: String,
    cover: String,
    author: String,
    digest: String,
    sourceUrl: String,
    status: Number, //0:临时  1:保存未同步 2:同步后有更新 3:同步 这个字段目前的设计已经无效了, 具体的同步应该在mpMap中进行观察。
    mpMap: {type: mongoose.Schema.Types.Mixed, default: {}}, //公众号 media_id 映射，如果是发布模式，未必能用的上。
    dateCreated: {type: Date, default: Date.now},
    lastSynced: {type: Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now},
});

// module.exports = mongoose.model('Article', ArticleSchema);
module.exports = DB.get('editor').model('Article', ArticleSchema);

