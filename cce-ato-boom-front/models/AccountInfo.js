const mongoose = require('mongoose');
const AccountInfoSchema = new mongoose.Schema({
    _id: String,
    job: String,
    likeFeedCategories: Array
});

module.exports = mongoose.model('AccountInfo', AccountInfoSchema);