const mongoose = require('mongoose');
const DB = require('../DB');

const StyleSchema = new mongoose.Schema({
    types: Array,
    tags: Array,
    html: String,
    platform: String,
    dynamic: String,
    status: Number, // -1: 已删除, 0: 草稿, 1: 已发布
    createTime: Date,
    updateTime: Date
});

module.exports = DB.get('editor').model('Style', StyleSchema);
//module.exports = mongoose.model('Style', StyleSchema);