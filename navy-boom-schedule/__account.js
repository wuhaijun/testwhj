'use strict';
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const DB = require('./models/DB').init();
const Account = require('./models/Account');

co(function *() {

    let accounts= [
        {
            _id: '59c1d1c7897eee00121aaec2',
            username: 'Miki.li@ccegroup.cn',
            nickname: 'Miki(欧莱雅、美宝莲代理商)',
            roles: [
                {
                    name: 'agent',
                    wechatAccounts: ['MzA3MzA3ODYxNw==', 'MjM5MDA5NjEwMA==']
                }
            ]
        },
        {
            _id: '59367c109bc29b00110a10c1',
            username: 'zoe.wu@ccegroup.cn',
            nickname: 'CCE(欧莱雅)',
            roles: [
                {
                    name: 'agent',
                    wechatAccounts: ['MzA3MzA3ODYxNw==']
                },
                {
                    name: 'supplier',
                    wechatAccounts: [ 'MzA3MzA3ODYxNw==' ]
                }
            ]
        },
        {
            _id: '5a0bb0409985a0001457dfc3',
            username: 'may.gan@ccegroup.cn',
            nickname: 'CCE(美宝莲)',
            roles: [
                {
                    name: 'agent',
                    wechatAccounts: ['MjM5MDA5NjEwMA==']
                },
                {
                    name: 'supplier',
                    wechatAccounts: [ 'MjM5MDA5NjEwMA==' ]
                }
            ]
        },
        {
            _id: '5a0ab706f6f7ad001027c4d0',
            username: 'wechat010@brainboom.cn',
            nickname: 'MRM',
            roles: [
                {
                    name: 'supplier',
                    wechatAccounts: [ 'MzA3MzA3ODYxNw==' ]
                }
            ]
        },
        {
            _id: '5a0ba3fa9985a0001457dfbf',
            username: 'wechat008@brainboom.cn',
            nickname: 'IBUIE',
            roles: [
                {
                    name: 'supplier',
                    wechatAccounts: [ 'MzA3MzA3ODYxNw==' ]
                }
            ]
        },
        {
            _id: '5a0ba4819985a0001457dfc0',
            username: 'wechat007@brainboom.cn',
            nickname: 'ISOBAR',
            roles: [
                {
                    name: 'supplier',
                    wechatAccounts: [ 'MzA3MzA3ODYxNw==' ]
                }
            ]
        },
        {
            _id: '5a0ab799f6f7ad001027c4d1',
            username: 'wechat009@brainboom.cn',
            nickname: 'MCM',
            roles: [
                {
                    name: 'supplier',
                    wechatAccounts: [ 'MjM5MDA5NjEwMA==' ]
                }
            ]
        }
    ];

    yield accounts.map(account => new Account(account).save());

    DB.close();
});