import Taro from '@tarojs/taro'
import config from '../config/default.json'

async function checkSession() {
    let checkSessionResp
    let sessionId
    try {
        checkSessionResp = await Taro.checkSession();
        console.log("checkSessionResp", checkSessionResp)
        let sessionData = await Taro.getStorage({key:"sessionId"});
        sessionId = sessionData.data;
        console.log("sessionId",sessionId)
        if (!sessionId) {
            sessionId = await login();
        }
    } catch (e) {
        console.log(e)
        sessionId = await login();
    }
    return sessionId
}

async function login() {
    let loginResp = await Taro.login();
    let sessionData = await Taro.request({ url: config.server + '/api/user/login/' + loginResp.code });
    let sessionId = sessionData.data.sessionId;
    await Taro.setStorage({ key: 'sessionId', data: sessionId });
    return sessionId;
}

export default async function request(opts) {
    let url = opts.url || '';
    let method = opts.method || 'GET';
    let data = opts.data || {};

    let sessionId = await checkSession();
    try {
        let resp = await Taro.request({
            url: config.server + url,
            header: { sessionId: sessionId },
            method: method,
            data: data
        });
        return resp;
    } catch (e) {
        console.log(e);
        console.warn('Login error when call api: ' + url)
    }
}