'use strict';

const config = { };

const put = function(key, value) {
    config[key] = value;
};

const set = function (obj) {
    Object.assign(config, obj);
};

const get = function (key) {
    return config[key];
};

const clone = function () {
    let copy = config.constructor();
    for (let attr in config) {
        if (config.hasOwnProperty(attr)) copy[attr] = config[attr];
    }
    return copy;
};

module.exports = { set, put, get, clone };