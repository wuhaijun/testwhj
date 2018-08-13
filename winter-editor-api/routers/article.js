'use strict';

const Article = require('../models/editor/Article');
const ArticleContent = require('../models/editor/ArticleContent');
const Preview = require('../models/editor/Preview');
const ImageWechatCache = require('../models/editor/ImageWechatCache');
const ImageUploadFile = require('../models/image/ImageUploadFile');

const _ = require('lodash');
const cheerio = require('cheerio');
const fs = require('fs');
require('bluebird').promisifyAll(fs);

const {PUSH: PUSH_ERR_CODES, PREVIEW: PREVIEW_ERR_CODES} = require('../common/ErrorCodes');
const {post} = require('../common/Fetch');
const router = require('koa-router')({
    prefix: '/article'
});

const {EDITOR_IMAGE_HOST, upload, download, findImageUploadFile} = require('./services/image-service');


/**
 * @api {get} /article/push 多图文同步
 * @apiName Push
 * @apiGroup Article
 *
 * @apiParam {String} account Account账户id
 * @apiParam {String} merge 这个参数是海军搞的，到底干啥的我没注意。
 * @apiParam {String} mp 公众号id
 * @apiParam {String} article[] article的id，最多支持8个
 *
 * @apiSuccess {String} status ok即为成功.
 *
 * @apiError {String} errcode 错误码
 * @apiError {String} errmsg 错误信息
 */
router.get('/push', function * () {
    let articleIdList = getArticleIdList(this);
    console.log(this.querystring, this.query, articleIdList);
    let mpId = this.query.mp;
    let merge = _.eq('1', this.query.merge);
    let accountId = this.query.account;

    if(articleIdList.length == 0) {
        this.body = PUSH_ERR_CODES.PUSH_ARTICLE_MISSED;
        return;
    }
    if(merge) {
        if(articleIdList.length > 8) {
            this.body = PUSH_ERR_CODES.PUSH_ARTICLE_TO_MANY;
            return;
        }
    }
    let list = yield Article.find({_id: {$in: articleIdList}});
    if(!list || list.length == 0) {
        this.body = PUSH_ERR_CODES.PUSH_ARTICLE_MISSED;
        return;
    }
    list = _.sortBy(list, a => _.indexOf(articleIdList, a.id));

    function * handle() {
        let dataList = [];
        for(let article of list) {
            let thumbMediaId;
            try {
                thumbMediaId = yield getImageMediaIdWithUpload(mpId, accountId, article.cover);
                if(!thumbMediaId) {
                    this.body = PUSH_ERR_CODES.PUSH_ARTICLE_COVER_MISSED;
                    return;
                }
            }catch (e) {
                this.body = {errcode: 900500, errmsg: e.errmsg || e.message};
                return;
            }
            let content = yield ArticleContent.findOne({_id: article._id});
            let data = {
                title: article.title || '未定义标题',
                thumb_media_id: thumbMediaId,
                show_cover_pic: 0,
                author: article.author,
                digest: article.digest,
                content: yield htmlImageUrlHandle(content.content, mpId, accountId),
                content_source_url: article.sourceUrl
            };
            dataList.push(data);
        }
        return yield post('/cgi-bin/material/add_news', {id: mpId}, {articles: dataList});
    }

    let result = yield handle();

    if(result.errcode === 40007) {
        //很可能由于封面图删除，造成缓存的ImageId失效，故删除图片后重新同步。
        yield list.map(article=> deleteMp(mpId, accountId, article.cover));
        result = yield handle();
    }

    if(result.errcode && result.errcode != 0) {
        this.body = result;
        return;
    }

    this.body = {status: 'ok'};
});


/**
 * @api {get} /article/sync 图文同步
 * @apiName Sync
 * @apiGroup Article
 *
 * @apiParam {String} account Account账户id
 * @apiParam {String} mp 公众号id
 * @apiParam {String} article[] article的id，最多支持8个
 *
 * @apiSuccess {Array} successList 成功同步的文章
 * @apiSuccess {Array} failList 同步失败的文章
 * @apiSuccess {Array} errmsgList 同步失败的错误信息
 */
