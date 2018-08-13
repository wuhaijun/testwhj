'use strict';

let mongoClient = require('mongodb').MongoClient;

let dbPool = {};
module.exports = {
    connect: function * (url, dbname) {
        if (!dbPool[dbname]) {
            let db = yield mongoClient.connect(url);
            console.log("Connect mongo db: " + url);
            dbPool[dbname] = db;
        } else {
            return dbPool[dbname];
        }
    },
    get: dbname => {
        return dbPool[dbname];
    },
    getAccountDB : () => {
        return dbPool['account'];
    },
    getReceiveDB : () => {
        return dbPool['receivcedb'];
    }
};