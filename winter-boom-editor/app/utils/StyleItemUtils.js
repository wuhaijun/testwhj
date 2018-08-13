const _ = require('lodash');

let itemMap = {};
let itemListMap = {};

function __section__(html) {
    let $section = $(html);
    _.each($section.find('*').contents(), c => {
        if(c.nodeType && c.nodeType === 3 && _.trim(c.textContent).length == 0) {
            c.remove();
        }
    });
    return $section;
};

function loadItem(type, callback) {
    type = type._id;
    let data = itemListMap[type];

    if(data && (data.time.getTime() + 3600000 < new Date().getTime())) {
        callback(data.list);
        return;
    }

    $.getJSON('/api/styles/' + type, json => {
        let list = json.result;
        let time = new Date();
        itemListMap[type] = {
            time,
            list
        };

        _.each(list, i => {
            itemMap[i._id] = i;
            if(i.func) {
                i.func = eval('('+i.func.replace(/\r/ig,'').replace(/\n/ig,'')+')');
            }
            i.showSection = __section__(i.html);
            if(i.editHtml) {
                i.editSection = __section__(i.editHtml);;
            }else {
                i.editSection = i.showSection.clone();
            }
        });

        callback(list);
    });
}

function itemTidy(sectionList) {
    
}

export default {
    loadItem
}