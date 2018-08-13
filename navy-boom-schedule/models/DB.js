'use strict';
const mongoose = require('mongoose');
const config = require('config');

let map = {};

function init() {
    map.editor = mongoose.createConnection(config.get('mongo.editor'));
    map.boom = mongoose.createConnection(config.get('mongo.boom'));
    map.schedule = mongoose.createConnection(config.get('mongo.schedule'));

    return this;
}

function get(key) {
    return map[key];
}

function close(key) {
    if (key != undefined) {
        let db = this.get(key);
        db && db.close();
    } else {
        for (let key in map) {
            this.close(key);
        }
    }
}

module.exports = {
    init,
    get,
    close
};