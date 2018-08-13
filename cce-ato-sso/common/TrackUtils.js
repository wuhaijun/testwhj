function trackPage() {
    let page = window.location.pathname + window.location.search;
    ga('set', 'page', page);
    ga('send', 'pageview');
}

const CATEGORYS = {
    CHANNEL: 'channel',
    FEED: 'feed',
    PROJECT: 'project',
    SEARCH: 'search',

    COLLECT: 'collect',
    LIKE: 'like',
    DOWNLOAD: 'download',

    BUTTONS: 'buttons'
};

const ACTIONS = {
    LIST_PAGE: 'list page',
    SEARCH: 'search',
    DOWNLOAD: 'download',

    MENU_FOLD: 'menu fold',
    PERSON_INFO_FOLD: 'person info fold',
    FEEDBACK: 'feedback',
    SCROLL_UP: 'scroll up',
    ARGEE: 'argee',

    PROJECT_TAG: 'project tag',
    PROJECT_COLLECT: 'project collect',
    PROJECT_COLLECT_SAVE_TAGS: 'project collect save tags',
    PROJECT_LIKE: 'project like',
};

function event(category, action, label, value) {
    ga('send', 'event', category, action, label, value);
}

let modules = {
    trackPage,
    event
};

function wrapperTryCatch(func) {
    return function () {
        try {
            func.apply(this, arguments);
        }catch (e) {
            console.error(e);
        }
    }
}

for(let key in modules) {
    modules[key] = wrapperTryCatch(modules[key]);
}

modules.CATEGORYS = CATEGORYS;
modules.ACTIONS = ACTIONS;
module.exports = modules;