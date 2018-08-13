'use strict';
const _ = require('lodash');

const c = {};

const set = function (obj) {
    _.assign(c, obj);
};

const get = function (key) {
    return c[key];
};

const getConfig = function () {
    return _.clone(c);
};

module.exports = {
    set: set,
    get: get,
    getConfig: getConfig
};