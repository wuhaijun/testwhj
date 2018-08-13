import { get, post } from '../../common/fetch';
import * as types from '../constants/ActionTypes';
import { loading } from './common';
import { isFunction } from '../../common/Utils';

export function hotFeedSources(page = 1, pageSize = 3) {
    return dispatch => {
        get('/api/hot/feedSources', { page, pageSize }).then(json => {
            dispatch({
                type: types.HOT_SUBSCRIBES,
                data: json,
                query: { page, pageSize }
            });
        });
    };
}

export function recommendFeedSources(page = 1, pageSize = 3) {
    return dispatch => {
        get('/api/recommend/feedSources', { page, pageSize }).then(json => {
            dispatch({
                type: types.RECOMMEND_SUBSCRIBES,
                data: json,
                query: { page, pageSize }
            });
        });
    };
}

export function previewProject(projectId) {
    let url = '/api/project/detail/' + projectId;
    return dispatch => {
        return get(url).then(json => {
            dispatch({
                type: types.PREVIEW_PROJECT,
                data: json
            })
        }) ;
    };
}

export function listPreviewFeedProjects(feedId) {
    let url = '/api/subscribe/listPreviewFeedProjects/' + feedId;
    return dispatch => {
        dispatch(loading('listPreviewFeedProjects', true));
        return get(url).then(json => {
            dispatch({
                type: types.LIST_PREVIEWFEED_PROJECTS,
                data: json
            });
        }).then(() => {
            dispatch(loading('listPreviewFeedProjects', false));
        });
    };
}

export function listFeedSources(condition) {
    let url = '/api/subscribe/feedSourceList';
    return dispatch => {
        return get(url, condition).then(json => {
            dispatch({
                type: types.LIST_FEED_SOURCE,
                data: json,
                query: condition
            });
        });
    };
}

export function listFeedSourceTypes() {
    let url = '/api/subscribe/feedSourceTypeList';
    return dispatch => {
        return get(url).then(json => {
            dispatch({
                type: types.LIST_FEED_SOURCE_TYPE,
                data: json
            });
        });
    };
}

export function createTopic(name) {
    return dispatch => {
        _createTopic(dispatch, name);
    };
}

function _createTopic(dispatch, name) {
    let url = '/api/subscribe/newTopic';
    let data = {name: name};

    return post(url, data).then(json => {
        dispatch({
            type: types.TOPIC_CREATE,
            data: json
        });
        return json;
    });
}

export function subscribeTopic(topicId, feed, callback) {
    return dispatch => {
        _subscribeTopic(dispatch, topicId, feed, callback);
    };
}

function _subscribeTopic(dispatch, topicId, feed, callback) {
    let url = '/api/subscribe/follow';
    let data = { topicId: topicId, feed: feed };
    return post(url, data).then(json => {
        dispatch({
            type: types.TOPIC_SUBSCRIBE,
            data: data
        });
    }).then(() => {
        callback && isFunction(callback) && callback();
    });
}

export function createTopicAndSubscribe(name, feed, callback) {
    return dispatch => {
        _createTopic(dispatch, name).then((json) => {
            _subscribeTopic(dispatch, json.topic._id, feed, callback)
        });
    };
}

export function deleteTopicSubscribe(topicId, feedId, callback) {
    let url = '/api/subscribe/delete';
    let data = { topicId: topicId, feed: { _id: feedId} };
    return dispatch => {
        return post(url, { feedId: feedId }).then(json => {
            dispatch({
                type: types.TOPIC_SUBSCRIBE_DELETE,
                data: data
            }).then(() => {
                callback && isFunction(callback) && callback();
            });
        })
    };
}

export function deleteTopic(topicId) {
    let url = '/api/subscribe/deleteTopic';
    let data = {topicId: topicId};
    return dispatch => {
        return post(url, data).then(json => {
            dispatch({
                type: types.TOPIC_DELETE,
                data: data
            });
        })
    };
}

export function updateTopic(topicId, name) {
    let url = '/api/subscribe/updateTopic';
    let data = {topicId: topicId, name: name};
    return dispatch => {
        return post(url, data).then(json => {
            dispatch({
                type: types.TOPIC_UPDATE,
                data: data
            });
        })
    };
}

export function updateTopicFeed(topicId, feedId, name) {
    let url = '/api/subscribe/updateTopicFeed';
    let data = {topicId: topicId, feedId:feedId, name: name};
    return dispatch => {
        return post(url, data).then(json => {
            dispatch({
                type: types.TOPIC_FEED_UPDATE,
                data: data
            });
        })
    };
}

export function moveSubscribe(oldTopicId, topicId, feed) {
    let url = '/api/subscribe/move';
    let data = {topicId: topicId, oldTopicId: oldTopicId, feed: feed};
    return dispatch => {
        return post(url, data).then(json => {
            dispatch({
                type: types.TOPIC_SUBSCRIBE_MOVE,
                data: data
            });
        })
    };
}

