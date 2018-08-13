'use strict';
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const DB = require('./models/DB').init();

const Company = require('./models/Company');
const Brand = require('./models/Brand');
const WechatAccount = require('./models/WechatAccount');

co(function *() {

    let companies= [
        {
            _id: 'loreal_company',
            name: '巴黎欧莱雅',
            brands: [
                {
                    _id: 'loreal_brand',
                    name: '欧莱雅',
                    wechatAccounts: [
                        {
                            _id: 'MzA3MzA3ODYxNw==',
                            name: '欧莱雅美丽殿堂',
                            desc: '源于法国的巴黎欧莱雅，为全球用户带来承自法兰西的成熟和优雅气质，你值得拥有！'
                        }
                    ]
                },
                {
                    _id: 'maybelline_brand',
                    name: '美宝莲',
                    wechatAccounts: [
                        {
                            _id: 'MjM5MDA5NjEwMA==',
                            name: '美宝莲纽约',
                            desc: '纽约高街潮妆品牌，崇尚自由，率性，有型格之美。美，就现在！'
                        }
                    ]
                }
            ]
        }
    ];

    for (let i=0; i<companies.length; i++) {
        let company = companies[i];
        let brands = company.brands;
        yield Company.update({ _id: company._id }, { $set: { _id: company._id, name: company.name, brands: brands.map(it => it._id) } }, { upsert: true });
        for (let j=0; j<brands.length; j++) {
            let brand = brands[j];
            let wechatAccounts = brand.wechatAccounts;
            yield Brand.update({ _id: brand._id }, { $set: { _id: brand._id, name: brand.name, wechatAccounts: wechatAccounts.map(it => it._id) } }, { upsert: true });
            for (let k=0; k<wechatAccounts.length; k++) {
                let wechatAccount = wechatAccounts[k];
                yield WechatAccount.update({ _id: wechatAccount._id }, { $set: wechatAccount }, { upsert: true });
            }
        }
    }

    DB.close();
});