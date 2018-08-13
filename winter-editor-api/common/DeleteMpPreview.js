'use strict';
const Preview = require('../models/editor/Preview');
const _ = require('lodash');
const co = require('co');
const {post} = require('../common/Fetch');

const MP_LIST = ['wx584f579730c96e60', 'wx7bccf1f87d4ca21d', 'wx0796c43ed4d3b306'];

function beginDeleteTask() {

    setTimeout(function () {
        co(function * () {
            let lastTime = Date.now() - 2 * 60 * 60 * 1000;
            let date = new Date(lastTime);
            let list = yield Preview.find({syncDate: {$lt: date}});
            console.log('delete preview task work start', list && list.length);
            for(let preview of list) {
                let r = yield post('/cgi-bin/material/del_material', {id: preview.mp}, {
                    "media_id": preview.mediaId
                });
                console.log('delete mp preivew', r);
                if(r.errcode != 0) {
                    continue;
                }
                yield Preview.remove({_id: preview._id});
                console.log('delete mongo preivew', preview);
            }

            lastTime = lastTime/1000;
            for(let mp of MP_LIST) {
                let r = yield post('/cgi-bin/material/batchget_material', {id: mp}, {
                    "type": "image",
                    "offset": 0,
                    "count": 20
                });
                console.log('delete mp image', r);
                if(!r.item) {
                    continue;
                };
                for(let i of r.item) {
                    if(i['update_time'] < lastTime) {
                        yield post('/cgi-bin/material/del_material', {id: mp}, {media_id: i['media_id']});
                    }
                }
            }
            beginDeleteTask();
        }).catch(function (err) {
            console.error('delete preview error', err);
            beginDeleteTask();
        });
    }, 5 * 60 * 1000);

};

module.exports = beginDeleteTask;