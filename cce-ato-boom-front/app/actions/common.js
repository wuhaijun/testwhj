import { get, post } from '../../common/fetch';
import * as types from '../constants/ActionTypes';

export function loading(key, data) {
    return {
        type: types.LOADING,
        key: key,
        data: data
    }
}

export function fetchGlobal() {
    let url = '/api/global';
    return dispatch => {
        return get(url).then(json => {
            dispatch({
                type: types.GLOBAL,
                data: json
            });
        });
    };
}

export const savePreviewPage = (previewUrl, previewHtml) => {
    let url = '/api/preview';
    console.log(previewUrl);
    return dispatch => {
        post(url, { url: previewUrl, html: previewHtml }).then(json => {
            dispatch({
                type: types.PREVIEW,
                data: json
            });
        });
    }
}