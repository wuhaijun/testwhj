const mongoose = require('mongoose');

const FeedSourceCategoryGroup = new mongoose.Schema({
    name: String,
    categories: [],
    desc: String,
    orderIndex: { type: Number, default: 1 }
});

module.exports = mongoose.model('FeedSourceCategoryGroup', FeedSourceCategoryGroup);