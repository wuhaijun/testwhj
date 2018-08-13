const config = require('config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let boomMobileDB = null;
let boomDB = null;

module.exports = {
    init: function () {
        // let boomMobileUrl = config.get('mongo.boommobile') || 'mongodb://localhost:27017/boommobile';
        let boomUrl = config.get('mongo.boom') || 'mongodb://localhost:27017/boom';
        // boomMobileDB = mongoose.createConnection(boomMobileUrl);
        boomDB = mongoose.createConnection(boomUrl);
    },
    getBoomMobileDB: function () { return boomDB; },
    getBoomDB: function () { return boomDB; }
}