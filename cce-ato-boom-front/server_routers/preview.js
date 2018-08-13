'use strict';
const router = require('koa-router')();
const parse = require('co-body');
const Preview = require('../models/Preview');
const Project = require('../models/Project');
const ProjectText = require('../models/ProjectText');
const FeedSource = require('../models/FeedSource');
const Channel = require('../models/Channel');
const config = require('config');
const moment = require('moment');
let rp = require('request-promise');
const FileUrlUtil = require('../common/FileUrlUtil');
const cheerio = require('cheerio');

router.get('/preview', function* () {
    let sess = this.session;
    let projectId = this.query.projectId;
    let originUrl = this.query.originUrl;
    /**从微信网页内授权跳转回来后携带code */
    let code = this.query.code;
    if (code) {
        yield getWebAuthUserinfo(code);
    }
    if (sess && sess.token) {
        let token_check_url = config.get('sso.api_server') + '/api/token/check?token=' + sess.token;
        let jsonStr = yield rp(token_check_url);
        let json = JSON.parse(jsonStr);
        if (json.status)
            this.redirect(originUrl);
    }
    let project = yield getProjectById(projectId);
    if (!project) {
        this.body = {};
        return;
    }
    let projectText = yield ProjectText.findOne({ _id: projectId });
    project.text = projectText.text;

    let datePublished = project.datePublished ? moment(project.datePublished).format('YYYY-MM-DD') : '';
    let originName = yield getOriginName(project);

    let webAuthUrl = yield getWebAuthUrl("http://" + this.host + this.url);
    yield this.render('preview', { title: project.title, coverImg: project.coverImg, content: supplyText(project), projectType: project.type, originName: originName, datePublished: datePublished, redirectUrl: originUrl });
});

router.post('/api/preview', function* () {
    let data = yield parse(this);
    let url = data.url;
    let html = data.html;
    let preview = yield Preview.findOne({ url: url });
    if (preview) {
        this.body = true;
    } else {
        yield new Preview({ url: url, html: html }).save();
        this.body = true;
    }
});

router.get('/api/jssdk/config', function* () {
    let currentUrl = this.query.url;
    let url = config.get('sso.api_server') + '/api/jssdk/config';
    let mpConfig = yield rp({
        uri: url,
        qs: { url: currentUrl },
        json: true
    });
    this.body = mpConfig;
});


function* queryProjectFeedAndChannel(project) {
    if (!project) return;
    let feedId = project.feed;
    let channelId = project.channel;
    if (feedId) {
        let feed = yield FeedSource.findOne({ _id: feedId });
        project.origin = feed ? {
            _id: feed._id,
            name: feed.name,
            type: feed.type,
            originType: 'feed'
        } : { originType: 'feed' };
    } else if (channelId) {
        let channel = yield Channel.findOne({ _id: channelId });
        let parent;
        if (channel.level != 1) {
            parent = yield Channel.findOne({ _id: channel.parent });
        }

        project.origin = channel ? {
            _id: channel._id,
            name: channel.name,
            pname: parent && parent.name,
            type: channel.type,
            icon: channel.icon,
            originType: 'channel'
        } : { originType: 'channel' }
    }
    return project;
}

function* getProjectById(projectId) {
    return yield Project.findOne({ _id: projectId, isDel: 0 }, {
        originViews: 0,
        originLikes: 0,
        originForwards: 0,
        originShares: 0
    });
}

function* getOriginName(project) {
    let json = project.toObject();
    json = yield queryProjectFeedAndChannel(json)
    let origin = json.origin;
    let name = "";
    if (origin) {
        let type = origin.type;
        name = origin.name;
        name = type ? type + '/' + name : name;
    }
    return name;
}

function textHandle(data) {
    let type = data.type;
    let $ = cheerio.load(data.text);

    let $content = $('div').eq(0);
    $content.children('h2').eq(0).remove();
    $content.children('div').eq(0).remove();

    //过滤script
    $('script').remove();

    //过滤class
    $('*').removeAttr('class').removeAttr('id');

    //图片懒加载
    $('img').map(function (i, el) {
        let imgUrl = $(this).attr('src');
        if (type == 'wechat') {
            imgUrl = 'http://imgcache.cceato.com/cache/' + encodeURIComponent(imgUrl);
        }
        $(this).removeAttr('src');
        $(this).attr('data-original', imgUrl);
        return $(this).text();
    });

    return $.html();
}

function supplyText(data) {
    let instagramImg = data.coverImg && data.coverImg.url && `<img src=${FileUrlUtil.md5ImageUrl(data.coverImg.url, data.type)} />`
    switch (data.type) {
        case 'facebook':
        case 'twitter':
        case 'instagram':
            return (
                `
        <div>
            ${instagramImg}
            <p>${data.desc}</p>
        </div>
        `
            );
        case 'studio':
            return (
                `
        <div>
            <p style={'textAlign': 'center'}>
                <img src='http://boom.static.cceato.com/${data.coverImg.fileName}' />
            </p>
            <div>${textHandle(data)}</div>
        </div>
        `
            );
        default:
            return (
                data.text ?
                    (`<div>${textHandle(data)}</div>`)
                    :
                    (`<div><p>${data.desc}</p></div>`)
            );
    }
}

function* getWebAuthUrl(redirectUrl) {
    let resp = yield rp({
        uri: config.get('sso.api_server') + '/api/webAuth/code',
        qs: { redirectUrl: encodeURIComponent(redirectUrl) },
        json: true
    });
    return resp;
}

function* getWebAuthUserinfo(code) {
    let resp = yield rp({
        uri: config.get('sso.api_server') + '/api/webAuth/userinfo',
        qs: { code: code },
        json: true
    });
}

module.exports = router;