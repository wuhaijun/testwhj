import _ from 'lodash';

let body;
let sidebar;

function __section__(i) {
    let section = $(i.html);
    _.each(section.find('*').contents(), c => {
        if(c.nodeType && c.nodeType === 3 && _.trim(c.textContent).length == 0) {
            c.remove();
        }
    });
    return section;
}

function __showStyles__(module, styles) {
    let toString = Object.prototype.toString;
    if (!styles || toString.call(styles) !== '[object Array]') return;

    body.html('');
    let htmlUl = $('<ul class="winter-style-content"></ul>').appendTo(body);
    styles.forEach(style => {
        let sli = $(`<li rel="${style._id}"></li>`).appendTo(htmlUl);
        sli.append(__section__(style));
        sli.click(function (e) {
            e.preventDefault();
            let $t = $(this);
            module.editorContext.editor.insertSection($t.children().clone(), $t.data('attributes'));
        });
    });
}

function __typeOnClick__(type, module) {
    return e => {
        e.stopPropagation();
        $.getJSON('/api/styles/' + type._id, json => {
            if (json.status) __showStyles__(module, json.result);
        });
    };
}

function __typeOnHover__($this) {
    let showTimeout;
    $this.hover(function () {
        showTimeout = setTimeout(function () {
            $this.addClass('showSub');
        }, 300);
    }, function () {
        $this.removeClass('showSub');
        clearTimeout(showTimeout);
    });
}

export default {
    id: 'editor-style-module',
    sidebarWidth: 70,
    width: 300,
    title: '模板 - 样式',
    buttonColor: '#71d4bb',
    defaultClose: false,
    leftCanClose: false,

    init: function (module) {

        body = module.body;
        sidebar = module.sidebar;

        let ul = $('<ul class="winter-style-sidebar"></ul>').appendTo(sidebar);
        $.getJSON('/api/types', json => {
            if (json.status) {
                let types = json.result;
                types = [{ _id: 'all', name: '全部' }, ...types];
                types.forEach(type => {
                    let li_1 = $(`<li><a>${type.name}</a></li>`).appendTo(ul);

                    li_1.click(__typeOnClick__(type, module));
                    __typeOnHover__(li_1);

                    if (type.children && type.children.length != 0) {
                        let subUrl = $('<ul class="winter-style-sub"></ul>').appendTo(li_1);

                        type.children.forEach(child => {
                            let li_2 = $(`<li><a>${child.name}</a></li>`).appendTo(subUrl);
                            li_2.click(__typeOnClick__(child, module));
                        });
                    }
                });
                ul.children('li').eq(0).click();
            }
        });
    }
    
}