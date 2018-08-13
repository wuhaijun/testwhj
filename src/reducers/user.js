import {
  USER_INFO,
  USER_NOTES,
  USER_COLLECTS,
  USER_CONCAT_NOTES,
  USER_CONCAT_COLLECTS
} from '../constants'
import util from '../utils/util'

export function userInfo(state = {}, action) {
    let data = action.data;
    switch (action.type) {
        case USER_INFO: return data;
        default: return state;
    }
}


export function userNotes(state = {}, action) {
    let data = action.data
    switch (action.type) {
        case USER_NOTES: {
            for (let item of data) {
                let newTime = util.formatTime(new Date(item.notedDate));
                let newTitle = util.replaceHtmlChar(item.projectTitle);
                item.projectTitle = newTitle;
                item.notedDate = newTime;
            }
            return data;
        }
        case USER_CONCAT_NOTES: {
            for (let item of data) {
                let newTime = util.formatTime(new Date(item.notedDate));
                let newTitle = util.replaceHtmlChar(item.projectTitle);
                item.projectTitle = newTitle;
                item.notedDate = newTime;
            }
            return [...state, ...data];
        }
        default: return state;
    }
}

export function userCollects(state = {}, action) {
    let data = action.data;
    switch (action.type) {
        case USER_COLLECTS: {
            for (let item of data.projectList) {
                let nweTime = util.formatDate(new Date(item.datePublished));
                item.datePublished = nweTime;
            }
            return data;
        }
        case USER_CONCAT_COLLECTS: {
            for (let item of data.projectList) {
                let nweTime = util.formatDate(new Date(item.datePublished));
                item.datePublished = nweTime;
            }
            let projectList = [...state.projectList , ...data.projectList];
            let themeList = [...state.themeList , ...data.themeList];
            return { projectList: projectList  , themeList: themeList };
        }
        default: return state;
    }
}