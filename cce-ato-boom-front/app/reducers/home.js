'use strict';

import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';

export default combineReducers({
    sliders,
    hotSubscribes,
    recommendSubscribes,
    hotProjects,
    recommendProjects
});

function sliders(state = [], action) {
    switch (action.type){
        case types.HOME_SLIDERS:
            return action.data;

        default:
            return state;
    }
}

function hotSubscribes(state = [], action) {
    switch (action.type){
        case types.HOT_SUBSCRIBES:
            return action.data;

        default:
            return state;
    }
}

function recommendSubscribes(state = [], action) {
    switch (action.type){
        case types.RECOMMEND_SUBSCRIBES:
            return action.data;

        default:
            return state;
    }
}

function hotProjects(state = [], action) {
    switch (action.type){
        case types.HOT_PROJECTS:
            return action.data;

        default:
            return state;
    }
}

function recommendProjects(state = [], action) {
    switch (action.type){
        case types.RECOMMEND_PROJECTS:
            if (action.query.page != 1)
                return state.concat(action.data);
            else
                return action.data;

        default:
            return state;
    }
}

