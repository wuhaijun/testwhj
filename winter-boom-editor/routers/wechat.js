'use strict';
const Article = require('../models/editor/Article');
const ArticleContent = require('../models/editor/ArticleContent');
const ImageUploadFile = require('../models/image/ImageUploadFile');
const router = require('koa-router')();
const parse = require('co-body');
const cheerio = require('cheerio');
const _ = require('lodash');
const config = require('config');
const fs = require('fs');
require('bluebird').promisifyAll(fs);
const rp = require('request-promise');
const {SSO_API_Client} = require('koa-sso-auth-cli');

const {TARGET_DIR, EDITOR_IMAGE_HOST, upload, download} = require('./services/image-service');

router.get('/wechat/mplist', function * () {
    // let mpList = yield rp(env.SSO_SERVER + '/api/getMPList' + '?token=' + this.session.token);
    // let mpList = yield SSO_API_Client.getMPList(this.session.token);

    let account = yield SSO_API_Client.getUserInfo(this.session.token);
    if(!account.bindWechatMpList) {
        this.body = [];
        return;
    }
    let result = yield rp({
        url: config.get('editor_api') + '/accounts/mpList',
        method: 'POST',
        json: {
            mp_list: account.bindWechatMpList
        }
    });
    this.body = result;
});

function getArticleIdList(ctx) {
    let articleIdList = ctx.query['article[]'];
    if(typeof(articleIdList) === 'string') {
        articleIdList = [articleIdList];
    }
    articleIdList = _.uniq(articleIdList);
    return articleIdList;
}

router.get('/wechat/push', function * () {
    this.body = yield req(this, '/article/push');
});

router.get('/wechat/sync', function * () {
    this.body = yield req(this, '/article/sync');
});

router.get('/wechat/preview', function * () {
    this.body = yield req(this, '/article/preview');
});

function * req(ctx, path) {
    let query = ctx.query;
    query.account = ctx.session.account._id;
    let opts = {
        url: config.get('editor_api') + path,
        qs: query,
        useQuerystring: true
    }
    let body = yield rp(opts);
    if(typeof body == 'object') {
        return body;
    }
    return JSON.parse(body);
}

router.get('/wechat/push_bak', function * () {
    let articleIdList = getArticleIdList(this);
    let mpId = this.query.mp;
    let mpAccessToken = yield getMpToken(mpId, this.session.token);
    if(!mpAccessToken) {
        this.body = {errmsg: '未能获取 access token'};
        return;
    }
    let merge = _.eq('1', this.query.merge);
    if(merge) {
        if(articleIdList.length > 8) {
            this.body = {errmsg: '多图文最多一次8篇内容'};
            return;
        }
    }
    let accountId = this.session.account._id;
    let list = yield Article.find({_id: {$in: articleIdList}, account: accountId});
    list = _.sortBy(list, a => _.indexOf(articleIdList, a.id));

    let dataList = [];
    for(let article of list) {
        let thumbMediaId = yield getImageMediaIdWithUpload(mpAccessToken, mpId, accountId, article.cover);
        if(!thumbMediaId) {
            this.body = {errcode: 900406, errmsg: '没有设置封面图'};
            return;
        }
        let content = yield ArticleContent.findOne({_id: article._id});
        let data = {
            title: article.title || '未定义标题',
            thumb_media_id: thumbMediaId,
            show_cover_pic: 1,
            author: article.author,
            digest: article.digest,
            content: yield htmlImageUrlHandle(content.content, mpAccessToken, mpId, accountId),
            content_source_url: article.sourceUrl
        };
        dataList.push(data);
    }
    let result = yield post(
        `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${mpAccessToken}`,
        {articles: dataList}
    );


    if(result.errcode && result.errcode != 0) {
        this.body = {status: 'error', errmsg: result.errmsg, errcode: result.errcode};
        return;
    }

    this.body = {status: 'ok'};
});

/**
 * 同步更新这部分代码可能会被废弃被push取代
 */
router.get('/wechat/sync_bak', function * () {
    let articleIdList = getArticleIdList(this);

    let mpId = this.query.mp;
    let mpAccessToken = yield getMpToken(mpId, this.session.token);
    if(!mpAccessToken) {
        this.body = {errmsg: '未能获取 access token'};
        return;
    }
    let accountId = this.session.account._id;

    let successList = [];
    let failList = [];
    let errmsgList = [];
    for(let articleId of articleIdList) {
        let result = yield sync(articleId, accountId, mpId, mpAccessToken);
        if(result.errcode && result.errcode != 0) {
            failList.push(articleId);
            errmsgList.push(result);
        }else {
            successList.push(articleId);
        }
    }

    this.body = {successList, failList, errmsgList};
});

