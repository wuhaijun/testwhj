'use strict';

export function bgColorPicker (id,defaultColor, className, type, editor) {

    let $this = this;
    $(id).spectrum({
        showInput: true,
        color:defaultColor,
        appendTo: className,
        containerClassName: "spectrum-fore-color",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        hideAfterPaletteSelect:false,
        maxSelectionSize: 7,
        preferredFormat: "hex",
        chooseText: "确定",
        cancelText: "取消",
        localStorageKey: "spectrum.demo",
        move: function (color) {
            $(".sp-palette .sp-palette-row-selection").hide();
            color = color.toString();
            changeColor(editor,color);
        },
        show: function () {
            let $clearSpan = $(`<span title="清除颜色" data-color="${defaultColor}" class="sp-thumb-el sp-thumb-light"><span class="sp-thumb-inner" style="${defaultColor};"></span></span>`);

            if( $(".used-color .sp-palette-row-selection").length == 0){
                $(".used-color").append($(".sp-palette-container .sp-palette-row-selection").clone());
                $(".used-color").find(".sp-palette-row-selection").prepend($clearSpan);
            }
            $(".sp-palette .sp-palette-row-selection").hide();
        },
        beforeShow: function () {
            $(".sp-replacer").hide();
            $(".sp-palette-container").show();
            $(".sp-picker-container").hide();
            $(".sp-input-container").hide();
            $(".sp-initial").hide();
            $(".sp-button-container").hide();
        },
        hide: function (color) {
            $("#bgPickerColor").click();
        },
        palette: [
            ["#ffffff", "#ffd7d5", "#ffdaa9", "#fffed5", "#d4fa00", "#73fcd6", "#a5c8ff", "#ffacd5", "#ff7faa"],
            ["#d6d6d6", "#ffacaa", "#ffb995", "#fffb00", "#73fa79", "#00fcff", "#78acfe", "#d84fa9", "#ff4f79"],
            ["#b2b2b2", "#d7aba9", "#ff6827", "#ffda51", "#00d100", "#00d5ff", "#0080ff", "#ac39ff", "#ff2941"],
            ["#888888", "#7a4442", "#ff4c00", "#ffa900", "#3da742", "#3daad6", "#0052ff", "#7a4fd6", "#d92142"],
            ["#666666", "#7b0c00", "#ff4c41", "#d6a841", "#407600", "#007aaa", "#021eaa", "#797baa", "#ab1942"],
            ["#000000", "#c00000", "#ff0000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#7030a0"]
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
        let usedColor = $(e.target).closest(".sp-thumb-el").data("color");
        if(usedColor == 'transparent'){
            usedColor = 'rgba(255, 255, 255, 0)';
        }
        e.stopPropagation();
        changeColor(editor,usedColor);
    });

    function changeColor(editor,color) {
        changeCss(editor,color,"bgColor");
    }

}

/**
 * 修改背景方法
 * @param editor context
 * @param color 背景颜色
 * @param type 颜色背景||图片背景
 * @param bgUrl 图片url
 * @param backgroundRepeat 图片的显示方式
 * @param backgroundSize
 */
export function changeCss(editor,color,type,bgUrl,backgroundRepeat,backgroundSize) {
    let $p  =$(`<p></p>`);
    let $bgClassMarkP = $(`<section class='bgMark bgImage'><p><br></p></section>`);
    let $bgClassMark = $(`<section class='bgMark bgImage'></section>`);
    if(editor.editable.children().length == 0 && editor.editable.text().length == 0) {
        editor.editable.append($bgClassMarkP);
    }
    if( editor.editable.children().length == 0 && editor.editable.text().length > 0){
        editor.editable.wrapInner($p);
    }
    if(!editor.editable.children().hasClass("bgMark")) {
        editor.editable.children().wrapAll($bgClassMark);
    }
    let cssStyle = {};
    let paddingUp ;
    let paddingLeft ;
    if(type == "bgColor") {
        $(".bgMark").removeClass("bgImage");
        paddingUp = $(".color-bg-content .up-down-distance .right-space").val();
        paddingLeft = $(".color-bg-content .left-right-distance .right-space").val();
        color ? cssStyle = { "background-image": `none`, "background-color": color, "paddingLeft": paddingLeft+"px", "paddingRight":paddingLeft+"px", "paddingTop":paddingUp+"px", "paddingBottom":paddingUp+"px" } : cssStyle = { "paddingLeft": paddingLeft+"px", "paddingRight":paddingLeft+"px", "paddingTop":paddingUp+"px", "paddingBottom":paddingUp+"px" };
    }
    if(type == "bgImage") {
        $(".bgMark").addClass("bgImage");
        paddingUp = $(".image-bg-content .up-down-distance .right-space").val();
        paddingLeft = $(".image-bg-content .left-right-distance .right-space").val();
        cssStyle = { "background-color": "transparent", "background-image": `url("${bgUrl}")`,"background-repeat":backgroundRepeat ,"background-size": backgroundSize,"paddingLeft": paddingLeft+"px", "paddingRight":paddingLeft+"px", "paddingTop":paddingUp+"px", "paddingBottom":paddingUp+"px" };
    }
    $(".preview-place").css(cssStyle);
    $(".bgMark").css(cssStyle).css({"background-size":"auto auto"});

}

/**
 * 清除背景方法
 */
export function clearBg() {
    $(".up-down-distance .right-space").val("10");
    $(".left-right-distance .right-space").val("10");
    $(".bgMark").removeAttr("style");
    $(".preview-place").removeAttr("style");
}
