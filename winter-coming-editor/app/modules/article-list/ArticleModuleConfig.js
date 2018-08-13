import _ from 'lodash';
import SyncArticle from './SyncArticle';
import {subscribe, EVENTS} from '../../utils/EventCenter';

let body;
let header;
let sidebar;

let editor;

let wrapper;

let isInit = false;
let articleList;

export default {
    id: 'editor-article-module',
    width: 180,
    title: '我的文章',
    buttonColor: '#f9b2bd',
    buttonIcon: 'icon-docs',
    side: 'right',
    defaultClose: true,
    leftCanClose: true,

    init: function (module) {

        body = module.body;
        header = module.header;
        sidebar = module.sidebar;
        editor = module.editorContext.editor;

        wrapper = $('<div></div>');

        initHeaderBtn();
        load();

        body.append(wrapper);
    }

}

subscribe(EVENTS.ARTICLE_SAVE, function (data) {
    let a = $('#article_' + data._id);
    if(a.length == 0) {
        buildArticle(data).prependTo(wrapper);
    }else {
        a.find('div.title').text(data.title);
        a.css('background', `rgba(0, 0, 0, 0) url("${data.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`);
    }
});

function initHeaderBtn() {
    let syncBtn = $('<button class="btn btn-success" style="margin-left: 7px;">同步</button>');
    let freshBtn = $('<button class="btn btn-default">刷新</button>');

    syncBtn.click(function () {
        SyncArticle();
    });
    freshBtn.click(load);

    let btnWrapper = $('<div></div>');
    btnWrapper.append(freshBtn).append(syncBtn);
    header.html(btnWrapper);
}

function buildArticle(a){
    let delBtn = buildDelBtn(a);
    let isShow = false;
    let showTimeout;
    return $(`<div id="article_${a._id}"></div>`).css({
        display: 'block',
        cursor: 'pointer',
        width:'86%',
        height: '100px',
        position: 'relative',
        'margin-left': '7%',
        'margin-bottom': '7px',
        'border-bottom': '1px solid #ebebe7',
        'background': `rgba(0, 0, 0, 0) url("${a.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`
    })
        .click(function () {
            showArticle(a._id);
        })
        .hover(() => {
            showTimeout = setTimeout(function () {
                delBtn.show('fast');
                isShow = true;
            }, 200);
        }, () => {
            if(isShow) {
                delBtn.hide('fast');
                isShow = false;
            }else {
                clearTimeout(showTimeout);
                showTimeout = false;
            }
        })
        .append(delBtn)
        .append(buildTitle(a.title));
}

function load() {
    $.getJSON('/article/list', function (result) {
        let list = result.list;
        articleList = list;
        wrapper.empty();
        _.each(list, a => {
            buildArticle(a).appendTo(wrapper);
        });

        if(!isInit && list) {
            isInit = true;
            if(list[0]){
                showArticle(list[0]._id);
            }

        }
    });
}

function buildTitle(title) {
    return $(`<div class="title">${title}</div>`).css({
        width: '100%',
        height: '30px',
        color: '#fff',
        position: 'absolute',
        bottom: 0,
        padding: '0 5px',
        overflow: 'hidden',
        'background-color': 'rgba(33, 34, 35, 0.7)',
        'text-align': 'center',
        'line-height': '30px'
    });
}

function buildDelBtn(article) {
    return $(`<a title="删除文章"></a>`)
        .hide()
        .css({
            height: '23px',
            width: '23px',
            position: 'absolute',
            right: 0,
            'text-align': 'center',
            'line-height': '23px',
            'background-color': 'rgba(33, 34, 35, 0.7)',
        })
        .append($('<i class="icon-trash" style="color: #fff;"></i>'))
        .click(e => {
            deleteArticle(article._id);
            return false;
        });
}

function showArticle(id) {
    $.getJSON('/article/get/' + id, function (json) {
        editor.showArticle(json);
    });
}

function deleteArticle(id) {
    //@TODO 需要判断是否是当前正在编辑的文章
    if(confirm('确定删除此文章吗？')) {
        $.getJSON('/article/delete/' + id, function (json) {
            $('#article_'+id).remove();
        });
    }
}