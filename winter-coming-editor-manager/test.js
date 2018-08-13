const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://192.168.100.83:27017/winter");

//initItem();
//
//function initItem() {
//    const StyleItem = require('./models/StyleItem');
//    const items = [
//        { _id: '1', type: 'ttl-1', html: '<div style="width: 300px; height: 30px; padding: 3px 3px; color: white; background-color: #1f7e9a; border-radius: 5px">标题-编号标题</div>' },
//        { _id: '2', type: 'ttl-2', html: '<div style="width: 200px; height: 30px; padding: 3px 3px; color: white; background-color: #3d9970; border-radius: 5px">标题-线框标题</div>' },
//        { _id: '3', type: 'pgh-1', html: '<div style="width: 100px; height: 40px; padding: 3px 3px; color: white; background-color: #1f7e9a; border-radius: 5px">段落文字-边框内容</div>' },
//        { _id: '4', type: 'pgh-2', html: '<div style="width: 160px; height: 40px; padding: 3px 3px; color: white; background-color: #95144b; border-radius: 5px">段落文字-底色内容</div>' }
//    ];
//
//    items.forEach(item => {
//        let t1 =  new StyleItem({
//            name: item.name || '',
//            type: item.type,
//            types: [item.type.split('\-')[0], item.type],
//            html: item.html,
//            status: 0,
//            sort: 0
//        });
//
//        t1.save();
//    });
//}

initType();

function initType() {
    const StyleType = require('./models/StyleType');
    const types = [
        { _id: 'tpl', name: '模板', level: 1, children: [
            { _id: 'tpl-1', name: '卡通风', level: 2 },
            { _id: 'tpl-2', name: '宫廷风', level: 2 },
            { _id: 'tpl-3', name: '杂志风', level: 2 },
            { _id: 'tpl-4', name: '清新风', level: 2 }
        ] }
    ];

    types.forEach(type => {
        let t1 =  new StyleType({
            _id: type._id,
            name: type.name,
            level: type.level,
            parent: type._id,
            status: 0,
            sort: 0
        });

        t1.save();

        type.children.forEach( tc => {
            let t2 =  new StyleType({
                _id: tc._id,
                name: tc.name,
                level: tc.level,
                parent: type._id,
                status: 0,
                sort: 0
            });

            t2.save();
        } )
    });
}