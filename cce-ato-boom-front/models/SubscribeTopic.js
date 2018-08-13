const mongoose = require('mongoose');

const SubscribeTopic = new mongoose.Schema({
    name: String,
    account: String,
    icon: String,
    dateCreated: {type: Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('SubscribeTopic', SubscribeTopic);