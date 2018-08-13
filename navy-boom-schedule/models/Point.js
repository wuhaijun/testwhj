const mongoose = require('mongoose');
const DB = require('./DB');

const PointSchema = new mongoose.Schema({
    title: String,
    wechatId: String,
    supplier: String,
    agent: String,
    creator: String,
    createdDate: Date,
    publishDate: String,
    publishYear: String,
    publishMonth: String,
    publishDay: String,
    location: String

});

module.exports = DB.get('schedule').model('Point', PointSchema);