router.get('/sync', function * () {
    let articleIdList = getArticleIdList(this);
    let mpId = this.query.mp;
    let accountId = this.query.account;

    let successList = [];
    let failList = [];
    let errmsgList = [];
    for(let articleId of articleIdList) {
        let result = yield sync(articleId, accountId, mpId);
        //我已经忘了为什么这里要再整一次了，估计是因为某些图片已经同步到微信后台，但由于被人为删除，故重新同步吧。
        if(result.errcode && result.errcode == 40007) {
            result = yield sync(articleId, accountId, mpId);
        }
        if(result.errcode && result.errcode != 0) {
            failList.push(articleId);
            errmsgList.push(result);
        }else {
            successList.push(articleId);
        }
    }

    this.body = {successList, failList, errmsgList};
});


const MP_LIST = ['wx584f579730c96e60', 'wx7bccf1f87d4ca21d', 'wx0796c43ed4d3b306'];
/**
 * @api {get} /article/preview 图文预览
 * @apiName Preview
 * @apiGroup Article
 *
 * @apiParam {String} article article的id
 *
 * @apiSuccess {String} url 文章的URL
 *
 * @apiError {String} errcode 错误码
 * @apiError {String} errmsg 错误信息
 * @TODO mpId需要支持多小号方案
 * @TODO 封面图可以更高效的使用公众号临时图片
 */
router.get('/preview', function * () {
    let query = this.query;
    let articleId = query.article;

    if(!articleId) {
        this.body = PREVIEW_ERR_CODES.ARTICLE_MISSED;
        return;
    }

    let article = yield Article.findOne({_id: articleId}, {account: 1, lastUpdated: 1});
    if(!article) {
        this.body = PREVIEW_ERR_CODES.ARTICLE_NOT_FOUND;
        return;
    }


    let mpId = MP_LIST[article._id.getTimestamp() % MP_LIST.length];
    // let mpId = 'wx6d76d3e4b2813d93';

    let preview = yield Preview.findOne({article: articleId});
    if(preview && (preview.articleDate.getTime() == article.lastUpdated.getTime())) {
        this.body = {url: preview.shortUrl || preview.url};
        return;
    }

    if(!mpId) {
        this.body = PREVIEW_ERR_CODES.MP_MISSED;
        return;
    }

    let url = preview && preview.url;
    let shortUrl = preview && preview.shortUrl;

    let force = false;
    //15分钟之内再次预览，需要删掉原同步内容
    if(!preview || ((preview.syncDate.getTime() + 900000) > Date.now())) {
        force = true;
        if(preview) {
            yield post('/cgi-bin/material/del_material', {id: mpId}, {media_id: preview['media_id']});
        }
    }
    let syncResult = yield sync(articleId, article.account, mpId, force);

    if(syncResult.errcode && syncResult.errcode != -1) {
        this.body = syncResult;
        return;
    }

    if(force) {
        let mediaId = syncResult['media_id'];
        let previewResult = yield post('/cgi-bin/material/get_material', {id: mpId}, {'media_id': mediaId});
        if(previewResult.errcode && previewResult.errcode != -1) {
            // console.log(previewResult, query);
            this.body = previewResult;
            return;
        }

        url = previewResult['news_item'][0].url;
        let shortUrlResp = yield getShortUrl(mpId,url);
        if(shortUrlResp.errmsg === "ok") {
            shortUrl = shortUrlResp.short_url
        } else {
            shortUrl = url;
        }

        if(!preview) {
            yield new Preview({
                mp: mpId,
                article: articleId,
                mediaId,
                url: url,
                shortUrl : shortUrl
            }).save();
        }
    }

    if(preview) {
        yield Preview.updateOne(
            {_id: preview._id}, {
                url: url,
                shortUrl : shortUrl,
                articleDate: article.lastUpdated,
                syncDate: new Date()
            });
    }
    this.body = {url: shortUrl};
});

function *getShortUrl(mpId,longUrl="") {
    let result = yield post('/cgi-bin/shorturl', {id: "wx40a2285f047ce3f6"}, {action: "long2short",long_url: longUrl});
    return result;
}

function getArticleIdList(ctx) {
    let articleIdList = ctx.query['article[]'] || ctx.query['article'] ;
    // console.log(ctx.query);
    if(typeof(articleIdList) === 'string') {
        articleIdList = [articleIdList];
    }
    articleIdList = _.uniq(articleIdList);
    return articleIdList;
}

