'use strict';

import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';
import _ from 'lodash';

export default combineReducers({
    collection
});

function collection(state = {}, action) {
    return combineReducers({ tags, isCollected })(state, action);
}

function tags(state = [], action) {
    switch (action.type){
        case types.CANCEL_COLLECT_PROJECT:
            return [];

        case types.SAVE_COLLECTION_TAGS:
            return action.data.tags;

        default:
            return state;
    }
}

function isCollected(state = false, action) {
    switch (action.type){

        case types.COLLECT_PROJECT:
            return true;

        case types.CANCEL_COLLECT_PROJECT:
            return false;

        default:
            return state;
    }
}


