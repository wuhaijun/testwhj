const mongoose = require('mongoose');
const AccountEventSchema = new mongoose.Schema({
    _id: String,
    events: Array
});

module.exports = mongoose.model('AccountEvent', AccountEventSchema);