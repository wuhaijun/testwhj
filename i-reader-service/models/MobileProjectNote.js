const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const ProjectNoteSchema = new mongoose.Schema({
    _id: String,
    openId: String,
    pid: String,
    notedDate: Date,
    text: String,
    note: String,
    domIndex: String
});

module.exports = mongoConnection.getBoomMobileDB().model('MobileProjectNote', ProjectNoteSchema);