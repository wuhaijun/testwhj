const mongoose = require('mongoose');

const Subscribe = new mongoose.Schema({
    _id: String,    // account + # + feed
    name: String,
    account: String,
    topic: String,
    feed: String,
    dateCreated: {type: Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Subscribe', Subscribe);