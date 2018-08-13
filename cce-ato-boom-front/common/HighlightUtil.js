const _ = require('lodash');

module.exports = {
    handle: function (text, keyword) {
        if(!keyword || _.trim(keyword).length == 0) {
            return text;
        }

    }
};