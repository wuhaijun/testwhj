import { get } from './fetch.js';
const onMenuShareTimeline = "onMenuShareTimeline";
const onMenuShareAppMessage = "onMenuShareAppMessage";
import * as projectTypes from '../app/constants/ProjectTypes.js';

const JWEIXIN_ID = 'jweixin';
const JWEIXIN_CONFIG_ID = 'jweixinConfig';
const JWEIXIN_READY_ID = 'jweixinReady';
const JWEIXIN_SHARE_ID = 'jweixinShare';
let PREV_ID = null;

export const injectJweixin = () => {
    if (!document.getElementById(JWEIXIN_ID)) {
        let jweixinScript = document.createElement('script');
        jweixinScript.setAttribute('id', JWEIXIN_ID);
        jweixinScript.setAttribute('src', 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js');
        document.head.appendChild(jweixinScript);
    }
}

export const removeJweixin = () => {
    if (document.getElementById(JWEIXIN_ID))
        document.getElementById(JWEIXIN_ID).remove();
}

export const injectConfig = (project) => {
    let location = document.location;
    let apiUrl = '/api/jssdk/config';
    let configObj = { debug: false, jsApiList: [onMenuShareTimeline, onMenuShareAppMessage] };
    if (PREV_ID != project._id) {
        document.getElementById(JWEIXIN_CONFIG_ID) ? document.getElementById(JWEIXIN_CONFIG_ID).remove() : "";
    }
    get(apiUrl, { url: location.href }).then((json) => {
        configObj = { ...configObj, ['appId']: json.appId, ['timestamp']: json.timestamp, ['nonceStr']: json.nonceStr, ['signature']: json.signature }

        if (!document.getElementById(JWEIXIN_CONFIG_ID)) {
            let jweixinConfig = document.createElement('script');
            jweixinConfig.setAttribute('id', JWEIXIN_CONFIG_ID);
            jweixinConfig.text = `wx.config({
            debug: ${configObj.debug},
            appId: '${configObj.appId}',
            timestamp:  '${configObj.timestamp}',
            nonceStr: '${configObj.nonceStr}',
            signature: '${configObj.signature}',
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'],
        });
            ${shareJs(project)}
        `;
            document.head.appendChild(jweixinConfig);
            PREV_ID = project._id;
        }
    });
}

const shareJs = (project) => {
    let shareUrl = location.origin + '/preview?projectId=' + location.pathname.split('/').slice(-1) + "&originUrl=" + encodeURIComponent(location.href);
    let desc = project.desc.slice(0, 40).replace(/\r/, '').replace(/\n/, '').replace(/\r\n/, '').replace(/\r\n\r\n/, '').replace("\"", '') + '...';
    let pic = project.coverImg.fileName;
    let title = supplyTitle(project);
    return `wx.ready(function(){
                wx.onMenuShareTimeline({
                    title: '${title}',
                    link: '${shareUrl}', 
                    imgUrl: 'http://boom.static.cceato.com/${pic}',
                    success: function () {
                    },
                    cancel: function () {
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '${title}',
                    desc: '${desc}', 
                    link: '${shareUrl}', 
                    imgUrl: 'http://boom.static.cceato.com/${pic}',
                    type: '',
                    dataUrl: '',
                    success: function () {
                    },
                    cancel: function () {
                    }
                });
            });`
}

const supplyTitle = (project) => {
    switch (project.type) {
        case projectTypes.INSTAGRAM:
        case projectTypes.TWITTER:
        case projectTypes.FACEBOOK:
            return project.origin && project.origin.name + ' # ' + project.desc;
    }
    return project.title;
}

export const removeConfig = () => {
    if (document.getElementById(JWEIXIN_CONFIG_ID))
        document.getElementById(JWEIXIN_CONFIG_ID).remove();
}

export const injectShare = () => {
    if (!document.getElementById(JWEIXIN_SHARE_ID)) {
        let jweixinShare = document.createElement('script');
        jweixinShare.setAttribute('id', JWEIXIN_SHARE_ID);
        jweixinShare.text = `wx.onMenuShareTimeline({
            title: '我是文艺',
            link: 'http://192.168.29.101:7777/preview', 
            imgUrl: '', // 分享图标
            success: function () {
                console.log('分享成功');
            },
            cancel: function () {
                console.log('取消分享');
            }
        });`;
        document.head.appendChild(jweixinShare);
    }


}

export const removeShare = () => {
    if (document.getElementById(JWEIXIN_SHARE_ID))
        document.getElementById(JWEIXIN_SHARE_ID).remove();
}