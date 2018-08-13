'use strict';
const mongoose = require('mongoose');

let map = {};

function init(env) {
    map.editor = mongoose.createConnection(env.EDITOR_MONGO_URI || 'mongodb://localhost:27017/winter');
    map.boom = mongoose.createConnection(env.BOOM_MONGO_URI || 'mongodb://localhost:27017/winter');
}

function get(key) {
    return map[key];
}

module.exports = {
    init,
    get
};