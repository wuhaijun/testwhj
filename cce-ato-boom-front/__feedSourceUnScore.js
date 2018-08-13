'use strict';
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const elasticsearch = require('elasticsearch');

const FeedSource = require('./models/FeedSource');
const Project = require('./models/Project');

 const config = {
     mongo: 'mongodb://192.168.100.83:27017/boom',
     es: '192.168.100.83:9200'
 };

//const config = {
//   mongo: 'mongodb://boom:boom@dds-bp13d9353a884c541.mongodb.rds.aliyuncs.com:3717/boom',
//   es: '10.31.130.75:9200'
//};

co(function *() {

    mongoose.connect(config.mongo);
    let es = new elasticsearch.Client({
        host: config.es
    });

    let feeds = yield FeedSource.find({ 'weight.manual_recommend': 1 });
    console.log(`Update weight for ${ feeds.length } feed source.`);


    for (let i=0; i< feeds.length; i++) {
        let feed = feeds[i];
        let weight = feed.weight || {};
        let score = weight.score || 0;
        let subscribed = weight.subscribed || 0;

        weight.manual_recommend = 0;

        weight.score = subscribed * 10;

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

        console.log(`Complete update ${ feed.name } score to ${ weight.score }.`);
    }


    mongoose.connection.close();
});