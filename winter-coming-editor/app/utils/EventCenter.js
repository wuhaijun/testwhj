const _ = require('lodash');

const EVENTS = {

    MODULE_SHOW: 'module.show',
    MODULE_CLOSE: 'module.close',

    ARTICLE_SAVE: 'article.save'

};

const handleMap = {};

function send(type, data) {
    _.each(handleMap[type], func => func(data));
}

function subscribe(type, func) {
    let list = handleMap[type];
    if(!list) {
        list = [];
        handleMap[type] = list;
    }
    list.push(func);
}

module.exports = {send, subscribe, EVENTS};