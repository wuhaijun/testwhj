import { THEME_LIST, THEME_MAPPING, THEME_COLLECT } from '../constants'
import _ from 'lodash';

export function themeList(state = [], action) {
    let data = action.data;
    switch (action.type) {
        case THEME_LIST: return data;
        case THEME_COLLECT: {
            let newList = _.clone(state);
            let themeId = action.themeId;
            for (let theme in newList) {
                if (theme._id === themeId) {
                    theme.isCollect = !theme.isCollect;
                    theme.isCollect ? theme.count+=1 : theme.count-=1;
                }
            }
            return newList;
        }
        default: return state;
    }
}

export function themeMapping(state = [], action) {
    switch (action.type) {
        case THEME_MAPPING: {
            let result = _.keyBy(action.data, "_id");
            return result;
        }
        case THEME_COLLECT: {
            let newMapping = _.clone(state);
            let themeId = action.themeId;
            let theme = newMapping[themeId];
            theme.isCollect = !theme.isCollect
            theme.isCollect ? theme.count+=1 : theme.count-=1;
            return newMapping;
        }
        default: return state;
    }
}