'use strict';
const Article = require('../models/editor/Article');
const ArticleContent = require('../models/editor/ArticleContent');
const ImageUploadFile = require('../models/image/ImageUploadFile');
const imageRouter = require('./images');
const target_dir = imageRouter.target_dir;
const router = require('koa-router')();
const parse = require('co-body');
const _ = require('lodash');
const fs = require('fs');
require('bluebird').promisifyAll(fs);
const rp = require('request-promise');
const {SSO_API_Client} = require('koa-sso-auth-cli');
const env = process.env;

router.get('/wechat/mplist', function * () {
    // let mpList = yield rp(env.SSO_SERVER + '/api/getMPList' + '?token=' + this.session.token);
    let mpList = yield SSO_API_Client.getMPList(this.session.token);
    this.body = mpList;
});

function getArticleIdList(ctx) {
    let articleIdList = this.query['article[]'];
    if(typeof(articleIdList) === 'string') {
        articleIdList = [articleIdList];
    }
    articleIdList = _.uniq(articleIdList);
    return articleIdList;
}

router.get('/wechat/push', function * () {
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
    this.body = yield Article.find({_id: {$in: articleIdList}, account: accountId});
});

/**
 * 同步更新这部分代码可能会被废弃被push取代
 */
router.get('/wechat/sync', function * () {
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

    let thumbMediaId = yield getImageMediaId(token, mpId, accountId, article.cover);
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
        content: content.content || '',
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

function * getImageMediaId(token, mpId, accountId, url) {
    let uploadFile, filePath;
    if(!url) {
        return null;
    }
    let dir = target_dir + accountId + '/';
    if(url.indexOf('editor.static.cceato.com/' + dir)) {
        let arr = url.split('/');
        let filename = arr[arr.length - 1];
        let key = dir + filename;
        uploadFile = yield ImageUploadFile.findOne({account: accountId, key: key});
    }

    if(!uploadFile) {
        return null;
    }

    let mediaMap = uploadFile.mpMap && uploadFile.mpMap[mpId];

    if(!mediaMap) {
        if(!filePath) {
            filePath = yield imageRouter.download(url);
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
        }
    }

    if(filePath) {
        yield fs.unlinkAsync(filePath);
    }

    return mediaMap.media_id;
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