function * sync(articleId, accountId, mpId, force = false) {
    let article = yield Article.findOne({_id: articleId});
    if(!article) {
        return {errcode: 900404, articleId, errmsg: 'article is not found,' + articleId};
    }

    function * handle(autoAddNew = true) {
        let thumbMediaId;
        try {
            thumbMediaId = yield getImageMediaIdWithUpload(mpId, accountId, article.cover);
            if(!thumbMediaId) {
                return {errcode: 900406, articleId, errmsg: '没有设置封面图'};
            }
        }catch (e) {
            return {errcode: 900500, errmsg: e.errmsg || e.message};
        }

        let content = yield ArticleContent.findOne({_id: article._id});

        let data = {
            title: article.title || '未定义标题',
            thumb_media_id: thumbMediaId,
            show_cover_pic: 0,
            author: article.author,
            digest: article.digest,
            content: yield htmlImageUrlHandle(content.content || '', mpId, accountId),
            content_source_url: article.sourceUrl
        };

        let result;
        let mpMap = article.mpMap;
        let mediaId = article.mpMap[mpId];
        function * addNew() {
            result = yield post('/cgi-bin/material/add_news', {id: mpId}, {articles: [data]});
            mpMap[mpId] = result['media_id'];
        }
        function * updateNew() {
            result = (yield post(
                '/cgi-bin/material/update_news', {id: mpId}, {
                    media_id: mediaId,
                    index: 0,
                    articles: data
                }
            ));
            result['media_id'] = mediaId;

        }

        if(!mediaId || force) {
            yield addNew();
        } else {
            yield updateNew();
            if(autoAddNew && result.errcode === 40007) {
                yield addNew();
            }
        }

        if(result.errcode && result.errcode != 0) {
            return result;
        }

        article.status = 3;
        yield Article.updateOne(
            {_id: article._id},
            {$set: {
                status: 3,
                mpMap: mpMap
            }}
        );

        return result;
    }

    let result = yield handle(false);
    if(result.errcode === 40007) {
        //很可能由于封面图删除，造成缓存的ImageId失效，故删除图片后重新同步。
        yield deleteMp(mpId, accountId, article.cover);
        result = yield handle();
    }
    return result;
}

function * deleteMp(mpId, accountId, url) {
    let uploadFile = yield findImageUploadFile(accountId, url);
    let mpMap = uploadFile.mpMap;
    let mediaMap = mpMap[mpId];
    if(mediaMap) {
        yield post('/cgi-bin/material/del_material', {id: mpId}, {media_id: mediaMap["media_id"]});
        delete mpMap[mpId];
        yield ImageUploadFile.update({
            _id: uploadFile._id
        }, {
            $set: {
                mpMap: uploadFile.mpMap
            }
        });
    }
}

/**
 * 同一张image对应不同的帐号同步，会有不同的media_id。
 * mpMap负责存储同一张用户图片在多个帐号中的media_id信息。
 * 此方法对于没有imageMediaId的情况下不进行处理。
 * 会抛出异常
 */
function* getImageMedia(mpId, accountId, url) {
    let uploadFile = yield findImageUploadFile(accountId, url);
    if(!uploadFile) {
        return null;
    }

    let mediaMap = uploadFile.mpMap && uploadFile.mpMap[mpId];

    if(!mediaMap || !mediaMap.url) {
        try {
            let filePath = (yield download(url)).path;
            let mpResult = yield post(
                '/cgi-bin/material/add_material',
                {id: mpId, type: 'image'},
                {media: fs.createReadStream(filePath)},
                true
            );
            if (!mpResult.errmsg) {
                mediaMap = mpResult;
                uploadFile.mpMap[mpId] = mediaMap;
                yield ImageUploadFile.update({
                    _id: uploadFile._id
                }, {
                    $set: {
                        mpMap: uploadFile.mpMap
                    }
                });
            } else {
                // console.error(mpResult);
                throw mpResult;
            }
            if (filePath) {
                yield fs.unlinkAsync(filePath);
            }
        }catch (e) {
            return e;
        }
    }

    return mediaMap;
}

