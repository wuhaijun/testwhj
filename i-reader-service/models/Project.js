var mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
var fileUrlUtil = require('../common/FileUrlUtil');

var fileSchema = {
    fileId: String,
    source: String,
    bucket: String,
    fileName: String,
    width: Number,
    height: Number
};
var ProjectSchema = new mongoose.Schema({
    title: String,
    coverImg: fileSchema,
    channel: String,
    feed: String,
    originUrl: String,
    originViews: String,
    originLikes: String,
    originForwards: String,
    originShares: String,
    /*
    * channel类型 project:内部案例 cakes:外部案例 download:下载 studio:素材库
    * feedSource类型 feed website wechat instagram facebook twritter
    * */
    type: String,

    parameters: { type: mongoose.Schema.Types.Mixed, default: {} }, //channel自定义的搜索条件

    brandId: String,
    marketingCategoryId: String,
    teamId: String,
    //
    studioType: String,     //gif jpg movie audio

    startDate: Date,
    endDate: Date,
    dateCreated: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    datePublished: Date,
    views: { type: Number, default: (0) },
    likes: { type: Number, default: 0 },
    tags: [],
    isDel: { type: Number, default: 0 },   //1就是删了
    downloadName: String,
    downloadFile: fileSchema,
    desc: String
});

function defaultSelect() {
    if (!this.selected()) {
        this.select('-originViews -originLikes -originForwards -originShares -downloadFile');
    }
}

ProjectSchema.pre('find', defaultSelect);
ProjectSchema.pre('findOne', defaultSelect);

ProjectSchema.methods.coverUrl = function () {
    return fileUrlUtil.coverUrl(this);
};

ProjectSchema.methods.downloadUrl = function () {
    return fileUrlUtil.downloadUrl(this);
};
module.exports = mongoConnection.getBoomDB().model('Project', ProjectSchema);