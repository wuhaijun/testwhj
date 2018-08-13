'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';
import _ from 'lodash';
import menusCombineReducers from './menus';
import projectsCombineReducers from './projects';
import collectionCombineReducers from './collection';
import homeCombineReducers from './home';
import guide from './guide';

export default combineReducers({
    loading,
    home,
    projects,
    project,
    feedSources,
    feedSourceTypes,
    previewFeedProjects,
    previewProject,
    account,
    menus,
    guide,
    preview
});


function home(state = {}, action) {
    return homeCombineReducers(state, action);
}

function loading(state = {}, action) {
    switch (action.type) {
        case types.LOADING: {
            let data = {};
            data[action.key] = action.data;
            return _.assign({}, state, data);
        }
        default:
            return state;
    }
}

function feedSources(state = [], action) {
    switch (action.type) {
        case types.LIST_FEED_SOURCE:
            return action.data;
        default:
            return state;
    }
}

function previewFeedProjects(state = {}, action) {
    switch (action.type) {
        case types.LIST_PREVIEWFEED_PROJECTS:
            return action.data;
        default:
            return state;
    }
}

function previewProject(state = {}, action) {
    switch (action.type) {
        case types.PREVIEW_PROJECT:
            return action.data;
        default:
            return state;
    }
}

function feedSourceTypes(state = [], action) {
    switch (action.type) {
        case types.LIST_FEED_SOURCE_TYPE:
            return action.data;
        default:
            return state;
    }
}

function account(state = {}, action) {
    switch (action.type) {
        case types.GLOBAL:
            return action.data.account;

        case types.SAVE_COLLECTION_TAGS:
            return _.assign({}, state,
                { tags: _.uniq((state.tags || []).concat(action.data.tags)) });
        default:
            return state;
    }
}

function project(state = {
    collection: {}
}, action) {

    switch (action.type) {
        case types.SHOW_PROJECT:
            return _.assign({}, action.data);

        default:
            let { tags, isCollected } = (state.collection || {});
            return _.assign({}, state, collectionCombineReducers({ collection: { tags, isCollected } }, action));
    }
}

function projects(state = {}, action) {
    return projectsCombineReducers(state, action);
}

function menus(state = {}, action) {
    return menusCombineReducers(state, action);
}

function preview(state = {}, action) {
    switch (action.type) {
        case types.PREVIEW:
            return _.assign({}, state, action.data);
        default:
            return state;
    }
}