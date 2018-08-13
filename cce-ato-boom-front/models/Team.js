const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    _id: String,
    name: String,
    orderIndex: Number
});

module.exports = mongoose.model('Team', TeamSchema);