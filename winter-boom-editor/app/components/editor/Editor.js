'use strict';
import Component from './../Component';
import StyleTool from './StyleTool';
import ImageToolbar from './ImageToolbar';
import range from '../../utils/range';
import dom from '../../utils/dom';
import copyHtml from '../common/CopyUtil';
import DynamicStyleUtils from '../../utils/DynamicStyleUtils';
import EditorCommandWrapper from '../../utils/EditorCommandWrapper';
import _ from 'lodash';
import FilterWord from '../common/FilterWord';


export default class extends Component {
    constructor(props) {
        super(props);

        this.context = {};
        this.editable = {};
        this.lastSection = '';
        this.lastCode = '';
        this.styleTool = {};
        this.imageToolbar = {};
        this.filterWord = FilterWord();
        this.selectionText = "";
        this.rendered();
    }

    insert = EditorCommandWrapper.wrapper($node => {
        let section = this.__insertSection__($node);
        this.autoScroll(section);
    });

    autoScroll = (section, during) => {
        let $editor = this.colEditor;
        let topPositon = this.styleTool.exec(section);
        this.styleTool.hide();
        $editor.animate({scrollTop: topPositon}, during || 200);
    };

    copy = target => {
        copyHtml(target, this.realHtml());
    };

    clear = () => {
        this.__setLastSection__(null);
        this.content('');
    };

    isEmpty = () => {
        return dom.isEmpty(this.editable[0]) || dom.emptyPara === this.editable.html() || dom.emptyParaEditor === this.editable.html();
    };

    content = val => {
        if (val == undefined) {
            return this.isEmpty() ? '' : this.realHtml();
        } else {
            this.editable.html(val);
            this.context.invoke('editor.historyReset');
            this.context.triggerEvent('change');

            // 重新绑定code编辑区域的事件
            let $code = this.editable.find('.winter-section-code');
            this.context.invoke('editor.__codeHandler__', $code);
            this.context.invoke('editor.__codeRender__', $code);
        }
    };

    insertEmptySectionAndFocus = (next = true, $target) => {
        let $spaceHtml = $(`<p style="font-size: 14px;"></p>`);
        let $br = $(`<br/>`).appendTo($spaceHtml);
        next ? $spaceHtml.insertAfter($target) : $spaceHtml.insertBefore($target);

        let r = range.create($br[0], 0, $br[0], 0);
        r.select();
        this.editable.focus();
    };

