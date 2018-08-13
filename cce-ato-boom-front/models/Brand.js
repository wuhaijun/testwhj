const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    _id: String,
    name: String,
    orderIndex: Number
});

module.exports = mongoose.model('Brand', BrandSchema);