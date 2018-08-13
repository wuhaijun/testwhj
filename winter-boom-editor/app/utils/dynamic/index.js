'use strict';

const _ = require('lodash');

const LIST = ['simple'];

function init(map) {
    _.each(LIST, n => {
        _.each(require('./' + n), (v, k) => {
            map[k] = v;
        });
    });
}

module.exports = init;
