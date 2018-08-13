'use strict';

const fnInit = require('./dynamic');
const EditorCommandWrapper = require('./EditorCommandWrapper');

const FN_MAP = {};

fnInit(FN_MAP);

const DEBUG_MAP = {
    '5a4ee66d5e3fa2887073e151': 'img-layer-hidden-2',
    '5a4dd6f25e3fa2887073e150': 'img-layer-hidden-2',
    '5a4d944f5e3fa2887073e14e': 'img-layer-hidden-2',
    '5a4d937a5e3fa2887073e14d': 'img-layer-hidden-2',
    '59b69d62efbc92f434a65551': 'img-layer-hidden-2',
    '59ae035a7e223293f21409d5': 'img-layer-hidden-2',
    '5a4062b55e3fa2887073e13c': 'img-layer-hidden-3',
    '5a8112db0acb8a22b443f91a': 'img-layer-hidden-4',
};

function debug(_id) {
    return DEBUG_MAP[_id];
}

function selectInit($section, $htmlClone, dynamic, insertFn) {
    if(!FN_MAP[dynamic]) {
        console.log('not found dynamic func:', dynamic);
        return;
    }

    //$section.addClass('dynamic-section');
    $section.addClass('dynamic-section').attr('dynamic', dynamic);

    let $li = $section.parent();
    let origin = $section.clone();
    let insertBtn = $('<a class="dynamic-style-btn-insert">插入样式</a>');
    insertBtn.click(insertFn);
    let clicked = false;
    $li.append(insertBtn).click(e => {
        clicked = true;
    });
    $li.hover(e => {
        insertBtn.show();
    }, e => {
        if(clicked) {
            clicked = false;
            $section.animate({opacity: 0.5, during: 300}, ()=>{
                $section.html(origin.html());
                $section.css({opacity: 1});
            });
        }
        insertBtn.hide();
    });
}

let $currentSection;
let toolbar = $(`<div id="dynamic-toolbar" class="dynamic-toolbar">
    <!--<a class="dynamic-toolbar-close">x</a>-->
    <a class="dynamic-toolbar-replay">重播</a>
    <a class="dynamic-toolbar-edit">编辑</a>
    <a class="dynamic-toolbar-save">保存</a>
    <a class="dynamic-toolbar-cancel">取消</a>
</div>`);

let closeBtn = toolbar.find('.dynamic-toolbar-close');
let replayBtn = toolbar.find('.dynamic-toolbar-replay');
let editBtn = toolbar.find('.dynamic-toolbar-edit');
let saveBtn = toolbar.find('.dynamic-toolbar-save');
let cancelBtn = toolbar.find('.dynamic-toolbar-cancel');

function playState() {
    // closeBtn.show();
    replayBtn.show();
    editBtn.show();
    saveBtn.hide();
    cancelBtn.hide();
    $currentSection && $currentSection.children().removeClass('winter-section-dynamic-edit');
}

function editState() {
    // closeBtn.hide();
    replayBtn.hide();
    editBtn.hide();
    saveBtn.show();
    cancelBtn.show();
    $currentSection && $currentSection.children().addClass('winter-section-dynamic-edit');
}

closeBtn.click(function () {
    toolbar.hide();
});

replayBtn.click(function () {
    if(!$currentSection)return;
    $currentSection.html($currentSection.data('html'));
});

editBtn.click(function () {
    if(!$currentSection)return;
    let fnMap = FN_MAP[$currentSection.data('dynamic')];
    if(!fnMap || !fnMap.edit)return;
    try {
        $currentSection.children().html(fnMap.edit($($currentSection.data('html')).children()));
        editState();
    }catch (e) {
        console.error(e);
    }
});

let save = EditorCommandWrapper.wrapper(function($t) {
    $currentSection.children().html($t);
    $currentSection.data('html', $currentSection.html());
});

saveBtn.click(function () {
    if(!$currentSection)return;
    let fnMap = FN_MAP[$currentSection.data('dynamic')];
    if(!fnMap || !fnMap.edit)return;
    try {
        playState();
        save(fnMap.build($currentSection.children().children().clone()));
    }catch (e) {
        $currentSection.html($currentSection.data('html'));
        console.error(e);
    }
});

cancelBtn.click(function () {
    if(!$currentSection)return;
    $currentSection.html($currentSection.data('html'));
    playState();
});

function move(editable, $section) {
    let h = 0;
    let sections = editable.find('section.winter-section-p');
    for (let i = 0; i < $section.index(); i++) {
        let s = sections.eq(i);
        h = h + (s.outerHeight(true));
    }

    toolbar.css('top', h + 'px');
}

function hideToolbar() {
    toolbar.hide();
}

function editorInit(editable) {
    toolbar.insertBefore(editable);

    editable.on('mouseover', '.winter-section-dynamic', function () {
        let $inner = $(this);
        let $section = $inner.parent();
        //根据data判断是否完成初始化
        if(!$section.data('html')) {
            $section.data('dynamic', $inner.children('.dynamic-section').attr('dynamic'));
            $section.data('html', $section.html());
        }

        $currentSection = $section;

        if($inner.hasClass('winter-section-dynamic-edit')) {
            editState();
        }else {
            playState();
        }

        move(editable, $section);
        toolbar.show();
    });

    editable.on('mouseleave', '.winter-section-dynamic', function (e) {
        let $inner = $(this);
        let relatedTarget = $(e.relatedTarget);
        if(relatedTarget.hasClass('dynamic-toolbar')
            || relatedTarget.parent().hasClass('dynamic-toolbar'))return;
        // if($inner.hasClass('winter-section-dynamic-edit')) return;
        toolbar.hide();
    });
}

module.exports = {
    selectInit,
    editorInit,
    hideToolbar,
    debug
};
