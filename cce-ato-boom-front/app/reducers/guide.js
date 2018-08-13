import * as types from '../constants/ActionTypes';
import { combineReducers } from 'redux';

const options = (state = {
    groups: [],
    categories: []
}, action) => {
    switch (action.type) {
        case types.GUIDE_INTEREST_LIST: {
            return action.data
        }
        default: return state
    }
};

const feeds = (state = [], action) => {
    switch (action.type) {
        case types.GUIDE_ACCOUNT_LIST: return action.data;
        default: return state
    }
};

const step = (state = 0, action) => {
    switch (action.type) {
        case types.GUIDE_STEP:
        case types.GUIDE_STEP_RESET:
            return action.data;
        case types.GUIDE_SAVE:
            return 3;
        default: return state
    }
};

export default combineReducers({
    options,
    feeds,
    step
});