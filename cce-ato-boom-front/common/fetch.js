'use strict';

import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import config from './config';

export function get(url, query) {
    url = buildUrl(url);
    if(query) {
        url += ('?' + Object.keys(query).map(q => {
           if(query[q] != undefined) return q + '=' + encodeURIComponent(query[q]);
        }).join('&'));
    }
    let options = {
        method: 'GET',
        headers: {
            'x-requested-with': 'XmlHttpRequest'
        },
        credentials: 'include'
    };
    console.log('Access get api: ' + url);
    return fetch(url, options).then(json).then(check);
}

export function post(url, data) {
    url = buildUrl(url);
    let options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'x-requested-with': 'XmlHttpRequest',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log('Access post api: ' + url);
    return fetch(url, options).then(json).then(check);
}

function json(res) {
    return res.json();
}

function check(json) {
    if(json && json.errcode && json.errcode === 10000) {
        swal({title: '登录失效，请重新登录'}, function () {
            window.location.reload(true);
        });
        throw new Error('need login');
    }
    return json;
}

const buildUrl = function(url) {
    let host = config.get('host');
    if(!host) {
        throw new Error('未正确配置全局变量host, 无法发送api');
    }
    url = ('http://' + host + url);
    return url;
};