function * sync(articleId, accountId, mpId, token) {
    let article = yield Article.findOne({_id: articleId});
    if(!article || article.account != accountId) {
        return {errcode: 900404, errmsg: 'article is not found,' + articleId};
    }

    let thumbMediaId = yield getImageMediaIdWithUpload(token, mpId, accountId, article.cover);
    if(!thumbMediaId) {
        return {errcode: 900406, errmsg: '没有设置封面图'};
    }

    let content = yield ArticleContent.findOne({_id: article._id});

    let data = {
        title: article.title || '未定义标题',
        thumb_media_id: thumbMediaId,
        show_cover_pic: 1,
        author: article.author,
        digest: article.digest,
        content: yield htmlImageUrlHandle(content.content || '', token, mpId, accountId),
        content_source_url: article.sourceUrl
    };

    let result;
    let mpMap = article.mpMap;
    let mediaId = article.mpMap[mpId];
    function * addNew() {
        result = yield post(
            `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${token}`,
            {
                articles: [data]
            }
        );
        mpMap[mpId] = result['media_id'];
    }
    if(article.status == 1 || article.status == 0 || !mediaId) {
        yield addNew();
    } else {
        result = (yield post(
            `https://api.weixin.qq.com/cgi-bin/material/update_news?access_token=${token}`, {
                media_id: mediaId,
                index: 0,
                articles: data
            }
        ));

        if(result.errcode === 40007) {
            yield addNew();
        }
    }

    if(result.errcode && result.errcode != 0) {
        return result;
    }

    article.status = 3;
    yield Article.update(
        {_id: article._id},
        {$set: {
            status: 3,
            mpMap: mpMap
        }}
    );

    return result;
}

/* 在同步之前处理正文，对图片地址进行替换 */
function * htmlImageUrlHandle(html, token, mpId, accountId) {
    if(!html) {
        return '';
    }
    let $ = cheerio.load(html);
    let imgList = $('img');
    for(let i=0;i<imgList.length;i++) {
        let img = imgList.eq(i);
        let imgUrl = img.attr('src');
        let imageMedia = yield getImageMedia(token, mpId, accountId, imgUrl);
        let w_img_url = imageMedia && imageMedia.url;
        if(!w_img_url) {
            w_img_url = img.attr('w_img');
        }
        if(w_img_url) {
            html = _.replace(html, imgUrl, w_img_url);
        }
    }
    let bgList = $('.bgImage');
    for(let i=0;i<bgList.length;i++) {
        let img = bgList.eq(i);
        let imgUrlStr = img.css('background-image') || img.css('border-image') || img.css('-webkit-border-image');
        if(!imgUrlStr || _.trim(imgUrlStr).length == 0) {
            console.log(i, img.html());
            continue;
        }
        let imgUrl = imgUrlStr.substring(4, imgUrlStr.length - 1);
        if(imgUrl.length>2 && imgUrl.charAt(0) == '"') {
            imgUrl = imgUrl.substring(1, imgUrl.length - 1);
        }
        let imageMedia = yield getImageMedia(token, mpId, accountId, imgUrl);
        let w_img_url = imageMedia && imageMedia.url;
        if(!w_img_url) {
            w_img_url = img.attr('w_img');
        }

        if(w_img_url) {
            html = _.replace(html, imgUrl, w_img_url);
        }
    }
    return html;
}

function* getImageMedia(token, mpId, accountId, url) {
    if(!url) {
        return null;
    }
    let uploadFile, filePath;
    let dir = TARGET_DIR + accountId + '/';
    if(url.indexOf(EDITOR_IMAGE_HOST + '/' + dir)) {
        let arr = url.split('/');
        let filename = arr[arr.length - 1];
        let key = dir + filename;
        uploadFile = yield ImageUploadFile.findOne({account: accountId, key: key});
    }

    if(!uploadFile) {
        uploadFile = yield ImageUploadFile.findOne({account: accountId, originUrl: url});
    }

    if(!uploadFile) {
        return null;
    }

    let mediaMap = uploadFile.mpMap && uploadFile.mpMap[mpId];

    if(!mediaMap) {
        if(!filePath) {
            filePath = (yield download(url)).path;
        }
        let mpResult = JSON.parse(yield post(
            `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
            {}, 'file', {media: fs.createReadStream(filePath)}
        ));
        if(!mpResult.errcode || mpResult.errcode == 0) {
            mediaMap = mpResult;
            uploadFile.mpMap[mpId] = mediaMap;
            yield ImageUploadFile.update({
                _id: uploadFile._id
            }, {
                $set: {
                    mpMap: uploadFile.mpMap
                }
            });
        }else {
            console.error(mpResult);
        }
    }

    if(filePath) {
        yield fs.unlinkAsync(filePath);
    }
    return mediaMap;
}


function * getImageMediaId(token, mpId, accountId, url) {
    let mediaMap = yield getImageMedia(token, mpId, accountId, url);
    return mediaMap && mediaMap.media_id;
}

/*非用户上传的url，先下载并上传至用户图片库，然后获取mediaId*/
function * getImageMediaIdWithUpload(token, mpId, accountId, url) {
    let id = yield getImageMediaId(token, mpId, accountId, url);
    if(id) {
        return id;
    }
    let imageFile = yield download(url);

    let uploadFile = yield upload(imageFile, null, accountId);

    yield ImageUploadFile.updateOne(
        {_id: uploadFile._id},
        {$set: {originUrl: url}}
    );

    url = `http://${EDITOR_IMAGE_HOST}/${uploadFile.key}`;

    if(imageFile) {
        yield fs.unlinkAsync(imageFile.path);
    }

    return yield getImageMediaId(token, mpId, accountId, url);
}

//@TODO 公众号id是否考虑加密存储呢
function * getMpToken(mp, token) {
    return yield SSO_API_Client.getMpAccessToken(token, mp);
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
    return yield rp(opts);
}

module.exports = router;
