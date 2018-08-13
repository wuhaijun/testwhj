import {get, post} from  '../../common/fetch';
import * as types from '../constants/ActionTypes';
import {loading} from './common';

export function recommendProjects(page = 1, pageSize = 9) {
    return dispatch => {
        dispatch(loading('recommendProjects', true));
        return get('/api/recommend/projects', { page, pageSize }).then(json => {
            dispatch({
                type: types.RECOMMEND_PROJECTS,
                data: json,
                query: { page, pageSize }
            });
        }).then(() => {
            dispatch(loading('recommendProjects', false));
        });


    }

}

/*精选文章*/
export function selectionProjects() {
    return dispatch => {
        
    }
}

export function hotProjects(page = 1, pageSize = 9) {
    return dispatch => {
        get('/api/hot/projects', { page, pageSize }).then(json => {
            dispatch({
                type: types.HOT_PROJECTS,
                data: json,
                query: { page, pageSize }
            });
        });
    };
}

export function toggleCollect(id) {
    let url = '/api/project/toggleCollect';
    let data  = { id: id };
    return dispatch => {
        return post(url, data).then(json => {
            if (json.operator == 'add') {
                dispatch({
                    type: types.COLLECT_PROJECT,
                    data: data
                });
            }
            if (json.operator == 'cancel') {
                dispatch({
                    type: types.CANCEL_COLLECT_PROJECT
                });
            }
        });
    };
}

export function saveCollectionTags(id, tags) {
    let url = '/api/project/saveCollectionTags';
    let data  = { pid: id, tags: tags };
    return dispatch => {
        return post(url, data).then(json => {
            if (json.result == 'ok') {
                dispatch({
                    type: types.SAVE_COLLECTION_TAGS,
                    data: json.data
                });
            }
        });
    };
}


export function fetchProject(id) {
    let url = '/api/project/detail/' + id;
    return dispatch => {
        dispatch(loading('project', true));
        return get(url).then(json => {
            dispatch({
                type: types.SHOW_PROJECT,
                data: json,
                url: url
            })
        }).then(() => {
            dispatch(loading('project', false));
        }) ;
    };
}

export function listProject(opts) {
    return dispatch => {
        dispatch(loading('channel', true));
        return get('/api/project/list', opts).then(json => {
            dispatch({
                type: types.LIST_PROJECT,
                data: json,
                query: opts
            })
        }).then(() => {
            dispatch(loading('channel', false));
        });
    };
}

export function listCollections(page = 1, tags, keyword) {
    let query  = { page: page, tags: tags, keyword: keyword };
    return dispatch => {
        dispatch(loading('collections', true));
        return get('/api/project/collections', query).then(json => {
            dispatch({
                type: types.LIST_PROJECT,
                data: json,
                query: query
            });
        }).then(() => {
            dispatch(loading('collections', false));
        });
    };
}