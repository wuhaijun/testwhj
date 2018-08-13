'use strict';
const config = require('config');
const co = require('co');
const mongoose = require('mongoose');
const rp = require('request-promise');
mongoose.Promise = global.Promise;
const mongo_uri = 'mongodb://boom:boom@dds-bp13d9353a884c541.mongodb.rds.aliyuncs.com:3717/boom';
// const mongo_uri = 'mongodb://192.168.100.83:27017/boom';
const es_host = '10.31.130.75:9200';
// const es_host = '192.168.100.83:9200';
mongoose.connect(mongo_uri);
const Brand = require('./models/Brand');
const Team = require('./models/Team');
const ChannelFilter = require('./models/ChannelFilter');
const Channel = require('./models/Channel');
const Project = require('./models/Project');
const elasticsearch = require('elasticsearch');

co(function *() {

    let channelIcons = {
        '3': 'fa icon-briefcase',
        '3_1': 'fa icon-disc',
        '3_2': 'fa icon-disc',
        '3_3': 'fa icon-disc',
        '2': 'fa icon-fire',
        '1': 'fa icon-bulb',
        '1_1': 'fa icon-disc',
        '1_2': 'fa icon-cloud-download',
        '1_3': 'fa icon-picture',
        '1_4': 'fa icon-cloud-download',
        '1_5': 'fa icon-disc',
        '1_6': 'fa icon-disc',
        '1_7': 'fa icon-disc',
        '1_8': 'fa icon-disc'
    };

    for (let k in channelIcons) {
        let v = channelIcons[k];
        yield Channel.update({_id: k}, { $set: { icon: v } });
    }

    mongoose.connection.close();
});