const mongoose = require('mongoose');
const DB = require('./DB');

const StyleTemplateSchema = new mongoose.Schema({
    name: String,
    types: Array,
    styleIds: Array,
    status: Number, // -1: 已删除, 0: 草稿, 1: 已发布
    tags:Array,
    sort: Number,
    createTime: Date
});
module.exports = DB.get('editor').model('StyleTemplate', StyleTemplateSchema);




