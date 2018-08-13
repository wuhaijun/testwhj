'use strict';

import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';
import _ from 'lodash';

export default combineReducers({
    list,
    isAll
});

function list(state = [], action) {
    switch (action.type){
        case types.LIST_PROJECT: {
            if (action.query.page != 1)
                return state.concat(action.data);
            else
                return action.data;
        }
        default:
            return state;
    }
}

function isAll(state = false, action) {
    switch (action.type){
        case types.LIST_PROJECT:
            return action.data.length < 20;
        default:
            return state;
    }
}


