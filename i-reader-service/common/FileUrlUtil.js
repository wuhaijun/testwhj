const _ =  require('lodash');
const IdUtils = require('./IdUtils');
// const TrackUtils = require('./TrackUtils');
const WH = '/w/440/h/300';

function defaultImageUrl(_id) {
    let hash = 0;
    _id = _id.slice(-4);
    for ( let i = 0; i < _id.length; i++ ) {
        hash += _id[i].charCodeAt() * Math.pow( 31 , _id.length - i - 1 );
    }
    let arr = [
        'http://boom-static.static.cceato.com/boom/imgs/nopic/1.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/2.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/3.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/4.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/5.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/6.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/7.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/8.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/9.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/10.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/11.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/12.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/13.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/14.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/15.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/16.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/17.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/18.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/19.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/20.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/21.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/22.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/23.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/24.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/25.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/26.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/27.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/28.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/29.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/30.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/31.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/32.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/33.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/34.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/35.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/36.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/37.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/38.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/39.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/40.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/41.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/42.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/43.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/44.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/45.jpg',
        'http://boom-static.static.cceato.com/boom/imgs/nopic/46.jpg'
    ];

    return arr[(hash % arr.length)] + `?imageView/3${WH}|imageView/1${WH}`;
}

function coverUrl(project) {
    return __coverUr__(project);
}

function coverUrlObj(project) {
    let url = __coverUr__(project);
    let defaultUrl = defaultImageUrl(project._id);

    return { url, defaultUrl }
}

function __coverUr__(project) {
    let wh = WH;
    let coverImg = project.coverImg;

    // if no cover or ignore cover, return a default image url gen by _id
    if(!coverImg || (!coverImg.fileName && (!coverImg.url || _.trim(coverImg.url).length == 0))) {
        let _id = project._id;
        return defaultImageUrl(_id);
    }

    if(coverImg.width && coverImg.height) {
        if(coverImg.width < 440 || coverImg.height.height < 300) {
            wh = '/w/220/h/150';
        }
    }

    if(coverImg.url) {
        if(project.type === 'instagram') {
            return md5CoverUrl(project);
        }
        let param = `imageView2/0${wh}/format/jpg|imageView/3${wh}|imageView/1${wh}`;
        return `http://imgcache.cceato.com/cache/${encodeURIComponent(coverImg.url)}?${param}`;
    }else {
        return `http://boom.static.cceato.com/${coverImg.fileName}?imageView/3${wh}|imageView/1${wh}/format/jpg|imageView/3${wh}|imageView/1${wh}`;
    }
}

function md5CoverUrl(project) {
    let wh = WH;
    return `${md5ImageUrl(project.coverImg.url, project.type)}?imageView2/0${wh}/format/jpg|imageView/3${wh}|imageView/1${wh}`;
}

function md5ImageUrl(url, type) {
    url = _.replace(url, 'http://', '');
    url = _.replace(url, 'https://', '');
    let queryIndex = url.indexOf('?');
    url = queryIndex == -1 ? url : url.substring(0, queryIndex);
    let fix = '';
    let i = url.lastIndexOf('.');
    if(i > -1 && (url.length - i) < 7) {
        fix = url.substring(i);
    }
    let host;
    switch (type) {
        case 'wechat':
            host = 'http://wx.static.cceato.com/';
            break;
        case 'instagram':
            host = 'http://inst.static.cceato.com/';
            break;
        case 'facebook':
            host = 'http://fb.static.cceato.com/';
            break;
        case 'twitter':
            host = 'http://tt.static.cceato.com/';
            break;
        case 'website':
            host = 'http://web.static.cceato.com/';
            break;
    }
    return host + IdUtils.md5ByString(url) + fix;
}

function downloadUrl(project) {
    if(!project.downloadFile) return null;
    return 'http://boom.static.cceato.com/'+project.downloadFile.fileName+'?attname='+project.downloadName;
}

function downloadProjectFile(id) {
    $.get('/api/project/download/' + id, function(json){
        let iframe = $('#download-iframe');
        if(iframe.length == 0) {
            iframe= $('<iframe id="download-iframe"></iframe>').hide();
            $('body').append(iframe);
        }
        iframe[0].src = json.url;
    });

    // TrackUtils.event(TrackUtils.CATEGORYS.PROJECT, TrackUtils.ACTIONS.DOWNLOAD, id);
}

module.exports = {
    coverUrl,
    coverUrlObj,
    downloadUrl,
    downloadProjectFile,
    md5CoverUrl,
    defaultImageUrl,
    md5ImageUrl
};