/* 在同步之前处理正文，对图片地址进行替换 */
function * htmlImageUrlHandle(html, mpId, accountId) {
    if(!html) {
        return '';
    }
    let $ = cheerio.load(html);
    let imgList = $('img');
    for(let i=0;i<imgList.length;i++) {
        let img = imgList.eq(i);
        let imgUrl = img.attr('src');
        if(img.attr('origin-src')) {
            html = _.replace(html, `origin-src="${img.attr('origin-src')}"`, '');
        }
        html = yield imageUrlReplace(html, mpId, accountId, img, imgUrl);
    }
    let bgList = $('.bgImage, .borderImage');
    for(let i=0;i<bgList.length;i++) {
        let img = bgList.eq(i);
        let imgUrl;
        let imgUrlStr = img.css('background-image') || img.css('border-image') || img.css('-webkit-border-image');
        if(!imgUrlStr || _.trim(imgUrlStr).length == 0) {
            // console.log(i, img.html());
            continue;
        }
        if(img.css('background-image')) {
            imgUrl = imgUrlStr.substring(4, imgUrlStr.length - 1);
        }
        if(img.css('border-image') || img.css('-webkit-border-image')) {
            let arr = imgUrlStr.split(/[(]|[)]/);
            imgUrl = arr[1];
        }
        if(!imgUrl) {
            continue;
        }
        if(imgUrl.length>2 && (imgUrl.charAt(0) == '"' || imgUrl.charAt(0) == "'")) {
            imgUrl = imgUrl.substring(1, imgUrl.length - 1);
        }
        html = yield imageUrlReplace(html, mpId, accountId, img, imgUrl);
    }

    html = html.replace(new RegExp("<mp-miniprogram.*/mp-miniprogram>", 'gim'), '');
    return html;
}

function * imageUrlReplace(html, mpId, accountId, img, imgUrl) {
    if(!img || !imgUrl || imgUrl.startsWith('data') || imgUrl.length > 500) {
        return html;
    }
    let w_img_url = yield getImageUrl(mpId, accountId, img, imgUrl);

    if(w_img_url) {
        html = _.replace(html, imgUrl, w_img_url);
    }
    // console.log(imgUrl, w_img_url, html);
    return html;
}

function * getImageUrl(mpId, accountId, img, imgUrl) {
    if(imgUrl.startsWith('http://imgcache.cceato.com/cache/')) {
        imgUrl = imgUrl.replace('http://imgcache.cceato.com/cache/', '');
        imgUrl = decodeURIComponent(imgUrl);
    }

    if(imgUrl.startsWith('http://mmbiz.qpic.cn/')
        || imgUrl.startsWith('https://mmbiz.qpic.cn/')
        || imgUrl.startsWith('http://wx.qlogo.cn/')
        || imgUrl.startsWith('http://wx.qlogo.cn/')
        || imgUrl.startsWith('https://wx.qlogo.cn/')
        || imgUrl.startsWith('//res.wx.qq.com')
        || imgUrl.startsWith('http://res.wx.qq.com')
        || imgUrl.startsWith('https://res.wx.qq.com')
    ) {
        return imgUrl;
    }

    let w_img_url;

    let iwc = yield ImageWechatCache.findOne({_id: imgUrl});
    w_img_url = iwc && iwc.url;

    if(!w_img_url) {
        let imageMedia = yield getImageMedia(mpId, accountId, imgUrl);
        w_img_url = imageMedia && imageMedia.url;
    }

    if(!w_img_url) {
        w_img_url = yield uploadTempImage(imgUrl, mpId);
    }
    return w_img_url;
}


function * getImageMediaId(mpId, accountId, url) {
    let mediaMap = yield getImageMedia(mpId, accountId, url);
    return mediaMap && mediaMap.media_id;
}

/*
 * 获取图片对应的微信端的media_id
 * 同步文章需要封面图的id，一般用于同步文章。
*/
function * getImageMediaIdWithUpload(mpId, accountId, url) {
    if(!url) {
        return null;
    }
    //@TODO 这部分代码当初设计有问题，抛出异常这种操作没有良好的处理。
    if(url.startsWith('data') || url.length > 500) {
        return null;
    }
    let id = yield getImageMediaId(mpId, accountId, url);
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

    return yield getImageMediaId(mpId, accountId, url);
}

/*
    正文中外部链接的图片，同步至微信的临时图片。
 */
function * uploadTempImage(imgUrl, mpId) {
    try {
        let imageFile = yield download(imgUrl);
        let tempResult = yield post(
            '/cgi-bin/media/uploadimg', {id: mpId},
            {media: fs.createReadStream(imageFile.path)}, true
        );
        if(tempResult.url) {
            let iwc = new ImageWechatCache({
                _id: imgUrl,
                url: tempResult.url
            });

            yield iwc.save();

            if(imageFile) {
                yield fs.unlinkAsync(imageFile.path);
            }
            return iwc.url;
        }
    }catch (e) {
        console.error(e);
    }
    return null;
}

module.exports = router;
