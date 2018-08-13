import _ from 'lodash';
import ConfirmModal from '../common/ConfirmModal';
import copyHtml from '../common/CopyUtil';
import EditorCommandWrapper from '../../utils/EditorCommandWrapper';
import loginUtils from '../../utils/loginUtils';
import crypto from 'crypto';

function StyleTool(editable, options = {}) {
    let insertEmptySectionAndFocus = options.insertEmptySectionAndFocus || function () {};
    let setLastSection = options.setLastSection || function () {};
    let realSectionHtml = options.realSectionHtml || function ($section) {return $section.html()};
    let confirmModal = new ConfirmModal();

    let lastSection,
        bottomToolHeight,
        bottomToolWidth,
        countColorNumber;
    let wrapper = $('<div class="style-tool-warpper"></div>');
    let btnGroupLeft = $('<div class="style-tool-btngroup-left"></div>');
    let delBtn = $('<div class="style-operator-btn" ><i class=""></i>删除</div>');
    let copyBtn = $('<div id="style-copy-btn" class="style-operator-btn"> <i class=""></i>复制</div>');
    let collectBtn = $('<div id="style-copy-btn" class="style-operator-btn"> <i class="collectBtn"></i>收藏</div>');
    let formatBtn = $('<div id="style-format-btn" class="style-operator-btn"> <i class="format-btn"></i>去格式</div>');
    btnGroupLeft.append(delBtn);
    btnGroupLeft.append(copyBtn);
    btnGroupLeft.append(collectBtn);
    btnGroupLeft.append(formatBtn);
    wrapper.append(btnGroupLeft);

    let btnGroupRight = $('<div class="style-tool-btngroup-right"></div>');
    let upBtn = $('<div id="up-btn-editor" class="style-operator-btn" data-toggle="tooltip" data-placement="top"> <i class=""></i>上移</div>');
    let downBtn = $('<div id="down-btn-editor" class="style-operator-btn" data-toggle="tooltip" data-placement="top"> <i class=""></i>下移</div>');
    let addNewBlockBtnUp = $('<div id="addup-btn-editor" class="style-operator-btn" data-toggle="tooltip" data-placement="top"> <i class=""></i>前空行</div>');
    let addNewBlockBtn = $('<div id="add-btn-editor" class="style-operator-btn" data-toggle="tooltip" data-placement="top"> <i class=""></i>后空行</div>');
    let replaceImgBtn = $('<div id="style-replace-img-btn" class="style-operator-btn replace-img" data-toggle="tooltip" data-placement="top" title="换图片"> <i class="fa fa-photo"></i></div>');
    btnGroupRight.append(upBtn);
    btnGroupRight.append(downBtn);
    btnGroupRight.append(addNewBlockBtnUp);
    btnGroupRight.append(addNewBlockBtn);
    btnGroupRight.append(replaceImgBtn.hide());
    wrapper.append(btnGroupRight);

    let bottomTool = $('<div class="style-tool-bottom"></div>');
    let colorTool = $('<div class="color-tool"></div>');
    let pickerColor = $('<input type="text" id="pickerColor"/></span>');

    bottomTool.append(colorTool);
    bottomTool.append(pickerColor);
    wrapper.append(bottomTool);
    wrapper.insertBefore(editable);

    let commandWrapper = EditorCommandWrapper.wrapper;
    //删除块
    let removeSection = () => {
        if (lastSection) {
            lastSection.hide('fast',
                commandWrapper(function () {
                    lastSection.remove();
                    bottomToolHide();
                    wrapper.hide();

                    setLastSection(null);
                })
            );
        }
    };

    delBtn.click(removeSection);

    //去格式
    formatBtn.click(() => {
        if(lastSection) {
            lastSection.find("*").each(function () {
                $(this).removeAttr("style");
            });
        }
    });

    //上移块
    upBtn.click(() => {
        if (lastSection) {
            let prevDom = lastSection.prev();
            prevDom.css({"opacity": "0.5"}).animate({top: lastSection.outerHeight(true)});
            lastSection.css({"opacity": "0.5"}).animate({top: -prevDom.outerHeight(true)},
                commandWrapper(function () {
                    lastSection.insertBefore(prevDom).css({top: 0, "opacity": "1"});
                    prevDom.css({top: 0, "opacity": "1"});
                    setLastSection(lastSection, 1);
                })
            );
        }
    });

    //下移块
    downBtn.click(() => {
        if (lastSection) {
            let nextDom = lastSection.next();
            nextDom.css({"opacity": "0.5"}).animate({top: -lastSection.outerHeight(true)});
            lastSection.css({"opacity": "0.5"}).animate({top: nextDom.outerHeight(true)},
                commandWrapper(function () {
                    lastSection.insertAfter(nextDom).css({top: 0, "opacity": "1"});
                    nextDom.css({top: 0, "opacity": "1"});
                    setLastSection(lastSection, 1);
                })
            );
        }
    });

    //添加前空行块
    addNewBlockBtnUp.click(() => {
        addNewBlock(false);
    });

    //添加后空行块
    addNewBlockBtn.click(() => {
        addNewBlock(true);
    });

    let addNewBlock = (next = true) => {
        if (lastSection) {
            lastSection = lastSection.removeClass("winter-section-active");
            insertEmptySectionAndFocus(next, lastSection);
            setLastSection(null);
        }
    };

    //复制块
    copyBtn.click(() => {
        if (lastSection) {
            copyHtml('#style-copy-btn', realSectionHtml(lastSection.clone()).prop('outerHTML'));
            setLastSection(null);
        }
    });

    //收藏
    //@TODO 已经记录了md5，可以实现判断当前样式是否已经收藏。
    collectBtn.click(e => {
        if(!lastSection) return;
        if(!loginUtils.checkAlert())return;
        confirmModal.confirm('确认收藏样式吗？', () => {
            let html = $(realSectionHtml(lastSection)).children().html();
            let md5 = crypto.createHash('md5');
            md5.update(html);
            let hash = md5.digest('hex');
            let ds = lastSection.children().children('dynamic-section');
            let dynamic;
            if(ds && ds.length > 0) {
                dynamic = ds.attr('dynamic');
            }
            $.post('/api/collect/save', {html, dynamic}, json => {
                if(json.status) {
                    lastSection.attr('collect-hash', hash);
                    lastSection.attr('collect-id', json._id);
                    let mcs = $('#my-collect-style');
                    if(mcs.hasClass('active')) {
                        mcs.click();
                    }
                }
            });
        });
    });


    //判断是否有向上的移动图标
    function __hasUpBtnIcon__() {
        let prevDom = lastSection.prev();
        if (prevDom.length < 1) {
            upBtn.hide();
        } else {
            upBtn.show();
        }
    }

    //判断是否有向下的移动图标
    function __hasDownBtnIcon__() {
        let nextDom = lastSection.next();
        if (nextDom.length < 1) {
            downBtn.hide();
        } else {
            downBtn.show();
        }
    }

    //样式工具bar,定位
    function exec(section) {
        lastSection = section;
        if (lastSection) {
            wrapper.show();

            let offsetParent = lastSection.offsetParent();
            if (!offsetParent) return;

            let h = lastSection.position().top;
            while (!offsetParent.hasClass('note-editing-area')) {
                h += offsetParent.position().top;
                offsetParent = offsetParent.offsetParent();
            }

            __hasUpBtnIcon__();
            __hasDownBtnIcon__();
            bottomToolHeight = lastSection.outerHeight(true) + 3;// 3这里是自己定义的,加点小距离,避免尴尬
            wrapper.css('top', h + bottomToolHeight + 'px');
            return h;
        }
    }

    function hide() {
        wrapper.hide();
    }

    function bottomToolHide() {
        bottomTool.hide();
    }

    function bottomToolShow() {
        bottomTool.show();
    }

    /**
     * 获取样式的颜色数组, index是JQuery遍历DOM的自然顺序
     * @returns {Array} [[[bgcolor], [borderColorTop, borderColorRight, ...], [fontColor]],[], ...]
     */
    function getColorOfStyle() {
        let styleColors = [];
        lastSection.find("*").each(function () {
            let bgColor = this.style.backgroundColor && this.style.backgroundColor.indexOf("rgb") >= 0 ? this.style.backgroundColor : -1;
            let borderColor = this.style.borderColor && this.style.borderColor.indexOf("rgb") >= 0 ? this.style.borderColor : -1;
            let borderColors = [borderColor, borderColor, borderColor, borderColor];
            this.style.borderTopColor && this.style.borderTopColor.indexOf("rgb") >= 0 && (borderColors[0] = this.style.borderTopColor);
            this.style.borderRightColor && this.style.borderRightColor.indexOf("rgb") >= 0 && (borderColors[1] = this.style.borderRightColor);
            this.style.borderBottomColor && this.style.borderBottomColor.indexOf("rgb") >= 0 && (borderColors[2] = this.style.borderBottomColor);
            this.style.borderLeftColor && this.style.borderLeftColor.indexOf("rgb") >= 0 && (borderColors[3] = this.style.borderLeftColor);

            let fontColor = this.style.color && this.style.color.indexOf("rgb") >= 0 ? this.style.color: -1;
            styleColors.push([[bgColor], borderColors, [fontColor]]);
        });

        return styleColors;

    }

    function buildChangeColorToolBar(bgColors, borderColors, fontColors) {
        let bgColorsDistinct = Array.from(new Set(bgColors.reduce((v1, v2) => v1.concat(v2), [])));
        let borderColorsDistinct = Array.from(new Set(borderColors.reduce((v1, v2) => v1.concat(v2), [])));
        let fontColorsDistinct = Array.from(new Set(fontColors.reduce((v1, v2) => v1.concat(v2), [])));

        let colorTool = bottomTool.find(".color-tool");
        colorTool.html("");
        let mainColor = $('<div class="primary-color">主题色</div>');
        colorTool.append(mainColor);

        bgColorsDistinct.filter(it => it != -1).forEach((color, index) => {
            colorTool.append('<span class="change-color" style="background-color: ' + color  +'; "  data-original-title="背景 - ' + (index + 1) + '" data-toggle="tooltip" data-placement="bottom"></span>')
        });

        borderColorsDistinct.filter(it => it != -1).forEach((color, index) => {
            colorTool.append('<span class="change-color" style="background-color: ' + color  +'; "  data-original-title="边框 - ' + (index + 1) + '" data-toggle="tooltip" data-placement="bottom"></span>')
        });

        fontColorsDistinct.filter(it => it != -1).forEach((color, index) => {
            colorTool.append('<span class="change-color" type="change-font-color" style="background-color: ' + color  +'; "  data-original-title="字体 - ' + (index + 1) + '" data-toggle="tooltip" data-placement="bottom"></span>')
        });

        bottomToolWidth = $(".style-tool-bottom").outerWidth();

        bottomTool.find('[data-toggle="tooltip"]').tooltip({
            container: "body"
        });

        countColorNumber = bgColorsDistinct.filter(it => it != -1).length+borderColorsDistinct.filter(it => it != -1).length+fontColorsDistinct.filter(it => it != -1).length
        if(countColorNumber>0){
            bottomToolShow();
        }else{
            bottomToolHide();
        }
    }



    function buildColorTool() {
        let styleColors = getColorOfStyle();
        let bgColors = styleColors.map(it => it[0]);
        let borderColors = styleColors.map(it => it[1]);
        let fontColors = styleColors.map(it => it[2]);

        buildChangeColorToolBar(bgColors, borderColors, fontColors);

        $(".color-tool span").click(function (e) {
            e.stopPropagation();
            let $that = $(this);
            let lastColor = $that.css("background-color").replace(/0.5/,"1");
            $(this).siblings().css('border','');
            $(this).css('border','1px solid #fff');
            $("#pickerColor").spectrum({
                showInput: true,
               // appendTo: '.style-tool-bottom',
                appendTo: 'body',
                color:lastColor,
                containerClassName: "spectrum-change-color",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                hideAfterPaletteSelect: true,
                maxPaletteSize: 7,
                preferredFormat: "hex",
                chooseText: "确定",
                cancelText: "取消",
                localStorageKey: "spectrum.demo",
                move: function (color) {
                    __setPosition__();
                },
                show: function () {
                    __setPosition__();
                    $(".used-color").append($(".sp-palette-row-selection").clone(true));
                    let $clearSpan = $(`<span title="清除颜色" data-color="#ffffff" class="sp-thumb-el sp-thumb-light"><span class="sp-thumb-inner" style="#ffffff"></span></span>`);
                    $(".used-color").find(".sp-palette-row-selection").prepend($clearSpan);
                },
                beforeShow: function () {
                    $(".sp-replacer").hide();
                    $(".sp-palette-container").show();
                    $(".sp-picker-container").hide();
                },
                hide: function (color) {
                    $('body').find(".tooltip").tooltip('hide');
                    let newColor = color.toString();
                    __getColor__(newColor);
                },
                palette: [
                    ["rgba(255,255,255,0)", "#ffd7d5", "#ffdaa9", "#fffed5", "#d4fa00", "#73fcd6", "#a5c8ff", "#ffacd5", "#ff7faa"],
                    ["#d6d6d6", "#ffacaa", "#ffb995", "#fffb00", "#73fa79", "#00fcff", "#78acfe", "#d84fa9", "#ff4f79"],
                    ["#b2b2b2", "#d7aba9", "#ff6827", "#ffda51", "#00d100", "#00d5ff", "#0080ff", "#ac39ff", "#ff2941"],
                    ["#888888", "#7a4442", "#ff4c00", "#ffa900", "#3da742", "#3daad6", "#0052ff", "#7a4fd6", "#d92142"],
                    ["#000000", "#7b0c00", "#ff4c41", "#d6a841", "#407600", "#007aaa", "#021eaa", "#797baa", "#ab1942"],
                    ["#ffffff", "#c00000", "#ff0000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#7030a0"]
                ]
            });
            setTimeout(function () {
                $(".sp-replacer").trigger("click");
            }, 10);
            $(".more-color").click(function(){
                $(".sp-palette-container").hide();
                $(".sp-picker-container").show();
                $(this).addClass("active").siblings().removeClass("active");
            });
            $(".base-color").click(function(){
                $(".sp-palette-container").show();
                $(".sp-picker-container").hide();
                $(this).addClass("active").siblings().removeClass("active");
            });
            $(".used-color").click(function(e){
                let newColor = $(e.target).closest(".sp-thumb-el").data("color");
                if(newColor == 'transparent'){
                    newColor = 'rgba(255, 255, 255, 0)';
                }
                e.stopPropagation();
                __getColor__(newColor);

            });
            function __setPosition__(){
                //positionX 计算规则，不管屏幕大小是多少，弹窗就贴着编辑器内容区域左侧的边。
                let bodyW = $('body').width();
                let editorContentW = $(".note-editable").width();
                let colorDialogW = $(".spectrum-change-color").width();
                let positionX = bodyW-( bodyW-$(".editor-main").width() )/2 - ($(".editor").outerWidth() - editorContentW)/2 - editorContentW - colorDialogW - 5;
                let positionY = $(e)[0].clientY - $(".spectrum-change-color").height() + 25;
                $(".spectrum-change-color").css({top: positionY,left: positionX});
            }
            function __getColor__(newColor) {
                let oldColor = $that.css("background-color");
                let type = "color";
                $that.attr("type")=="change-font-color" && (type = "fontColor");
                changeColor(oldColor, newColor, type);
                $that.css("background-color", newColor);
                $("#pickerColor").spectrum("destroy");
                $("#pickerColor").hide();
            }
        });

        let enterHoverColor;

        $(".color-tool span").hover(function () {
            let $that = $(this);
            let oldColor = $that.css("background-color");
            enterHoverColor = oldColor;
            //颜色变淡 0.5  rgb-> rgba
            let newColor = "rgba(" + oldColor.split("(")[1].split(")")[0] + ",0.5" + ")";
            commonHover($that, oldColor, newColor);
        }, function () {
            let $that = $(this);
            let oldColor = $that.css("background-color");
            commonHover($that, oldColor, enterHoverColor);
        });

        function commonHover($that, oldColor, newColor) {
            let commonType = "color";
            $that.attr("type")=="change-font-color" && (commonType = "fontColor");
            changeColor(oldColor, newColor, commonType);
            $that.css("background-color", newColor);
        }
        $(".note-editable").click(function() {
            $("#pickerColor").spectrum("destroy");
            $(".spectrum-change-color").remove();
        });


    }

    /*
     * changeColor function
     * oldColor 被替换的color
     * newColor 替换后的color
     * "color" === type 修改边框或背景颜色
     * "fontColor" === type 修改字体颜色
     */
    function changeColor(oldColor, newColor, type) {
        "color" === type && lastSection && lastSection.find("*").each(function (index, value) {
            this.style.backgroundColor === oldColor && (this.style.backgroundColor = newColor);
            this.style.borderColor === oldColor && (this.style.borderColor = newColor);
            this.style.borderTopColor === oldColor && (this.style.borderTopColor = newColor);
            this.style.borderLeftColor === oldColor && (this.style.borderLeftColor = newColor);
            this.style.borderRightColor === oldColor && (this.style.borderRightColor = newColor);
            this.style.borderBottomColor === oldColor && (this.style.borderBottomColor = newColor);
        });

        "fontColor" === type && lastSection && lastSection.find("*").each(function (index, value) {
            this.style.color === oldColor && (this.style.color = newColor)
        });
    }

    return {
        exec,
        hide,
        removeSection,
        bottomToolHide,
        buildColorTool
    }
}

export default StyleTool;
