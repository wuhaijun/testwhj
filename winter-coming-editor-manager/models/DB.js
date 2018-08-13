'use strict';
const mongoose = require('mongoose');
const config = require('config');

let map = {};

function init() {
    map.editor = mongoose.createConnection(config.get('mongo.editor'));
    map.onlineEditor = mongoose.createConnection(config.get('mongo.onlineEditor'));
}

function get(key) {
    return map[key];
}

module.exports = {
    init,
    get
};