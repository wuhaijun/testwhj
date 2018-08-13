import InsertNode from './InsertNode';
import TitleEditor from './TitleEditor';
import CoverEditor from './CoverEditor';
import ArticleData from './ArticleData';
import StyleTool from './StyleTool';
import dom from '../../utils/dom';

import {send, EVENTS} from '../../utils/EventCenter';

export default function (id) {

    let body;
    let header;

    let wrapper;
    let titleEditor;
    let sourceInput;
    let coverEditor;

    let editorDom;
    let editable;
    let context;

    let lastSection;

    let styleTool;

    let articleData;

    function buildSummerEditor(dom) {
        return dom.summernote({
            toolbar: [
                ['color', ['color', 'video']],
                ['font', ['bold', 'underline', 'clear']]
            ],
            airMode: true,
            placeholder: '从这里开始写正文',
            callbacks: {onEnter, onFocus, onBlur, onChange}
        });
    }

    function onEnter() {
    }

    function onFocus() {
        if (dom.isEmpty(editable[0]) || dom.emptyPara === editable.html()) {
            let section = $('<section class="winter-section" style="margin-bottom: 5px;"><p><br/></p></section>');
            $('.note-editable').html(section);

            section.click(function () {
                setLastSection($(this));
            });
            setLastSection(section);
        }

        $(".winter-section").click(function () {
            setLastSection($(this));
        });
        $(".winter-section").trigger("click");
    }

    function onBlur() {
    }

    function onChange() {
    }

    //判断是否有向上的移动图标
    function hasUpBtnIcon(section) {
        let prevDom = section.prev();
        if (prevDom.length < 1) {
            $("#up-btn-editor").hide();
        } else {
            $("#up-btn-editor").show();
        }
    }

    //判断是否有向下的移动图标
    function hasDownBtnIcon(section) {
        let nextDom = section.next();
        if (nextDom.length < 1) {
            $("#down-btn-editor").hide();
        } else {
            $("#down-btn-editor").show();
        }
    }

    //@TODO 仅仅增加一个class效果并不好，最好还是外套div，先这样。
    function setLastSection(section) {
        if (lastSection) {
            lastSection.removeClass('winter-section-active');
        }
        lastSection = section;
        if (lastSection) {
            styleTool.exec(section);
            lastSection.addClass('winter-section-active');

            hasUpBtnIcon(lastSection);
            hasDownBtnIcon(lastSection);

        } else {
            styleTool.hide();
        }
    }


    function insertSection($node, attributes) {
        let section = InsertNode(editorDom, editable, lastSection, $node);
        editorDom.trigger('summernote.change');
        section.click(function (e) {
            setLastSection(section);
        });
        setLastSection(section);
    }


    function initHeaderButtons() {
        let saveBtn = $('<button class="btn btn-success">保存</button>');
        let isSaving = false;
        saveBtn.click(function () {
            if (isSaving) {
                return;
            }
            isSaving = true;
            saveBtn.removeClass('btn-success');
            saveBtn.addClass('btn-default');
            saveBtn.attr('disabled', true);
            saveBtn.text('保存中...');
            articleData.save(function (json) {
                saveBtn.text('已成功保存');
                setTimeout(() => {
                    isSaving = false;
                    json && send(EVENTS.ARTICLE_SAVE, json);
                    saveBtn.addClass('btn-success');
                    saveBtn.removeClass('btn-default');
                    saveBtn.removeAttr('disabled');
                    saveBtn.text('保存');
                }, 3000);
            });
        });

        let newBtn = $('<button class="btn btn-info" style="margin-left: 7px;">新建/清空</button>');
        newBtn.click(function () {
            articleData.createNew();
            setLastSection(null);
        });

        let btnWrapper = $('<div></div>');
        btnWrapper.append(saveBtn).append(newBtn);
        header.html(btnWrapper);
    }

    return {
        id: id || 'winter-editor',
        width: 440,
        title: '编辑器',
        buttonColor: '#50caf6',
        leftCanClose: true,

        init: function (module) {
            body = module.body;
            header = module.header;

            wrapper = $('<div></div>');


            wrapper.css({
                position: 'absolute',
                top: '5px',
                bottom: '5px',
                left: '5px',
                right: '5px',
                padding: '5px',
                overflow: 'scroll'
            });

            let editorHeight = '400px';
            let editorWrapper = $('<div></div>').css({
                overflow: 'scroll',
                width: '90%',
                'margin-left': '5%',
                'min-height': editorHeight,
                'padding': '20px 5px',
                'margin-bottom': '20px',
                'border-top': '1px solid rgb(164, 164, 164)'
            });

            editorDom = $('<div class="winder-editor-textarea" style="width: 100%;height: 100%;"></div>');

            titleEditor = TitleEditor();
            wrapper.append(titleEditor.dom);
            wrapper.append(editorWrapper.append(editorDom));

            sourceInput = $('<input type="text" placeholder="请输入原文链接"/>').css({
                'border': '0 none', width: '80%'
            });
            wrapper.append(
                $('<div class="form-group"><label class="col-sm-2 control-label">原文链接</label></div>')
                    .css({'padding-left': '20px'})
                    .append(sourceInput)
            );

            coverEditor = CoverEditor(module);
            wrapper.append(coverEditor.dom);

            body.append(wrapper);

            buildSummerEditor(editorDom);

            context = editorDom.data('summernote');
            editable = context.layoutInfo.editable;

            styleTool = StyleTool(editable, {
                setLastSection
            });

            editable.keyup(function (e) {

                if (!lastSection || lastSection.html() === dom.emptyPara || lastSection.html() === '<p></p>') {
                    styleTool.removeSection();

                }
                if (editable.text().length > 0 && $(".note-editable:not(:has(section))").length === 1) {
                    let section = $('<section class="winter-section" style="margin-bottom: 5px;"><p><br/></p></section>');
                    $('.note-editable').html(section);
                    section.click(function () {
                        setLastSection($(this));
                    });
                    setLastSection(section);
                }

            });

            //设置air模式的editor高度
            editable.css('min-height', editorHeight)
                .parent().css('min-height', editorHeight)
                .parent().css('min-height', editorHeight);

            module.editorDom = editorDom;
            module.editorContext = context;
            module.editable = editable;

            // editable.mouseleave(function () {
            //     lastRange = context.invoke('editor.createRange');
            // });

            articleData = ArticleData({titleEditor, sourceInput, coverEditor, context});

            module.articleData = articleData;

            initHeaderButtons();

            //methods
            module.insertSection = insertSection;
            module.showArticle = articleData.showArticle;
            module.createNew = articleData.createNew;

        }

    }
}