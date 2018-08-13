const mongoose = require('mongoose');
const AccountTagSchema = new mongoose.Schema({
    _id: String,
    tags: Array
});

module.exports = mongoose.model('AccountTag', AccountTagSchema);