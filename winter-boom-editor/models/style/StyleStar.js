const mongoose = require('mongoose');
const DB = require('../DB');

const StyleStarSchema = new mongoose.Schema({
    accountId: String,
    styleId: String
});

module.exports = DB.get('editor').model('StyleStar', StyleStarSchema);
