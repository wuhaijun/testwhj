const mongoose = require('mongoose');

const ProjectTextSchema = new mongoose.Schema({
    text: String
});

module.exports = mongoose.model('ProjectText', ProjectTextSchema);