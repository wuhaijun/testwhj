const mongoose = require('mongoose');
const DB = require('../DB');

var ImageCategorySchema = new mongoose.Schema({
    account: String,
    name: String,
    imageCount: {type: Number, default: 1},
    orderIndex: {type: Number, default: 1}
});

module.exports = DB.get('editor').model('ImageCategory', ImageCategorySchema);