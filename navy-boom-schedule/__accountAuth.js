'use strict';
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const DB = require('./models/DB').init();
const WechatAuth = require('./models/WechatAuth');

co(function *() {

    let wechatAuths = [
        {
            _id: 'MzA3MzA3ODYxNw==',
            suppliers: [
                {
                    _id: '59367c109bc29b00110a10c1',
                    username: 'zoe.wu@ccegroup.cn',
                    nickname: 'CCE(欧莱雅)'
                },
                {
                    _id: '5a0ab706f6f7ad001027c4d0',
                    username: 'wechat010@brainboom.cn',
                    nickname: 'MRM'
                },
                {
                    _id: '5a0ba3fa9985a0001457dfbf',
                    username: 'wechat008@brainboom.cn',
                    nickname: 'IBUIE'
                },
                {
                    _id: '5a0ba4819985a0001457dfc0',
                    username: 'wechat007@brainboom.cn',
                    nickname: 'ISOBAR'
                }
            ],
            agents: [
                {
                    _id: '59c1d1c7897eee00121aaec2',
                    username: 'Miki.li@ccegroup.cn',
                    nickname: 'Miki(欧莱雅、美宝莲代理商)'
                },
                {
                    _id: '59367c109bc29b00110a10c1',
                    username: 'zoe.wu@ccegroup.cn',
                    nickname: 'CCE(欧莱雅)'
                }
            ]
        },
        {
            _id: 'MjM5MDA5NjEwMA==',
            suppliers: [
                {
                    _id: '',
                    username: 'may.gan@ccegroup.cn',
                    nickname: 'CCE(美宝莲)'
                },
                {
                    _id: '5a0ab799f6f7ad001027c4d1',
                    username: 'wechat009@brainboom.cn',
                    nickname: 'MCM'
                }
            ],
            agents: [
                {
                    _id: '59c1d1c7897eee00121aaec2',
                    username: 'Miki.li@ccegroup.cn',
                    nickname: 'Miki(欧莱雅、美宝莲代理商)'
                },
                {
                    _id: '',
                    username: 'may.gan@ccegroup.cn',
                    nickname: 'CCE(美宝莲)'
                }
            ]
        }
    ];


    yield wechatAuths.map(it => new WechatAuth(it).save());

    DB.close();
});