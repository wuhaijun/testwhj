'use strict';
const mongoose = require('mongoose');
const config = require('config');

let map = {};

function init() {
    map.editor = mongoose.createConnection(config.get('mongo.editor'));
    map.boom = mongoose.createConnection(config.get('mongo.boom'));
    map.ipaipai = mongoose.createConnection(config.get('mongo.ipaipai'));
}

function get(key) {
    return map[key];
}

module.exports = {
    init,
    get
};