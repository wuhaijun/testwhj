import Taro from '@tarojs/taro'
import {
  PROJECT_LIST, PROJECT_DETAIL, PROJECT_CONCAT_LIST,
  PROJECT_COLLECT, PROJECT_SHARE,
  PROJECT_NOTE, SEARCH_LIST, SEARCH_CONCAT_LIST,
  LOADING
} from '../constants'
import request from '../utils/request'
import contentHandler from '../utils/contentHandler'

export function getProjectList(themeId, page) {
  let url = '/api/project/list?themeId=' + themeId;
  return async function (dispatch) {
    let resp = await request({ url: url, data: { page: page } });
    const type = page > 1 ? PROJECT_CONCAT_LIST : PROJECT_LIST
    dispatch({ type, data: resp.data });
  }
}

export function getProjectDetail(projectId) {
  let url = '/api/project/detail/' + projectId;
  return async function (dispatch) {
    let resp = await request({ url: url });
    dispatch({ type: PROJECT_DETAIL, data: resp.data });
    let nodes = contentHandler.handle(resp.data.type)(resp.data.text, this);
    dispatch({ type: COMMON_NODES, nodes: nodes });
  }
}

export function doProjectCollect(projectId) {
  let url = '/api/project/toggleCollect';
  return async function (dispatch) {
    let resp = await request({ url: url, method: 'POST', data: { id: projectId } });
    dispatch({ type: PROJECT_COLLECT, data: resp.data, projectId: projectId });
  }
}

export function doProjectShare(projectId, type) {
  let url = '/api/project/share';
  return async function (dispatch) {
    let resp = await request({ url: url, method: 'POST', data: { id: projectId, type: type } });
    dispatch({ type: PROJECT_SHARE, data: resp.data, projectId: projectId });
  }
}

export function doProjectNote(projectId, domIndex, text, note) {
  let url = '/api/project/share';
  return async function (dispatch) {
    let resp = await request({
      url: url,
      method: 'POST',
      data: { id: projectId, domIndex: domIndex, text: text, note: note }
    });
    dispatch({ type: PROJECT_NOTE, data: resp.data, domIndex: domIndex });
  }
}

export function getProjectSearchList(keyword, page) {
  let url = '/api/project/list?keyword=' + keyword;
  return async function (dispatch) {
    dispatch({ type: LOADING, data: true });
    let resp = await request({ url: url, data: { page: page } });
    dispatch({type:LOADING,data:false});
    const type = page > 1 ? SEARCH_CONCAT_LIST : SEARCH_LIST
    dispatch({ type, data: resp.data });
  }
}
