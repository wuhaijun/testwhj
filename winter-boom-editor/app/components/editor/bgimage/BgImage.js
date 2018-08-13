import { bgColorPicker,changeCss,clearBg } from '../../../utils/BgColorPicker';
import loginUtils from "../../../utils/loginUtils";
import uploadUtil from '../../UploadUtil';


let $temp; //上下，左右边距 共用代码
let __context;
let type; // bgColor,bgImage,菜单选项卡切换标记
let __bgImageUrl = "none"; //图片背景url
let backgroundRepeat; //background-repeat
let backgroundSize; //background-size;

let imageListDialogLeft; //图片列表 左距离
let imageListDialogTop; //图片列表 上距离


/**
 * 背景弹窗的左部构成
 * @param __context
 * @private
 */
function __showBodyLeft__(__context) {
    let $left = $(".bg-left");

    let $header = $(`<div class="header"></div>`);
    let $colorBgBtn = $(`<span class="color-bg-btn active">颜色背景</span>`);
    let $imageBgBtn = $(`<span class="image-bg-btn">图片背景</span>`);
    $header.append($colorBgBtn);
    $header.append($imageBgBtn);

    let $content = $(`<div class="content"></div>`);
    $content.append(__buildColorContent__(__context));
    $content.append(__buildBgContent__(__context));

    $left.append($header);
    $left.append($content);

    $colorBgBtn.click(() => {
        type = "bgColor";
        $(".up-down-distance .right-space").val("10");
        $(".left-right-distance .right-space").val("10");
        $colorBgBtn.addClass('active');
        $colorBgBtn.siblings().removeClass('active');
        $(".color-bg-content").show();
        $(".image-bg-content").hide();
    });
    $imageBgBtn.click(() => {
        type = "bgImage";
        $(".up-down-distance .right-space").val("10");
        $(".left-right-distance .right-space").val("10");
        $imageBgBtn.addClass('active');
        $imageBgBtn.siblings().removeClass('active');
        $(".color-bg-content").hide();
        $(".image-bg-content").show();
    });

    $colorBgBtn.click();


}

/**
 * 背景弹窗的右部构成
 * @param context
 * @private
 */
function __showBodyRight__(context) {
    let $right = $(".bg-right");
    let $previewText = $(`<div class="text">效果预览</div>`);
    let $previewPlace = $(`<div class="preview-place">脑洞微信编辑器是一款界面简洁、样式精美、排版快速、一键同步至微信后台的微信排版工具。支持样式快速换色、玩转各类动态样式，一键秒刷，海量样式检索，实现全文编辑、增加图文背景颜色或图片、无缝插入多长图片拼接长图文、实时预览、以及快速组合多图文并一键同步后台的微信图文编辑器。</div>`);
    $right.append($previewText);
    $right.append($previewPlace);
}

/**
 * 背景弹窗的底部构成
 * @param context
 * @private
 */
