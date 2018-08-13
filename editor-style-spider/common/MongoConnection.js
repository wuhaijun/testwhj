'use strict';

const MongoClient = require('mongodb').MongoClient;

let dbPool = {};
module.exports = {
    connect: async function (url, dbName) {
        if (!dbPool[dbName]) {
            const db = await MongoClient.connect(url);
            console.log(`Connect to Mongo ${dbName}`);
            dbPool[dbName] = db.db(dbName);
        }
        return dbPool[dbName];
    },
    get: dbName => {
        return dbPool[dbName];
    }
};