'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
require('bluebird').promisifyAll(fs);

const router = require('koa-router')();
const request = require('request');
const cheerio = require('cheerio');

const Article = require('../models/editor/Article');
const ArticleContent = require('../models/editor/ArticleContent');

const StyleItem = require('../models/style/StyleItem');
const MpImageCache = require('../models/wechat/MpImageCache');

const QiniuFileUtils = require('../common/QiniuFileUtils');
const IDUtils = require('../common/IDUtils');

router.get('/debug/test', function *() {

    let oa = yield Tenancy.findOne({_id: this.session.account._id});
    let token = yield getToken(this.session.account._id);

    let article = yield Article.findOne();
    let content = yield ArticleContent.findOne({_id: article._id});

    let $ = cheerio.load(content.content);

    let imgs = $('img');

    for (let i = 0; i < imgs.length; i++) {
        let img = imgs.eq(i);
        let imgUrl = img.attr('src');
        console.log(imgUrl);
    }

    let bgImages = $('.bgImage');

    for (let i = 0; i < bgImages.length; i++) {
        let bg = bgImages.eq(i);
        let imgUrl = bg.css('background-image');
        console.log('bgimg', imgUrl);
    }

    let data = {
        articles: [{
            title: article.title,
            thumb_media_id: 'jdU6NospUwSR9EDRUW884IBKN80OjreJCtLb3H7RN5M',
            show_cover_pic: 1,
            author: article.author,
            digest: article.digest,
            content: $.html(),
            content_source_url: article.sourceUrl
        }]
    };

    // let result = yield post(
    //     `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${token.token}`, data
    // );
    //
    // console.log(result.body);

    this.body = '123';
});

router.get('/debug/styleImageCache', function * () {

    let token = (yield getToken(this.session.account._id)).token;
    let items = yield StyleItem.find();
    for(let item of items) {
        let $ = cheerio.load(item.html);

        let imgs = $('img');
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs.eq(i);
            let imgUrl = img.attr('src');
            yield mpImageCache(imgUrl, token);
        }

        let bgImages = $('.bgImage');
        for (let i = 0; i < bgImages.length; i++) {
            let bg = bgImages.eq(i);
            let imgUrl = bg.css('background-image');
            yield mpImageCache(imgUrl, token);
        }
    }

    this.body = '123';

});

// router.get('/debug/hehe', function *() {
//     let oa = new OfficicalAccount({
//         name: '外星人奇葩助手',
//         cover: 'https://mp.weixin.qq.com/misc/getheadimg?token=142102017&fakeid=3072113900&r=448302',
//         appId: 'wxfcedbbc4c75e8deb',
//         appSecret: '8e4d78768e326b8d8d512873ead56d43',
//     });
//     yield oa.save();
//
//     let t = new OfficicalAccountToken({
//         _id: oa._id,
//         token: '',
//         expires: 7200,
//     });
//     yield t.save();
//     this.body = 'hehe';
// });

// router.get('/debug/haha', function *() {
//     let oa = yield OfficicalAccount.findOne({_id: '5847e14c12a1f90a9a8782ef'});
//     let token = yield OfficicalAccountToken.findOne({_id: oa._id});
//     if((Date.now() - token.lastUpdated.getTime()) > 7000 * 1000) {
//         console.log('过期了');
//         let result = yield get(
//             'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
//                 + oa.appId + '&secret=' + oa.appSecret
//         );
//         if(result) {
//             let json = JSON.parse(result.body);
//             if(json.errcode) {
//                 console.log('get token error', result.body);
//             }else {
//                 token.token = json['access_token'];
//                 token.expires = json['expires_in'];
//                 token.lastUpdated = new Date();
//                 yield token.save();
//             }
//         }
//     }
//
//     this.body = 'haha';
// });

function * getToken(accountId) {
    // let oa = yield Tenancy.findOne({_id: accountId});
    // let token = yield OfficicalAccountToken.findOne({_id: oa._id});
    // if((Date.now() - token.lastUpdated.getTime()) > 7000 * 1000) {
    //     console.log('过期了');
    //     let result = yield get(
    //         'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
    //         + oa.appId + '&secret=' + oa.appSecret
    //     );
    //     if(result) {
    //         let json = JSON.parse(result.body);
    //         if(json.errcode) {
    //             console.log('get token error', result.body);
    //         }else {
    //             token.token = json['access_token'];
    //             token.expires = json['expires_in'];
    //             token.lastUpdated = new Date();
    //             yield token.save();
    //         }
    //     }
    // }
    return token;
}

function * get(url) {
    return new Promise((resolve, reject) => {
        request(url, function (err, res, body) {
            if(err) {
                reject(err);
                return;
            }
            resolve({res, body});
        });
    });
}

function * post(url, data, type = 'json', formData) {  //type: 'json' 'file'
    let opts = {
        url: url,
        method: 'POST'
    };
    if(type == 'json') {
        opts.json = data;
    }else if(type == 'file'){
        opts.formData = formData
    }
    return new Promise((resolve, reject) => {
        request(
            opts , function (err, res, body) {
            if(err) {
                reject(err);
                return;
            }
            resolve({res, body});
        });
    });
}

function * mpImageCache(url, token) {
    let mic = yield MpImageCache.findOne({url: url});
    if(mic) return;

    let tempPath = os.tmpDir();
    let arr = url.split('/');
    let filePath = path.join(tempPath, arr[arr.length - 1]);

    yield new Promise(function (resolve, reject){
        let ws = fs.createWriteStream(filePath);
        ws.on('finish',function(){
           resolve();
        });
        request.get(url)
            .on('error', function (err) {
                reject(err);
            })
            .pipe(ws);
    });

    console.log('https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=' + token);
    let {body} = yield post(
        'https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=' + token,
        'file', {
            media: fs.createReadStream(filePath)
        });
    console.log(body, typeof(body));
    yield fs.unlinkAsync(filePath);
}


router.get('/debug/debug', function * () {
    console.log(yield QiniuFileUtils.stat('abc'));
    this.body = 123;
});

module.exports = router;