const mongoose = require('mongoose');

const FeedSourceCategory = new mongoose.Schema({
    name: String,
    tags: [],
    desc: String,
    orderIndex: {type: Number, default: 1}
});

module.exports = mongoose.model('FeedSourceCategory', FeedSourceCategory);