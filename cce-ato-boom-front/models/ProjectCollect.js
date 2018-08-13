const mongoose = require('mongoose');

const ProjectCollectSchema = new mongoose.Schema({
    _id: String,
    account: String,
    pid: String,
    collectedDate: Date,
    tags: Array
});

module.exports = mongoose.model('ProjectCollect', ProjectCollectSchema);