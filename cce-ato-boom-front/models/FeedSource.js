const mongoose = require('mongoose');

const FeedSource = new mongoose.Schema({
    name: String,
    type: String,    //feed website wechat instagram facebook twritter
    tags: [],    //feed website wechat instagram facebook twritter
    originId: String,   //type+/+url|id
    iconUrl: String,
    weight: Object,
    readers: {type: Number, default: 0},
    velocity: {type: Number, default: 0},
    dateCreated: {type: Date, default: Date.now},
    lastUpdated: Date,
    desc: String
});

module.exports = mongoose.model('FeedSource', FeedSource);