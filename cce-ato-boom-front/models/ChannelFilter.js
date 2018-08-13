const mongoose = require('mongoose');

const ChannelFilter = new mongoose.Schema({
    _id: String,
    name: String,
    children: Array,
    orderIndex: Number
});

module.exports = mongoose.model('ChannelFilter', ChannelFilter);