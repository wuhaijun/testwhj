const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    pid: String,
    title: String,
    desc: String,
    cover: String,
    version: String
});

module.exports = mongoose.model('Slider', SliderSchema);