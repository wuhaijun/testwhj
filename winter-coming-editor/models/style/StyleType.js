const mongoose = require('mongoose');
const DB = require('../DB');

const StyleTypeSchema = new mongoose.Schema({
    _id: String,
    name: String,
    status: Number,
    level: 0,
    parent: String,
    sort: Number,
    createTime: Date
});

// module.exports = mongoose.model('StyleType', StyleTypeSchema);
module.exports = DB.get('editor').model('StyleType', StyleTypeSchema);