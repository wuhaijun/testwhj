import { get, post } from '../../common/fetch';
import * as types from '../constants/ActionTypes';
import { loading } from './common';

export const guideList = () => {
    return dispatch => {
        get('/api/subscribe/feedSourceCategoryGroupList').then(json => {
            dispatch({
                type: types.GUIDE_INTEREST_LIST,
                data: json
            });
        });
    };
};

export const accountList = categoryIds => {
    return dispatch => {
        get('/api/subscribe/guideFeedSourceList', { categoryIds: categoryIds }).then(json => {
            dispatch({
                type: types.GUIDE_ACCOUNT_LIST,
                data: json
            });
        });
    };
};

export const save = (jobId, interestIds = [], feeds = []) => {
    return dispatch => {
        post('/api/guide/subscribe/save', { feedCategoryGroup: jobId, feedCategories: interestIds, feeds: feeds }).then(json => {
            setTimeout(()=>{
                let topicResult = json.data || {};
                if (feeds.length != 0) {
                    topicResult.subList = feeds;
                }
                dispatch({
                    type: types.GUIDE_SAVE,
                    data: topicResult
                });
            },500);

        });
    };
};

export const handleStep = (step) => {
    return {
        type: types.GUIDE_STEP,
        data: step
    }
};

export const stepReset = () => {
    return {
        type: types.GUIDE_STEP_RESET,
        data: 0
    }
};