    findAllTextNodes(node, textNodes) {
        if (node.nodeType == 3) {
            if (!/^\s*$/.test(node.data)) {
                textNodes.push(node);
            }
        } else if (node.hasChildNodes()) {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                this.findAllTextNodes(node.childNodes[i], textNodes);
            }
        }
    }

    __insertSection__ = $node => {
        let $section = this.context.invoke('editor.__createSection__', $node);
        let node = $section[0];

        if (this.selectionText) {

            let $replaceable = $section.find('.winter-editor-replaceable');
            if ($replaceable.length != 0) {
                $replaceable.text(this.selectionText);
            } else {
                let textNodes = [];
                this.findAllTextNodes(node, textNodes);
                if (textNodes.length != 0) {
                    let longestTextNode = textNodes.reduce(function (p, v) {
                        return (p.data.length > v.data.length ? p : v);
                    });
                    longestTextNode.data = this.selectionText;
                }
            }
            this.selectionText = "";
        }

        this.context.invoke('editor.restoreRange');
        this.context.invoke('editor.insertNode', node);
        this.__insertBlock__($section);

        return $section;
    };

    __insertBlock__($section) {
        let $br = $section.next();
        let html = $br.prop('outerHTML');
        if (html == dom.emptyParaEditor) {
            let r = range.create($br[0], 0, $br[0], 0);
            r.select();
            this.editable.focus();
        } else {
            if (html == dom.blank) {
                $br.remove();
            }
            this.insertEmptySectionAndFocus(true, $section);
        }
    }

    __buildSummerEditor__ = $dom => {
        let __onFocus__ = this.__onFocus__;
        let __onBlur__ = this.__onBlur__;
        let __onChange__ = this.__onChange__;

        return $dom.summernote({
            toolbar: [
                ['color', ['color', 'video']],
                ['font', ['bold', 'underline', 'clear']]
            ],
            airMode: true,
            placeholder: "从这里开始写正文",
            callbacks: {
                onFocus: __onFocus__,
                onBlur: __onBlur__,
                onChange: __onChange__,
                onKeyup: this.__onKeyUp__
            }
        });
    };

    __onKeyUp__ = (e) => {
    };

    __onChange__ = () => {
        this.showCountMoudle();
        this.__showPlaceholder__();
    };

    __onFocus__ = () => {
        this.parent.richEditor.hideMask();

    };
    __onBlur__ = () => {
        this.selectionText = window.getSelection().toString();
        this.context.invoke('editor.saveRange');
        if (!this.imageToolbar.isShowed()) {
            this.parent.saveTemp();
        }
    };

    __calculateSlideWidth__ = ($slide) => {
        let $slideWidthAll = $slide.find('.slide-width-all');
        let len = $slideWidthAll.find('.slide-width img').length;
        if($slideWidthAll[0]){
            $slideWidthAll[0].style.width = len * 100 + '%';
            $slideWidthAll.children('.slide-width').width( 100/len + '%');
        }

    };
    __showPlaceholder__ = () => {
        let textCount = this.editable.text().length;
        let imageCount = this.editable.find("img").length;
        let placeHolder = this.editable.siblings(".note-placeholder");
        if(textCount>0 || imageCount>0) {
            placeHolder.hide();
        } else {
            placeHolder.show();
        }
    };

    __setLastCode__ = ($code) => {
        if (this.lastCode) {
            if ($code && $code[0] == this.lastCode[0]) return;

            this.lastCode.removeClass('active');
            this.lastCode.trigger('editor.code.render');
        }
        this.lastCode = $code;
        if (this.lastCode) {
            this.lastCode.addClass('active');
        }
    };

    //@TODO 仅仅增加一个class效果并不好，最好还是外套div，先这样。
    // 是通过num参数解决一个bug,上移和下移的样式问题,setLastSection(lastSection,1);
    __setLastSection__ = (section, num) => {
        if (section && num != 1) {
            if (section[0] == (this.lastSection && this.lastSection[0])) {
                return;
            }
        }

        if (this.lastSection) {
            this.lastSection.removeClass('winter-section-active');

            // 注销滑动图片绑定的事件
            let $slide = this.lastSection.find('.winter-section-slide');
            if ($slide) {
                $slide.unbind('DOMNodeRemoved');
            }
        }

        this.lastSection = section;
        this.styleTool.exec(section);
        if (this.lastSection) {
            this.lastSection.addClass('winter-section-active');

            // 处理滑动图片样式
            let $slide = this.lastSection.find('.winter-section-slide');
            if ($slide) {
                this.__calculateSlideWidth__($slide);
                $slide.bind('DOMNodeRemoved', (e) => {
                    $(e.target).parents('.slide-width').remove();
                    this.__calculateSlideWidth__($slide);
                });
            }

        } else {
            this.styleTool.hide();
        }

        window.main.content.changeImageCallback = (item, host) => {
            let insertImageLink = host + item.key;
            this.context.invoke('editor.restoreRange');
            this.context.invoke('editor.insertImage', insertImageLink);
        };
    };

    // 获取文章 字数 图片个数,预计阅读时间
    getReadTime = () => {
        let defaultText = 400;  // 默认一分钟可以阅读的文字
        let defaultImage = 10;  // 默认一分钟可以阅读的图片
        let textCount = this.editable.text().replace(/\s+/g, "").length;
        let imageCount = this.editable.find("img").length;
        let readTime;
        if (textCount < defaultText && imageCount < defaultImage && textCount != 0 && imageCount != 0) {
            readTime = 1;
        } else if (textCount < defaultText && imageCount > defaultImage) {
            readTime = Math.ceil(imageCount / defaultImage);
        } else if (textCount > defaultText && imageCount < defaultImage) {
            readTime = Math.ceil(textCount / defaultText);
        } else if (textCount == 0 && imageCount == 0) {
            readTime = 0;
        } else {
            readTime = Math.ceil(textCount / defaultText) + Math.ceil(imageCount / defaultImage);
        }
        return {
            textCount: textCount,
            imageCount: imageCount,
            readTime: readTime
        }
    };


    // 修改页面的 字数 图片数  阅读时间
    showCountMoudle = () => {
        let showCountObject = this.getReadTime();
        this.parent.operator.changeReadTime(showCountObject.textCount, showCountObject.imageCount, showCountObject.readTime);
    };


    /*
     *   返回文章可用的html代码
     *   所有用于获取html代码都应该调用此处代码
     *
     *   目的:
     *   动态样式的编辑状态与section的active状态及其他状态，并非是保存与同步最终需要的代码。
     *   故此，需要统一进行格式的reset，去掉不必要的代码内容。
     *
     *   优化可能：
     *   如果未来有更多的操作事件会影响editable部分的代码无法直接使用，
     *   可以考虑事件注册方式进行操作, 当修改editable部分代码时，应及时注册reset函数。
     *   当进行获取代码时，自动调用全部的reset方法。
     *
     *   目前主题换色的功能，在hover状态时会调整透明度，如果有了快捷键保存文章后，可能有隐患。
     */
    realHtml = () => {
        let $content = this.editable.clone();

        let realSectionHtml = this.realSectionHtml;
        $content.find('.winter-section-p').each(function () {
            realSectionHtml($(this));
        });
        //过滤<p></P>空标签，避免同步到微信会有大量空行
        $content.find("p").each(function() {
            if($(this).children().length == 0 && $(this).text() == 0 && !$(this).attr("style")){
                $(this).remove();
            }
        });
        return $content.html();
    };

    realSectionHtml = ($section) => {
        if ($section.children('.winter-section-inner').hasClass('winter-section-dynamic')) {
            let dh = $section.data('html');
            if (dh) {
                $section.html(dh);
            }
        }
        if ($section.hasClass('winter-section-active')) {
            $section.attr('class', 'winter-section-p');
        }

        return $section;
    };

    __filterWord__ = html => {
        return this.filterWord.isWordDocument(html) ? this.filterWord.filterPasteWord(html) : html;
    };

    rendered = () => {
        let $editorDom = $(`<div id="editor-dom" style="width: 100%;height: 100%;"></div>`);
        this.append($editorDom);

        this.__buildSummerEditor__($editorDom);

        this.context = $editorDom.data('summernote');
        this.editable = this.context.layoutInfo.editable;
        this.styleTool = StyleTool(this.editable, {
            realSectionHtml: this.realSectionHtml,
            setLastSection: this.__setLastSection__,
            insertEmptySectionAndFocus: this.insertEmptySectionAndFocus
        });

        this.imageToolbar = ImageToolbar(this.editable,this.context, this.parent.main.menus);

        DynamicStyleUtils.editorInit(this.editable);

        EditorCommandWrapper.init(this.context);

        this.editable.realHtml = this.realHtml;

        let __setLastSection__ = this.__setLastSection__;
        let __setLastCode__ = this.__setLastCode__;
        let styleTool = this.styleTool;

        this.editable.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let $section = null;
            let $code = null;
            let $target = $(e.target);
            $target.parents().each(function () {
                if ($(this).hasClass('winter-section-p')) {
                    $section = $(this);
                    return false;
                }

                if ($(this).hasClass('winter-section-code')) {
                    $code = $(this);
                    return false;
                }
            });
            __setLastSection__($section);
            __setLastCode__($code);
            if ($section) styleTool.buildColorTool();
        });


        $(() => {
            this.colEditor = $('div.editor');
            this.colEditor.on('scroll', () => {
                styleTool.bottomToolHide();
                this.imageToolbar.hideTool();
            });
        });

        let ctx = this;

        function copyAll(event) {
            return function (e) {
                let isAll = false;
                if (e.target === this) {//firefox
                    isAll = true;
                }

                /*
                 chrome 简化判定范围，chrome的全选判定有点儿诡异，
                 目前只要是选定的范围在第一个section与最后一个section，
                 就算作全选操作。
                 */
                if (!isAll) {
                    let points = range.create().getPoints();
                    let sc = points.sc, ec = points.ec;
                    let ss = $(sc).closest('section.winter-section-p');
                    let es = $(ec).closest('section.winter-section-p');
                    let pl = ctx.editable.find('section.winter-section-p');
                    isAll = pl.first()[0] == ss[0] && pl.last()[0] == es[0];
                }
                if (isAll) {
                    $("#copy-all").click();
                    if (event == 'cut') {
                        ctx.clear();
                    }
                }
                return true;
            }
        }

        this.editable.bind('cut', copyAll('cut'));
        this.editable.bind('copy', copyAll('copy'));
        //@TODO 粘贴是个优化的重点
        this.editable.bind('paste', e => {
            e.preventDefault();

            let items = (e.originalEvent || e).clipboardData.items;
            let context = this.context;

            let html = (e.originalEvent || e).clipboardData.getData('text/html');
            let text = (e.originalEvent || e).clipboardData.getData('text/plain');
            html = this.__filterWord__(html);

            if (html) {
                html = html.replace(/<meta.*?>/, "").replace(`<br class="Apple-interchange-newline">`, "");
                let $html = $(html);
                $html.each(function () {
                    let $this = $(this);
                    if ($this.length == 1) {
                        $this.removeAttr("style");
                    }
                });
                let temp = $('<div></div>');
                temp.append($html);
                html = temp.html();
                let node = $('<section></section>').html(html)[0];
                this.context.invoke('editor.insertNode', node);
                this.__insertBlock__($(node));
            } else {
                this.context.invoke('editor.insertText', text);
            }
            this.editable.children().each(function () {
                $(this).removeClass("winter-section-active");
            });

        });

        //设置air模式的editor高度
        let editorHeight = '400px';
        this.editable.css('min-height', editorHeight)
            .parent().css('min-height', editorHeight)
            .parent().css('min-height', editorHeight);





    };

    render() {
        return $(`
            <div class="col-editor-wrapper"></div>`
        );
    }
}
