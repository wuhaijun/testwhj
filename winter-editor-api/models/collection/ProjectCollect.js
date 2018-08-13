const mongoose = require('mongoose');
const DB = require('../DB');

const ProjectCollectSchema = new mongoose.Schema({
    _id: String,
    account: String,
    pid: String,
    collectedDate: Date,
    tags: Array
});

module.exports = DB.get('boom').model('ProjectCollect', ProjectCollectSchema);