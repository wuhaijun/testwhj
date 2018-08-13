const mongoose = require('mongoose');
const DB = require('../DB');

const ProjectTextSchema = new mongoose.Schema({
    text: String
});

// module.exports = mongoose.model('ProjectText', ProjectTextSchema);
module.exports = DB.get('boom').model('ProjectText', ProjectTextSchema);