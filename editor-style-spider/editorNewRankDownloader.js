let fs = require('fs');
let path = require('path');
const config = require('config');
const agent = require('superagent');
const cheerio = require('cheerio');
const _ = require('lodash');

const Platform = require('./common/Platform');

const MongoConnection = require('./common/MongoConnection');


//读取文件
console.log(__dirname);
fs.readFile(__dirname + '/data/text1.txt',{ flag: 'r+',encoding:'utf8'}, function(err,data){
    if(err) {
        console.log(err);
        return;
    }
    let file = data
    parser(file)
});

/**持久化原始数据*/
persistOriginContent = async (body, data, platform) => {
    let response = {body: body,  date: new Date(), platform: Platform.NEW_RANK};
    const db = MongoConnection.get("style");
    const collection = db.collection('origin_content_newrank');
    await collection.insertOne(response);
};

/**解析原始数据*/
parser = async (file) => {
    //console.log(file);
    let values = JSON.parse(file);
    console.log(values.success);
    console.log('aaaaaa');
    let results = [];

    for(let i = 0;i < values.length ; i ++) {
        const id = values[i].id;
        const tags = values[i].tag_name;
        const usefulHtml = values[i].content;
        
        let existObj = await collection.findOne({'id': id, platform: Platform.NEW_RANK});
        if (existObj) continue;
        results.push({platformId: id, tags: tags, body: usefulHtml, platform: Platform.NEW_RANK, date: new Date()});
    }
    return results;
};

persistStyles = async (styles) => {
    const db = MongoConnection.get("style");
    const collection = db.collection("styles_newrank");
    await collection.insertMany(styles);
};

starter = async (fileResults) => {
    console.log('2');
    await MongoConnection.connect(config.get("mongo.style"), 'style');
    const requestResult = fileResults;
    
    const db = MongoConnection.get("style");
    const originContentCollection = db.collection("origin_content_newrank");

    let originContents = await originContentCollection.find({platform:Platform.NEW_RANK}).toArray();
    let pureContents = [];
    let index = 1;
    for (let originContent of originContents) {
        let result = await parser(originContent.body);
       _.map(result,(item)=>{
                     pureContents.push(item)
            });
        index++;
    }
    await persistStyles(pureContents);
};

starter();