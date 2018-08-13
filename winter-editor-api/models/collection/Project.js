const mongoose = require('mongoose');
const DB = require('../DB');

const fileSchema = {
    fileId: String,
    source: String,
    bucket: String,
    fileName: String
};
const ProjectSchema = new mongoose.Schema({
    title: String,
    coverImg: fileSchema,
    channel: String,
    feed: String,
    originUrl: String,
    /*
     * channel类型 project:内部案例 cakes:外部案例 download:下载
     * feedSource类型 feed website wechat instagram facebook twritter
     * */
    type: String,
    brandId: String,
    teamId: String,
    startDate: Date,
    endDate: Date,
    dateCreated: {type: Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now},
    datePublished: {type: Date, default: Date.now},
    views: {type: Number, default: (0)},
    likes: {type: Number, default: 0},
    tags: [],
    isDel: {type: Number, default: 0},   //1就是删了
    downloadName: String,
    downloadFile: fileSchema,
    desc: String
});

// module.exports = mongoose.model('Project', ProjectSchema);
module.exports = DB.get('boom').model('Project', ProjectSchema);