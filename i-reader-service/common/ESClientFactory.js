'use strict';

const es = require('elasticsearch');
const clientMap = {};

module.exports = {

    init: function (config, key = 'default') {
        let client = new es.Client(config);
        client.ping({
            requestTimeout: Infinity,
            hello: "elasticsearch!"
        }, function (error) {
            if (error) {
                console.trace(`elasticsearch cluster ${key} is down!`);
            } else {
                clientMap[key] = client;
                console.log(`ES client ${key} is well`);
            }
        });
    },

    get: function (key = 'default') {
        return clientMap[key];
    }
}