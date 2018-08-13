const config = require('config');
const agent = require('superagent');
const cheerio = require('cheerio');
const _ = require('lodash');


const Platform = require('./common/Platform');
const MongoConnection = require('./common/MongoConnection');
MongoConnection.connect(config.get("mongo.style"), 'style');


let _urls = new Set();

setUrls = (urls) => {
    _urls = urls;
};

getUrls = () => {
    return _urls;
};

generatorRequestUrls = () => {
    let urls = new Set();
    let url = config.get('downloader.xmt.url');
    const total = config.get('downloader.xmt.total');
    for (let page = 1; page <= total; page++) {
        urls.add(url.replace("#PAGE#", page));
    }
    setUrls(urls);
    return urls;
};

request = async (urls) => {
    for (let url of urls) {
        console.log(`Get Response from ${url}`);
        let res = await agent.get(url);
        await persistOriginContent(url, res.body, res.statusCode);
    }
};

persistOriginContent = async (url, body, statusCode) => {
    let response = {url: url, body: body, statusCode: statusCode, date: new Date(), platform: Platform.XMT};
    const db = MongoConnection.get("style");
    let collection = db.collection('origin_content_xmt');
    let existObj = await collection.findOne({"url": url});
    if (existObj) return;
    await collection.insertOne(response);
};

parser = async (content) => {
    const db = MongoConnection.get("style");
    let collection = db.collection('styles');
    let results = [];
    for (let i = 0; i < content.length; i++) {
        let existObj = await collection.findOne({'platformId': content[i].id, platform: Platform.XMT});
        if (existObj) continue;
        results.push({
            platformId: content[i].id,
            tags: content[i].labels,
            body: content[i].content,
            platform: Platform.XMT,
            date: new Date()
        });
    }
    return results;
};

persistStyles = async (styles) => {
    const db = MongoConnection.get("style");
    const collection = db.collection("styles");
    await collection.insertMany(styles);
};

starter = async () => {
    const urls = generatorRequestUrls();
    await request(urls);
    const db = MongoConnection.get("style");
    const originContentCollection = db.collection("origin_content_xmt");
    let originContents = await originContentCollection.find({platform: Platform.XMT}).toArray();
    let pureContents = [];
    let index = 1;
    for (let originContent of originContents) {
        let result = await parser(originContent.body.styles);
        console.log(`Parser content ${index} group, ${originContents.length - index} groups left`);
        _.map(result, (item)=> {
            pureContents.push(item)
        });
        index++;
    }
    await persistStyles(pureContents);
};

starter();

