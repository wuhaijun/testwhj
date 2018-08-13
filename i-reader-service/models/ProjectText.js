const mongoose = require('mongoose');
const mongoConnection = require('../common/MongoConnection');
const ProjectTextSchema = new mongoose.Schema({
    text: String
});

module.exports = mongoConnection.getBoomDB().model('ProjectText', ProjectTextSchema);