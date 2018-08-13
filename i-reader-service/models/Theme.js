const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const ThemeSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    feeds: [],
    sort: Number
});
module.exports = mongoConnection.getBoomMobileDB().model('Theme', ThemeSchema);