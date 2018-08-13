const mongoose = require('mongoose');

const ProjectLikeAccountSchema = new mongoose.Schema({
    _id: String,
    account: String,
    dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('ProjectLikeAccount', ProjectLikeAccountSchema);