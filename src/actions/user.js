import Taro from '@tarojs/taro'
import {
  USER_INFO,
  USER_NOTES,
  USER_CONCAT_NOTES,
  USER_COLLECTS,
  USER_CONCAT_COLLECTS
} from '../constants'
import request from '../utils/request'

export function getUserInfo() {
    let url = '/api/user/info'
    return async function (dispatch) {
        let resp = await request({ url });
        dispatch({ type: USER_INFO, data: resp.data });
    }
}

export function getProjectNotes(page) {
    let url = '/api/projectNote/list?page=' + page;
    return async function (dispatch) {
        let resp = await request({ url });
         const type = page > 1 ? USER_CONCAT_NOTES : USER_NOTES
        dispatch({ type, data: resp.data });
    }
}

export function getProjectCollects(page) {
    let url = '/api/projectCollect/list?page=' + page;
    return async function (dispatch) {
        let resp = await request({ url });
        const type = page > 1 ? USER_CONCAT_COLLECTS : USER_COLLECTS
        dispatch({ type, data: resp.data });
    }
}