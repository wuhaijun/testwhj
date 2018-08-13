import Taro from '@tarojs/taro'
import { THEME_LIST, THEME_MAPPING, THEME_COLLECT } from '../constants'
import request from '../utils/request'

export function getThemeList() {
  let url = '/api/theme/list';
  return async function (dispatch) {
    let resp = await request({ url });
    dispatch({ type: THEME_LIST, data: resp.data });
    dispatch({ type: THEME_MAPPING, data: resp.data });
  }
}

export function doThemeCollect(themeId) {
  let url = '/api/theme/toggleCollect';
  return async function(dispatch) {
    let resp = await request({url:url,method:'POST',data:{id:themeId}});
    dispatch({type:THEME_COLLECT,data:resp.data,themeId:themeId});
  }
}
