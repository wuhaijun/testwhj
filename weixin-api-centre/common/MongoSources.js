'use strict';

const MongoClient = require('mongodb').MongoClient;
const dbMap = {};

module.exports = {
    connect: function * (dbName, url) {
        if (!dbMap[dbName]) {
            let db = yield MongoClient.connect(url);
            console.log("Connect mongo db: " + url);
            dbMap[dbName] = db;
        } else {
            return dbMap[dbName];
        }
    },
    get: dbName => {
        return dbMap[dbName];
    },
    getAccount: function () {
        return dbMap['account'];
    },
    getReceive: function () {
        return dbMap['receive'];
    }
};
