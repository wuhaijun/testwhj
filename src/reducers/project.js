import {
    PROJECT_LIST, PROJECT_DETAIL, PROJECT_CONCAT_LIST,
    PROJECT_COLLECT, PROJECT_SHARE,
    PROJECT_NOTE, SEARCH_LIST, SEARCH_CONCAT_LIST
} from '../constants'
import _ from 'lodash';
import util from '../utils/util'

export function projectList(state = {}, action) {
    switch (action.type) {
        case PROJECT_LIST: {
            let projectList = _.clone(action.data.projectList);
            for (let project of projectList) {
                let nweTime = util.formatDate(new Date(project.datePublished));
                let newTatil = util.replaceHtmlChar(project.title);
                project.datePublished = nweTime;
                project.title = newTatil;
            }
            return projectList;
        }
        case PROJECT_CONCAT_LIST: {
            let projectList = _.clone(action.data.projectList);
            for (let project of projectList) {
                let nweTime = util.formatDate(new Date(project.datePublished));
                let newTatil = util.replaceHtmlChar(project.title);
                project.datePublished = nweTime;
                project.title = newTatil;
            }
            return [...state, ...projectList];
        }
        case PROJECT_COLLECT: {
            let newList = _.clone(state);
            let projectId = action.projectId;
            for (let project of newList) {
                if (project._id === projectId) {
                    project.isCollected = !project.isCollected;
                    project.isCollected ? project.collectCount += 1 : project.collectCount -= 1;
                }
            }
            return newList;
        }
        case PROJECT_SHARE: {
            let newList = _.clone(state);
            let projectId = action.projectId;
            for (let project of newList) {
                if (project._id === projectId) {
                    project.shareCount += 1;
                }
            }
        }
        default: return state;
    }
}

export function projectDetail(state = {}, action) {
    switch (action.type) {
        case PROJECT_DETAIL: return action.data;
        case PROJECT_COLLECT: {
            let project = _.clone(state);
            project.isCollected = !project.isCollected;
            project.isCollected ? project.collectCount +1 : project.collectCount -= 1;
            return project;
        }
        case PROJECT_SHARE: {
            let project = _.clone(state);
            project.shareCount += 1;
            return project;
        }
        case PROJECT_NOTE: {
            let project = _.clone(state);
            let operator = action.data.operator;
            let domIndex = action.domIndex;
            if (operator === 'add') {
                if (!project.notes) project.notes = [];
                project.notes.push(domIndex);
            } else {
                project.notes = _.pull(project.notes, domIndex);
            }
        }
        default: return state;
    }
}

export function projectSearchList(state = [], action) {
    switch (action.type) {
        case SEARCH_LIST: {
            let searchList = _.clone(action.data.projectList);
            for (let project of searchList) {
                let nweTime = util.formatDate(new Date(project.datePublished));
                let newTatil = util.replaceHtmlChar(project.title);
                project.datePublished = nweTime;
                project.title = newTatil;
            }
            return searchList;
        }
        case SEARCH_CONCAT_LIST:
          {
            let searchList = _.clone(action.data.projectList);
            for (let project of searchList) {
              let nweTime = util.formatDate(new Date(project.datePublished));
              let newTatil = util.replaceHtmlChar(project.title);
              project.datePublished = nweTime;
              project.title = newTatil;
            }
            return [...state, ...searchList];
          }
        default: return state;
    }

}