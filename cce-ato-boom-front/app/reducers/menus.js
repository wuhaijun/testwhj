'use strict';

import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';
import _ from 'lodash';

export default combineReducers({
    channels,
    channelMap,
    topics,
});

// [{_id:'', name:'', type:'', subList:[]}, {}]
function channels(state = [], action) {
    let data = action.data;
    switch (action.type) {
        case types.GLOBAL: {
            let channelList = [];

            let level1s = _.filter(data.channels, c => c.level == 1);
            let level2s = _.filter(data.channels, c => c.level == 2);

            _.each(level1s, l1 => {
                l1.subList = [];
                channelList.push(l1);
                _.each(level2s, l2 => {
                    if (l2.parent == l1._id) {
                        l1.subList.push(l2);
                    }
                });
            });
            return channelList;
        }
        default:
            return state;
    }
}

function channelMap(state = {}, action) {
    let data = action.data;
    switch (action.type) {
        case types.GLOBAL: {
            let channelMap = {};
            _.each(data.channels, c => {
                channelMap[c._id] = c;
            });
            return channelMap;
        }
        default:
            return state;
    }
}

function topics(state = [], action) {
    let data = action.data;
    switch (action.type) {
        case types.GLOBAL: {
            let topicList = [];
            let feedMap = _.keyBy(data.feeds, '_id');
            _.each(data.topics, t=> {
                let topic = {_id: t._id, name: t.name, subList: []};
                _.each(data.subscribes, s => {
                    if (s.topic == t._id) {
                        let feedId = s.feed;
                        let feed = feedMap[feedId];
                        feed.name = s.name;
                        topic.subList.push(feed);
                    }
                });
                topicList.push(topic);
            });
            return topicList;
        }

         case types.GUIDE_SAVE: {
             let topic = action.data;
             let index = state.findIndex(it => it._id == topic._id);
             if (index == -1 && topic._id) {
                 return [topic, ...state];
             }
             return state;
         }

        case types.TOPIC_CREATE:
            return [{_id: data.topic._id, name: data.topic.name, subList: []}, ...state];

        case types.TOPIC_DELETE: {
            let newState = [...state];
            _.remove(newState, t => t._id == data.topicId);
            return newState;
        }

        case types.TOPIC_UPDATE: {
            let index = _.findIndex(state, t => t._id == data.topicId);
            if (index > -1) {
                let newState = [...state];
                newState[index].name = data.name;
                return newState;
            }

            return state;
        }

        case types.TOPIC_FEED_UPDATE: {
            let index = _.findIndex(state, t => t._id == data.topicId);
            if (index > -1) {
                let fIndex = _.findIndex(state[index].subList, f=>f._id == data.feedId);
                if (fIndex > -1) {
                    let newState = [...state];
                    newState[index].subList[fIndex].name = data.name;
                    return newState;
                }
            }
            return state;
        }

        case types.TOPIC_SUBSCRIBE:
            return addSubscribe(data, state);

        case types.TOPIC_SUBSCRIBE_DELETE:
            return deleteSubscribe(data, state);

        case types.TOPIC_SUBSCRIBE_MOVE:
            return deleteSubscribe(data, addSubscribe(data, state));

        default:
            return state;
    }
}

const deleteSubscribe = function(data, state) {
    let feed = data.feed;
    let topicId = data.oldTopicId || data.topicId;
    let index = _.findIndex(state, t => t._id == topicId);
    if (index > -1) {
        let newState = [...state];
        let subList = [...(newState[index].subList)];
        _.remove(subList, s => s._id == feed._id);
        newState[index].subList = subList;
        return newState;
    }
    return state;
};

const addSubscribe = function(data, state) {
    let index = _.findIndex(state, t => t._id == data.topicId);
    let feed = data.feed;
    if(index > -1) {
        let subList = [{_id: feed._id, name: feed.name, type: feed.type}, ...state[index].subList];
        let newState = [...state];
        newState[index].subList = subList;
        return newState;
    }
    return state;
};


