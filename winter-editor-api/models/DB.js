'use strict';
const env = process.env;
const mongoose = require('mongoose');

let map = {};

function init() {
    map.editor = mongoose.createConnection(env.MONGO_EDITOR);
}

function get(key) {
    return map[key];
}

module.exports = {
    init,
    get
};