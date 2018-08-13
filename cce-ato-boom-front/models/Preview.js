const mongoose = require('mongoose');

const PreviewSchema = new mongoose.Schema({
    url: String,
    html: String
});

module.exports = mongoose.model('Preview', PreviewSchema);