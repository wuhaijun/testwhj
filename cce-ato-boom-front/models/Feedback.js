const mongoose = require('mongoose');

const Feedback = new mongoose.Schema({
    accountId: String,
    email: String,
    module: String,
    content: String,
    dateCreated: Date,
});

module.exports = mongoose.model('Feedback', Feedback);