function __showBottom__(context) {
    let $bottom = $(".bg-bottom-box");
    $bottom.html('');
    let $clearBgBtn = $(`<span class="clear-bg">清除背景</span>`);
    let $cancelBtn = $(`<button class="bg-cancel-btn">取消</button>`);
    let $okBtn = $(`<button class="bg-ok-btn">确定</button>`);
    $bottom.append($clearBgBtn);
    $bottom.append($okBtn);
    $bottom.append($cancelBtn);

    $clearBgBtn.click(() => {
        clearBg();
    });

    $cancelBtn.click(() => {
        let temp = localStorage['temp_article'];
        let json = JSON.parse(temp);
        let $articleContent = $(json.content);
        $articleContent.find("bgMark");
        if($articleContent.hasClass("bgMark")){
            let cssStyle = $articleContent.css(['backgroundColor', 'backgroundRepeat' , 'backgroundSize','backgroundImage','paddingLeft','paddingRight','paddingTop','paddingBottom']) ;
            if(cssStyle.backgroundImage){
                type = "bgImage";
                cssStyle.backgroundImage = cssStyle.backgroundImage.replace(/url\([\'\"]?(.+?)[\'\"]?\)/, '$1');
            }
            changeCss(__context, cssStyle.backgroundColor, type, cssStyle.backgroundImage, cssStyle.backgroundRepeat, cssStyle.backgroundSize);
        }else{
            clearBg();
        }
        __closeBgDialog__();
    });

    $okBtn.click(() => {
        __closeBgDialog__();
        $(".col-editor-operator .save").click();
    });
}

/**
 * 构建菜单［颜色背景］内容区域
 * @param context
 * @returns {jQuery|HTMLElement}
 * @private
 */
function __buildColorContent__(context) {
    let $colorContent = $(`<div class="color-bg-content"></div>`);

    let $colorPickerBg = $(`<div class="picker-color-wrap">加载中...</div>`);
    let pickInput = $(`<input type='text' id="bgPickerColor"/>`);
    $colorPickerBg.append(pickInput);
    $colorPickerBg.click(() => {
        bgColorPicker("#bgPickerColor", "#ffffff", ".picker-color-wrap", "bgColor",context);
    });

    let $upDownDistance = $(`<div class="up-down-distance"></div>`);
    let $upDownText = $(`<span class="bg-text">上下边距</span>`);
    let $upDownInput = $(`<input class="right-space up-down-input" type="number" name="up" value="10" min="0" max="200" required/>`);
    let $upDownUnits = $(`<span>px</span>`);
    $upDownDistance.append($upDownText);
    $upDownDistance.append($upDownInput);
    $upDownDistance.append($upDownUnits);
    $upDownInput.bind("input propertychange change",(event) => {
        if(type == "bgColor"){
            changeCss(context,null,"bgColor");
        }else{
            changeCss(context,null,"bgImage",__bgImageUrl,backgroundRepeat,backgroundSize);
        }
    });

    let $leftRigthDistance = $(`<div class="left-right-distance"></div>`);
    let $leftRightText = $(`<span class="bg-text">左右边距</span>`);
    let $leftRightInput = $(`<input class="right-space left-right-input" type="number" name="left" value="10" min="0" max="200" required/>`);
    let $leftRightUnits = $(`<span>px</span>`);
    $leftRigthDistance.append($leftRightText);
    $leftRigthDistance.append($leftRightInput);
    $leftRigthDistance.append($leftRightUnits);
    $leftRightInput.bind("input propertychange change",(event) => {
        if(type == "bgColor"){
            changeCss(context,null,"bgColor");
        }else{
            changeCss(context,null,"bgImage",__bgImageUrl,backgroundRepeat,backgroundSize);
        }
    });

    let $commonShare = $(`<div class="share-components"></div>`);
    $commonShare.append($upDownDistance);
    $commonShare.append($leftRigthDistance);
    $temp = $commonShare.clone(true);

    $colorContent.append($colorPickerBg);
    $colorContent.append($commonShare);

    return $colorContent;
}

/**
 * 构建菜单［图片背景］内容区域
 * @param context
 * @returns {jQuery|HTMLElement}
 * @private
 */
function __buildBgContent__(context) {
    //图片背景选项卡的内容区域
    let $imageContent = $(`<div class="image-bg-content"></div>`);

    let $onlineBgWrap = $(`<div class="online-bg"></div>`);
    let $onlineText = $(`<span class="bg-text">在线背景</span>`);
    let $onlineBgBtn = $(`<span class="online-bg-btn right-space"><img src="/static/images/icons/online-bg.svg"/></span>`);
    $onlineBgWrap.append($onlineText);
    $onlineBgWrap.append($onlineBgBtn);
    $onlineBgWrap.on('click', (e) => {
        imageListDialogTop = $onlineBgWrap.offset().top + $onlineBgWrap.height() + 50;
        imageListDialogLeft = $onlineBgWrap.offset().left - 87; //87 距离右边太近，会被遮盖
        __getImageList__((imageList) => {
            __showImageDialog__(imageList);
        });

    });

    let $localUploadWrap = $(`<div class="bg-local-upload"></div>`);
    let $localText = $(`<span class="bg-text">上传背景</span>`);
    let $localUploadIcon = $(`<span class="localUploadBtn right-space"><img src="/static/images/icons/upload-bg.svg"/></span>`);
    $localUploadWrap.append($localText);
    $localUploadWrap.append($localUploadIcon);
    $localUploadWrap.click(() => {
        if (!loginUtils.checkAlert()) return;
        uploadUtil('NO_CATEGORY', false, (keys) => {
            (keys || []).forEach(key => {
                __bgImageUrl = 'http://editor.static.cceato.com/' + key;
                changeCss(context,null,"bgImage",__bgImageUrl,backgroundRepeat,backgroundSize);
                $("#bgPickerColor").click();
            })
        });
    });

    let $Wrap = $(`<div class="wrap"></div>`);
    $Wrap.append($onlineBgWrap);
    $Wrap.append($localUploadWrap);

    let $alignmentWrap = $(`<div class="alignment"></div>`);
    let $alignText = $(`<span class="bg-text">排列方式</span>`);
    let $alignBgList = $(`<div id ="alignBgList"></div>`);

    let $Distance = $(`<div class="distance"></div>`);
    $Distance.append($temp);
    $Distance.append($alignBgList);

    let $ul = $(`<ul></ul>`);

    let list = [{data:"repeat",cover:"/static/images/icons/repeat.svg",backgroundSize:"50% 50%"},
        {data:"no-repeat",cover:"/static/images/icons/no-repeat.svg",backgroundSize:"100% 100%"},
        {data:"repeat-x",cover:"/static/images/icons/repeat-x.svg",backgroundSize:"50% 100%"},
        {data:"repeat-y",cover:"/static/images/icons/repeat-y.svg",backgroundSize:"100% 50%"}];

    list.forEach((c) => {
        let li = $(`<li type="${c.data}"><i class="checked-icon"></i></li>`).click(e => {
            if (!li.hasClass("checked")) {
                li.addClass("checked");
                li.siblings().removeClass("checked");
                backgroundRepeat = c.data;
                backgroundSize = c.backgroundSize;
                changeCss(__context,null,"bgImage",__bgImageUrl,backgroundRepeat,backgroundSize);
            }
        });
        let $bgImage = $(` <span class="bgimg" ></span>`).css({
            'background': `rgba(0, 0, 0, 0) url("${c.cover}") no-repeat scroll center center / cover`
        });
        li.append($bgImage);
        li.appendTo($ul);
    });

    $alignBgList.append($alignText);
    $alignBgList.append($ul);
    $alignBgList.find("ul li").first().addClass("checked");
    $imageContent.append($Wrap);
    $imageContent.append($Distance);
    return $imageContent;
}

/**
 * 构建在线图片的弹窗
 * @param imageList
 * @private
 */
function __buildImageDialog__(imageList) {
    $('body').append('<div id="bgImageDialogs"></div>');
    $('#bgImageDialogs').click(function(event){
        event.stopPropagation();
    });
    $('#bgImageDialogs').html(`<div class="bg-dialogs"></div>`).css({top: imageListDialogTop ,left: imageListDialogLeft});
    let $bg_dialogs = $('.bg-dialogs');
    $bg_dialogs.html('');
    let $dialogs_header = $(`<div class="dialogs_header">背景图片</div>`);
    let $dialogs_content = $(`<div class="dialogs_content"></div>`);
    let $dialogs_content_ul = $('<ul class="dialogs_content_ul"></ul>');
    imageList.forEach((v) => {
        let li = $(`<li class="dialogs_content_li"><i class="checked-icon"></i><img src="http://editor.static.cceato.com/${v.key}"/></li>`).click((e) => {
            if (li.hasClass("checked")) {
                li.removeClass("checked");
                __bgImageUrl = "none";
            } else {
                li.addClass("checked");
                li.siblings().removeClass("checked");
                __bgImageUrl = "http://editor.static.cceato.com/" + v.key;
            }
            changeCss(__context,null,"bgImage",__bgImageUrl,backgroundRepeat,backgroundSize);

        });
        $dialogs_content_ul.append(li);
    });
    $dialogs_content.append($dialogs_content_ul);
    let $dialogs_footer = $(`<div class="dialogs_footer"><button class="bg-cancel-btn">取消</button><button class="bg-ok-btn">确定</button></div>`);
    $bg_dialogs.append($dialogs_header);
    $bg_dialogs.append($dialogs_content);
    $bg_dialogs.append($dialogs_footer);

    let $bgCancelBtn = $('.bg-cancel-btn');
    $bgCancelBtn.on('click',function () {
        $('#bgImageDialogs').hide();
        changeCss(__context,null,"bgImage","none",backgroundRepeat,backgroundSize);
    });
    let $bgOkBtn = $(".bg-ok-btn");
    $bgOkBtn.on('click',function () {
        $('#bgImageDialogs').hide();
    });

}

/**
 * 获取在线背景图片数据
 * @param callback
 * @private
 */
function __getImageList__(callback) {
    $.get('/images/bg/list', json => {
        callback && callback(json.items);
    });
}

/**
 * 显示在线图片弹窗
 * @param imageList
 * @private
 */
function __showImageDialog__(imageList) {
    __buildImageDialog__(imageList);
    $('#bgImageDialogs').show();
}

/**
 * 关闭背景弹窗
 * @private
 */
function __closeBgDialog__() {
    $('#bgImageBox').remove();
}

/**
 * 关闭在线背景图片列表弹窗
 * @private
 */
function __closeImageDialog__() {
    $('#bgImageDialogs').remove();
}

export default function(target,context){
    __context = context;
    backgroundRepeat = "repeat";
    backgroundSize = "50% 50%";
    type ="bgColor";
    var eTop = target.offset().top + target.height() + 15;
    var eLeft = target.offset().left - 87; //距离右边太近，会被遮盖
    $(".editorDialog").remove();  //避免多个弹窗  editorDialog 弹窗的公共class
    $('body').append('<div id="bgImageBox" class="editorDialog"></div>');

    $('#bgImageBox').css({top: eTop, left: eLeft});

    $('#bgImageBox').click(function(event){
        event.stopPropagation();
        __closeImageDialog__();
    });

    $('#bgImageBox').html('<div class="bg-body-box"><div class="bg-left"></div><div class="bg-right"></div></div><div style="clear:both"></div><div class="bg-bottom-box"></div>');
    __showBodyLeft__(context);
    $("#bgPickerColor").click();

    __showBodyRight__(context);
    __showBottom__(context);

    $('body').click(function(){
        __closeBgDialog__();
        __closeImageDialog__();
    });
    $('.note-editable').click(function(){
        __closeBgDialog__();
        __closeImageDialog__();
    });
}


