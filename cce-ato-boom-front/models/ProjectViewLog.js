const mongoose = require('mongoose');

const ProjectViewLogSchema = new mongoose.Schema({
    _id: String,
    account: String,
    pid: String,
    ptype: String,
    pfeed: String,
    projectCreatedDate: {type: Date},    // 我已经忘了为什么要加入这么一个奇怪的属性了
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ProjectViewLog', ProjectViewLogSchema);