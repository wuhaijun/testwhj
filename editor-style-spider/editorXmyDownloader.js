const config = require('config');
const agent = require('superagent');
const cheerio = require('cheerio');
const _ = require('lodash');

const Platform = require('./common/Platform');

const MongoConnection = require('./common/MongoConnection');

let _urls = new Set();

setUrls = (urls) => {
    _urls = urls;
};

getUrls = () => {
    return _urls;
};

/**根据对应规则生产请求URL*/
generatorRequestUrls = () => {
    let urls = new Set();
    let url = config.get('downloader.xmy.url');
    const total = config.get('downloader.xmy.total');
    for (let page = 1; page <= total; page++) {
        urls.add(url.replace("#PAGE#", page));
    }
    setUrls(urls);
    return urls;
};

/**发起请求*/
request = async (urls) => {
    let db = MongoConnection.get("style");
    let collection = db.collection('origin_content_xmy');
    let requestResults = [];
    for (let url of urls) {
        let existObj = await collection.findOne({"url": url});
        if (existObj) continue;
       // console.log(`Get Response from ${url}`);
        let res = await agent.get(url);
        requestResults.push({
            url: url,
            body: res.text,
            statusCode: res.statusCode,
            date: new Date(),
            platform: Platform.XMY
        });
    }
    return requestResults;
};

/**持久化原始数据*/
persistOriginContent = async (url, body, statusCode) => {
    let response = {url: url, body: body, statusCode: statusCode, date: new Date(), platform: Platform.XMY};
    const db = MongoConnection.get("style");
    const collection = db.collection('origin_content_xmy');
    await collection.insertOne(response);
};

/**解析原始数据*/
parser = async (content) => {
    let db = MongoConnection.get("style");
    let collection = db.collection('styles');
    const $ = cheerio.load(content);
    let results = [];
    for(let j = 0 ;j< 65 ; j++){
        const $ul = $('#code'+j);
        const $tags = $ul.find('td.zuoyou8');
        const tagsArr = [];
        $tags.each(function(index, elem) {
            tagsArr.push($(this).text().trim(" "));
        });
        const usefulHtml = $ul.find('section._xmyeditor').html();
        results.push({platformId: j, tags: tagsArr, body: usefulHtml,platform: Platform.XMY, date: new Date()});
    }
    return results;

};

persistStyles = async (styles) => {
    const db = MongoConnection.get("style");
    const collection = db.collection("styles");
    await collection.insertMany(styles);
};

starter = async () => {
    await MongoConnection.connect(config.get("mongo.style"), 'style');
    const urls = generatorRequestUrls();
    const requestResult = await request(urls);
    for (let i = 0; i < requestResult.length; i++) {
        await persistOriginContent(requestResult[i].url, requestResult[i].body, requestResult[i].statusCode);
    }
    const db = MongoConnection.get("style");
    const originContentCollection = db.collection("origin_content_xmy");

    let originContents = await originContentCollection.find({platform:Platform.XMY}).toArray();
    let pureContents = [];
    let index = 1;
    for (let originContent of originContents) {
        let result = await parser(originContent.body);
         console.log(`Parser content ${index} group, ${originContents.length - index} groups left`);
         _.map(result,(item)=>{
                     pureContents.push(item)
            });
        index++;
    }
    await persistStyles(pureContents);
};

starter();



