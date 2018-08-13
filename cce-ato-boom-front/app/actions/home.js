import { get, post } from  '../../common/fetch';
import * as types from '../constants/ActionTypes';
import { loading } from './common';

export function sliders() {
    return dispatch => {
        get('/api/slider/list', { version: 'development_1' }).then(json => {
            dispatch({
                type: types.HOME_SLIDERS,
                data: json
            });
        });
    };
}