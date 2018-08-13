const redis = require('redis');
const config = require('config');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client;

module.exports = {
    init: function * () {
        client = redis.createClient(config.get('redis'));
    },
    get: function () {
        return client;
    }
};
