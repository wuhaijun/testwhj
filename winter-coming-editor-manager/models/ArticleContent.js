const mongoose = require('mongoose');
const DB = require('./DB');

const ArticleContentSchema = new mongoose.Schema({
    content: String,
    lastUpdated: {type: Date, default: Date.now},
});

module.exports = DB.get('onlineEditor').model('ArticleContent', ArticleContentSchema);


