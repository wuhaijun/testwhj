import Taro from '@tarojs/taro'
import { LOGIN } from '../constants'
import config from '../config/default.json'

export function login() {
  return async function (dispatch) {
    let loginResp = await Taro.login();
    let sessionData = await Taro.request({ url: config.server + '/api/user/login/' + loginResp.code });
    let storeResp = await Taro.setStorage({ key: 'sessionId', data: sessionData.data.sessionId });
    dispatch({ type: LOGIN, data: storeResp.data });
  }
}

