'use strict';

const router = require('koa-router')();
const StyleType = require('../models/style/StyleType');
const StyleItem = require('../models/style/StyleItem');

router.get('/api/types', function *() {
    let typeList = yield StyleType.find({level: 1});
    let subList = yield StyleType.find({level: 2});

    let results = [];
    typeList.forEach(type => {
        let children = [];
        subList.forEach(sub => {
            if (sub.parent == type._id) {
                children.push(sub);
            }
        });

        type._doc.children = children;
        results.push(type);
    });

    this.body = { status: true, result: results };
});

router.get('/api/styles/:typeId', function *() {
    let typeId = this.params.typeId;
    let query = { status: 1 } ;
    if(typeId && typeId != 'all') {
        query['types'] = { $all: [typeId] };
    }

    let styleList = yield StyleItem.find(query).sort({ updateTime: -1 });
    this.body = { status: true, result: styleList };
});

module.exports = router;