'use strict';
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const elasticsearch = require('elasticsearch');

const FeedSource = require('./models/FeedSource');
const Project = require('./models/Project');

// const config = {
//     mongo: 'mongodb://192.168.100.83:27017/boom',
//     es: '192.168.100.83:9200'
// };

const config = {
   mongo: 'mongodb://boom:boom@dds-bp13d9353a884c541.mongodb.rds.aliyuncs.com:3717/boom',
   es: '10.31.130.75:9200'
};

co(function *() {

    mongoose.connect(config.mongo);
    let es = new elasticsearch.Client({
        host: config.es
    });


    let feedIds = ['57ffbd91602dfdeebb6b0a62', '57ffbd91602dfdeebb6b0a5f', '57ffbd91602dfdeebb6b0a99', '57ffbd91602dfdeebb6b0a95', '57ffbd91602dfdeebb6b0aec', '57ffbd91602dfdeebb6b0abb', '57ffbd91602dfdeebb6b0afe', '57ffbd91602dfdeebb6b0b22', '57ffbd91602dfdeebb6b0aab', '57ffbd91602dfdeebb6b0b2e', '57ffbd91602dfdeebb6b0ca6', '57ffbd91602dfdeebb6b0b88', '57ffbd91602dfdeebb6b0bbf', '57ffbd91602dfdeebb6b0c80', '58010f12602dfdeebb6b0d20', '58010f12602dfdeebb6b0d83', '58050391602dfdeebb6b0e04', '58050391602dfdeebb6b0e53', '58050392602dfdeebb6b121b', '58050392602dfdeebb6b1254', '58050393602dfdeebb6b137e', '58050393602dfdeebb6b137f', '58050393602dfdeebb6b1383', '58050393602dfdeebb6b1385', '58065513602dfdeebb6b13be', '58065513602dfdeebb6b13bf', '58065513602dfdeebb6b13c3', '580f8f92602dfdeebb6b1615', '580f8f92602dfdeebb6b16bd', '5810e112602dfdeebb6b16c4', '5841a891602dfdeebb6e7724', '5841a891602dfdeebb6e7725', '5841a891602dfdeebb6e7726', '5841a891602dfdeebb6e7727', '5841a891602dfdeebb6e7728', '5841a891602dfdeebb6e7729', '5841a891602dfdeebb6e772a', '5922bf8985cfd835191c7888'];
    let feedBizNames = ['MzAxMTMxMDQ3Mw==', 'MzAwNTMxMzg1MA==', 'MzAxODE2MjM1MA==', 'MzI1MTIzMzI2MA==', 'MzAwNDc4MDA2NQ==', 'MjAzNzMzNTkyMQ==', 'MjM5NTU5NzcyMQ==', 'MzA5NzAzMjIxMw==', 'MjM5MDE0Mjc4MA==', 'MzA3NTIyODUzNA==', 'MjM5MTQzNzU2NA==', 'MjM5ODYxMDA5OQ==', 'MzA3MzIzMDQwNw==', 'MzA5NDc1NzQ4MA==', 'MzA4NzYyMzcxNA==', 'MzA5NzU1OTYzNg==', 'MzA5MTQ0NDIzMQ==', 'MzA4MDQyODc3Nw==', 'MjM5MTIwOTI4MA==', 'MzIwMTI2MTkxOQ==', 'MjM5NDQ0ODYwMA==', 'MjM5MTAzNTc0MA==', 'MzAxMDA4MzM1NQ==', 'MjM5NjU1MDc4MA==', 'MzA5MjY3NjAzMg==', 'MjM5ODk5NDM1Ng==', 'MzA5OTk1MzE1Nw==', 'MzA4NjYwMDgwMw==', 'MzAwNDM3MTUyMw==', 'MjM5NjIyODQyOQ==', 'MjM5Mjg3OTg3MQ==', 'MzA5NDA1NTg0Mg==', 'MjM5NTMzNzg3NA==', 'MjM5NTA1MDQyMA==', 'MjM5MTA5MTg1MQ==', 'MjM5MzE0OTYwMA==', 'MzA4MjA2NzU2OQ==', 'MzA5NjIzNjgxNw==', 'MzA3MzU0OTQzMw==', 'MzA3NDY1NDcyMw==', 'MzA4NzMwNDQxMQ==', 'MjM5ODA1NTMyMA==', 'MjM5MDI5OTkyOA==', 'MjM5MjAxMTIyMA==', 'MjM5NTI5MTM3Mg==', 'MjM5NjA1NzEwMA==', 'MzA3Njc3OTc4NQ==', 'MjM5NzU4NDM5NA=='];

    let feed1s = yield FeedSource.find({ _id: { $in: feedIds } });
    let feeds2 = yield FeedSource.find({ type: 'wechat', id: { $in: feedBizNames } });

    let feeds = [...feed1s, ...feeds2];
    console.log(`Update weight for ${ feeds.length } feed source.`);


    for (let i=0; i< feeds.length; i++) {
        let feed = feeds[i];
        let weight = feed.weight || {};
        let score = weight.score || 0;

        if (!weight.manual_recommend) {
            weight.manual_recommend = 1;
            weight.score = score + 100;

            yield FeedSource.update({ _id: feed._id }, { $set: { weight: weight } });
            yield es.update({
                index: 'boom',
                type: 'feedsource',
                id: feed._id.toString(),
                body: {
                    doc: {
                        weight: weight
                    },
                    "doc_as_upsert" : true
                }
            });
            console.log(`Complete update ${ feed.name } score to ${ score + 100 }.`);
        }
    }


    mongoose.connection.close();
});