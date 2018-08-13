const mongoose = require('mongoose');
const DB = require('../DB');

const StyleAccountStatSchema = new mongoose.Schema({
    accountId: String,
    latestUseMap: {type: mongoose.Schema.Types.Mixed, default: {}}, //各个栏目最近使用的列表
    topList: Array,
});

module.exports = DB.get('editor').model('StyleAccountStat', StyleAccountStatSchema);
