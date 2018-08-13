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

     // 初始化ChannelFilter
    // let brand = yield ChannelFilter.findOne({ _id: 'brand' });
    // if (!brand) {
    //     let brands = yield Brand.find({});
    //     yield new ChannelFilter({
    //         _id: 'brand',
    //         name: '品牌',
    //         orderIndex: 1,
    //         children: brands
    //     }).save();
    // }
    //
    // let team = yield ChannelFilter.findOne({ _id: 'team' });
    // if (!team) {
    //     let teams = yield Team.find({});
    //     yield new ChannelFilter({
    //         _id: 'team',
    //         name: '客户团队',
    //         orderIndex: 2,
    //         children: teams
    //     }).save();
    // }
    //
    // let marketingCategory = yield ChannelFilter.findOne({ _id: 'marketing_category' });
    // if (!marketingCategory) {
    //     let channels = yield Channel.find({ parent: '2' });
    //     let categories = channels.map(channel => {
    //         return {
    //             _id: channel._id,
    //             name: channel.name,
    //             orderIndex: channel.orderIndex
    //         }
    //     });
    //     yield new ChannelFilter({
    //         _id: 'marketing_category',
    //         name: '营销类型',
    //         orderIndex: 3,
    //         children: categories
    //     }).save();
    // }

    // 为channel增加ChannelFilter
    // yield Channel.update({ _id: '2' }, { $set: { filters: ['marketing_category'] }});
    // yield Channel.update({ _id: '1_1' }, { $set: { filters: ['brand', 'team'] } });

    // 删除营销子channel
    // yield Channel.remove({ parent: '2' });


    // 更新mongo以及数据库channel
    let es = new elasticsearch.Client({
        host: es_host
    });
    let projects = (yield es.search({
        index: 'boom',
        type: 'project',
        size: 10000,
        body: {
            query: {
                "filtered": {
                    "filter": {
                        "terms": {
                            "channel": [ '1_1','1','1_2','2','1_3','1_4','3','3_1','3_2','3_3','3_4','1_5','1_6','1_7','1_8' ]
                        }
                    }
                }
            }
        },
        _source: false
    })).hits.hits;

    let pids = projects.map(p => p._id);
    for (let i=0; i<pids.length; i++) {
        let _id = pids[i];
        console.log('Update mongo and es', _id);

        let project = yield Project.findOne({_id: _id});
        let parameters = {};
        if(project.brandId) {
            parameters.brand = project.brandId;
        }
        if(project.teamId) {
            parameters.team = project.teamId;
        }
        if(project.channel == '1_3') {
            if(project.studioType) {
                parameters.studioType = project.studioType;
            }else {
                parameters.studioType = 'jpg';
            }
        }
        if(project.marketingCategoryId) {
            parameters['marketing_category'] = project.marketingCategoryId;
        }
        yield Project.update({ _id: _id }, { $set: { parameters: parameters} });
        yield es.update({
            index: 'boom',
            type: 'project',
            id: _id,
            body: {
                doc: {
                    parameters
                },
                "doc_as_upsert" : true
            }
        });
    }

    mongoose.connection.close();
});