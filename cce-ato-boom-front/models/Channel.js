const mongoose = require('mongoose');

const Channel = new mongoose.Schema({
    _id: String,
    tenancy: String,
    filters: Array,
    name: String,
    icon: String,
    type: String,    //project:内部案例 cakes:外部案例 download:下载 studio:素材库
    open: {type: Number, default: 0},   //1对外公开
    level: Number,
    orderIndex: Number,
    parent: String
});

module.exports = mongoose.model('Channel', Channel);