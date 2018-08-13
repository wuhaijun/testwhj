const mongoose = require('mongoose');
const DB = require('../DB');

const UsedEmojiSchema = new mongoose.Schema({
    account: String,
    emoji: Object,
    count: Number,
    updateTime: Date
});

module.exports = DB.get('editor').model('UsedEmoji', UsedEmojiSchema);
