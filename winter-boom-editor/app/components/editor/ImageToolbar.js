import _ from 'lodash';
import CropperToolbar from './CropperToolbar';
import loginUtils from '../../utils/loginUtils';
import EditorCommandWrapper from '../../utils/EditorCommandWrapper';
import dom from '../../utils/dom';


function ImageToolbar($editable,$context) {

    let showed = false, lastTarget, fgImg, fgOpacity, bgImg, bgOpacity;
    let cropperToolbar = new CropperToolbar($editable);
    let $imgToolbar = $(`<div class="image-tool-bar"></div>`);
    let $modal = $('<div class="modal" style="background: none;"></div>');
    let replaceImgBtn = $(`<button id="change-images" style="font-size:12px;"> <i class=""></i>替换图片</button>`);
    let replaceBgBtn = $(`<button id="change-background-images" style="font-size:12px;color: #fff;"> <i class="replaceBgBtn"></i>替换背景</button>`);
    let $cropperImgBtn = $(`<button id="corpper-images" class="image-option-tool-bar"> <i class=""></i>裁剪图片</button>`);
    let $minusScale = $(`<button class="image-option-tool-bar" style=""><i class="minusScale"></i></button>`);
    let $addScale = $(`<button class="left" style="margin-left: 6px;margin-right: 15px;cursor: pointer;"><i class="addScale"></i></button>`);
    let $sizeFrontBtn = $(`<span class="sizeFront" style="font-size:12px;color: #fff;">尺寸</span>`);
    let $minusRadius = $(`<button class="image-option-tool-bar" style="cursor: pointer;"><i class="minusRadius"></i></button>`);
    let $addRadius = $(`<button class="image-option-tool-bar" style="cursor: pointer; display:inline;"><i class="addRadius"></i></button>`);
    let $radiusBtn = $(`<span style="font-size:12px;color: #fff;">圆角</span>`);
    let $shadow = $('<div style="display:inline-block;"><input type="checkbox" id="select"/><span style="margin-left: 5px;font-size:12px;color: #fff;">阴影</span></div>')
    let $linkbtn = $(`<button class="add-image-link"> <image src="/static/images/icons/href-link.svg"></i> <span style="font-size:12px;color: #fff;">超链接</span></button>`);

    let $upMove = $(`<button id="image-move-up"><i class="fa fa-arrow-up"></i>上移</button>`);
    let $downMove = $(`<button id="image-move-down"><i class="fa fa-arrow-down"></i>下移</button>`);

    $imgToolbar.append(replaceImgBtn);
    $imgToolbar.append(replaceBgBtn);
    $imgToolbar.append($cropperImgBtn);
    $imgToolbar.append($shadow);
    $imgToolbar.append($minusScale);
    $imgToolbar.append($sizeFrontBtn);
    $imgToolbar.append($addScale);
    $imgToolbar.append($minusRadius);
    $imgToolbar.append($radiusBtn);
    $imgToolbar.append($addRadius);
    $imgToolbar.append($linkbtn);

    //$imgToolbar.append($upMove);
   // $imgToolbar.append($downMove);



    $imgToolbar.appendTo($('body'));
    let toolHeight = $imgToolbar.height();
    let imageRotateDegree = 0; //图片旋转角度

    $editable.on('click', '.winter-section-p img, .winter-section-p .bgImage',
        function (event) {
            let inner = $(this).closest('.winter-section-inner');
            //@TODO 无奈的临时耦合，将来再整体规划吧
            if (inner.hasClass('winter-section-dynamic') && !inner.hasClass('winter-section-dynamic-edit')) {
                return;
            }
            showTool(event);

            //点击前景图，选中图片区域
            if (fgImg && $(event.target).is('img')) {
                var s = window.getSelection();
                s.removeAllRanges();
                var range = document.createRange();
                range.selectNode(event.target);
                s.addRange(range);
            }
        });

    $editable.on('click','.winter-section-p .cropper-container',function name(e) {
        event.stopPropagation();
        event.preventDefault();
        })

    $modal.click(e => {
        hideTool();
    });

    replaceImgBtn.click(e => {
        hideTool();
    });
    replaceBgBtn.click(e => {
        hideTool();
    });
    $cropperImgBtn.click(e => {
        e.stopPropagation();
        hideTool();
        $imgToolbar.show();
    });

    $('body').keydown(e => {
        // 选中图片 点击delete按键,可以删除图片
        if (showed && fgImg && e.keyCode === 8) {
            hideTool();
            fgImg.remove();
            return false;
        }
        // 选中图片 点击enter按键,可以添加换行
        if (showed && fgImg && e.keyCode === 13) {
            let $addPtag = $(`<p><br/></p>`);
            fgImg.after($addPtag);
        }

    }).append($modal);

    function hideTool() {
        $imgToolbar.hide();
        $modal.hide();
        replaceImgBtn.hide();
        replaceBgBtn.hide();
        $cropperImgBtn.hide();
        //$leftRotate.hide();
        //$rightRotate.hide();
        $minusScale.hide();
        $sizeFrontBtn.hide();
        $addScale.hide();
        $shadow.hide();

        $minusRadius.hide();
        $radiusBtn.hide();
        $addScale.hide();
        $addRadius.hide();
        $linkbtn.hide();

        $upMove.hide();
        $downMove.hide();

       // $imgToolbar.css({ 'width': '100px','height': '30px' });
         $imgToolbar.css({ 'width': '100px' });


        if (fgImg) {
            fgImg.css({'opacity': fgOpacity,'border': 'none'});
        }
        if (bgImg) {
            bgImg.css({'opacity': bgOpacity,'border': 'none'});
        }

        showed = false;
    }

    function showTool(event) {
        //同一次点击可能分别触发两次事件，第二次事件进行忽略。
        if (event.target != lastTarget) {
            hideTool();
            fgImg = null;
            bgImg = null;
            lastTarget = null;
        }
        lastTarget = event.target;
        let $this = $(event.target);
        showBg($this);
        showFg($this);
        fgImg && replaceImgBtn.show();
        bgImg && replaceBgBtn.show();


        positionToolbar(event.clientX - 20, event.clientY + 20);

        if (fgImg || bgImg) {
            $imgToolbar.show().focus();
            $modal.show();
            showed = true;
            $editable.blur(); //blur一定要在showed之后，否则图片的透明状态会被临时保存记录。
        }
    }

    //添加阴影事件
    $shadow.find('#select').on('click', function () {
        if (this.checked) {
            fgImg.css('box-shadow', '0 0 20px 0 #ccc');
        } else {
            fgImg.css('box-shadow', '');
        }
    })

    //左转按钮点击事件
    /* $leftRotate.on("click", function () {
        let originSrc = fgImg.attr('src');
        let cropedSrc = __generatorRotateImageUrl(originSrc, -10);
        fgImg.attr({ 'src': cropedSrc });
        fgImg.removeAttr('origin-src');
    }); */

    //右转按钮点击事件
    /* $rightRotate.on("click", function () {
        let originSrc = fgImg.attr('src');
        let cropedSrc = __generatorRotateImageUrl(originSrc, 10);
        fgImg.attr({
            'src': cropedSrc
        });
        fgImg.removeAttr('origin-src');
    });
 */
    //缩小按钮点击事件
    $minusScale.on("click", function () {
        let originStyle = fgImg.attr('style');
        fgImg.attr('style', __calculatorScalePercent(originStyle, -10));
    });

    //放大按钮点击事件
    $addScale.on("click", function () {
        let originStyle = fgImg.attr('style');
        fgImg.attr('style', __calculatorScalePercent(originStyle, 10));
    });


    //减小边框圆角按钮点击事件
    $minusRadius.on("click", function () {
        let originStyle = fgImg.attr('style');
        fgImg.attr('style', __changeRadius(originStyle, -10));
    });

    //放大边框圆角按钮点击事件
    $addRadius.on("click", function () {
        let originStyle = fgImg.attr('style');
        fgImg.attr('style', __changeRadius(originStyle, 10));
    });

    //添加超链接
    $linkbtn.on("click", function () {
        $context.invoke('linkDialog.show');
    });

    //上移块
    $upMove.click(() => {
        if (fgImg) {
            let prevDom = fgImg.prev();
            prevDom.css({"opacity": "0.5"}).animate({top: fgImg.outerHeight(true)});
            fgImg.css({"opacity": "0.5"}).animate({top: -prevDom.outerHeight(true)},
                EditorCommandWrapper.wrapper(function () {
                    fgImg.insertBefore(prevDom).css({top: 0, "opacity": "1"});
                    prevDom.css({top: 0, "opacity": "1"});
                })
            );
            hideTool();
        }
    });


    //下移块
    $downMove.click(() => {
        if (fgImg) {
            let nextDom = fgImg.next();
            nextDom.css({"opacity": "0.5"}).animate({top: -fgImg.outerHeight(true)});
            fgImg.css({"opacity": "0.5"}).animate({top: nextDom.outerHeight(true)},
                EditorCommandWrapper.wrapper(function () {
                    fgImg.insertAfter(nextDom).css({top: 0, "opacity": "1"});
                    nextDom.css({top: 0, "opacity": "1"});
                })
            );
            hideTool();
        }
    });


    /**
     * 限制图片缩放百分比
     * 参数1:原始百样式字符串
     * 参数2:百分比变化参数
     * 结果:变化后的百分比
     */
    function __calculatorScalePercent(originStyle, changeValue) {
        let widthRegex = /width:( |)(\d*)/;
        let minWidthRegex = /min-width:( |)(\d*)/;
        let minWidth = 10;
        let hasMinWidth = (minWidthRegex.test(originStyle) && changeValue < 0);
        if (minWidthRegex.test(originStyle)) {
            minWidth = minWidthRegex.exec(originStyle)[2];
        }

        if (widthRegex.test(originStyle)) {
            let widthValue = widthRegex.exec(originStyle)[2];
            let newValue = parseInt(widthValue) + changeValue;
            if (hasMinWidth && (newValue < minWidth)) newValue = widthValue;
            if (newValue <= 10) {
                newValue = 10;
            } else if (newValue >= 200) {
                newValue = 200;
            }
            originStyle = originStyle.replace(widthRegex, `width: ${newValue}`);
        }
        return originStyle;
    };

    /**
     * 生成旋转后的图片地址
     * 参数1:图片在七牛的地址
     * 参数2:旋转角度
     * 结果:旋转后的图片地址
     */
    function __generatorRotateImageUrl(url, rotateDegree = 0) {
        let imageMogr2 = "?imageMogr2";
        let rotateUrl = url;

        let imageMogr2Regex = /\?imageMogr2/;
        if (!imageMogr2Regex.test(rotateUrl)) {
            rotateUrl += imageMogr2;
        }
        //检查图片是否被旋转过
        let rotatePath = '';
        let rotateRegex = /\/rotate\/(\d*)/;
        if (rotateRegex.test(rotateUrl)) {
            let regexResult = rotateRegex.exec(rotateUrl);
            rotatePath = `/rotate/${__calculatorDegree(regexResult[1], rotateDegree)}`
            rotateUrl = rotateUrl.replace(rotateRegex, rotatePath);
        } else {
            rotateUrl += `/rotate/${__calculatorDegree(0, rotateDegree)}`;
        }
        return rotateUrl;
    }

    /**
     * 七牛的旋转参数都是整数，这里做个转化
     * 参数1:原始角度
     * 参数2:变化的角度
     * 结果:新的角度
     */
    function __calculatorDegree(originDegree, changeValue) {
        let newDegree = parseInt(originDegree) + parseInt(changeValue);
        if (newDegree >= 360) {
            newDegree -= 360;
        } else if (newDegree < 0) {
            newDegree += 360;
        }
        return newDegree;
    }

    /**
     * 生成缩放后的图片地址，因为图片大小受样式属性width影响，所以这个方法暂时没用到
     * 参数1:图片在七牛的地址
     * 参数2:缩放比例
     * 结果:缩放后的图片地址
     */
    function __generatorScaleImageUrl(url, changeValue) {
        let imageMogr2 = "?imageMogr2";
        let scaleUrl = url;

        let imageMogr2Regex = /\?imageMogr2/;
        if (!imageMogr2Regex.test(scaleUrl)) {
            scaleUrl += imageMogr2;
        }
        //检查图片是否被放大过
        let scalePath = '';
        let scaleRegex = /\/thumbnail\/\!(\d*)\w/;
        if (scaleRegex.test(scaleUrl)) {
            let regexResult = scaleRegex.exec(scaleUrl);
            scalePath = `/thumbnail/!${__calculatorScale(regexResult[1], changeValue)}p`;
            scaleUrl = scaleUrl.replace(scaleRegex, scalePath);
        } else {
            scaleUrl += `/thumbnail/!${__calculatorScale(100, changeValue)}p`;
        }
        return scaleUrl;
    }

    /**
     * 七牛缩放数值，控制数值在5~200之间
     * 参数1:原始缩放参数
     * 参数2:变化参数
     * 结果:新的缩放参数
     */
    function __calculatorScale(originScale, changeValue) {
        let newScale = parseInt(originScale) + parseInt(changeValue);
        if (newScale > 200) {
            newScale = 200;
        } else if (newScale <= 5) {
            newScale = 5;
        }
        return newScale;
    }

    function __changeRadius(originStyle, changeValue) {
        let borderRadiusRegex = /border-radius:( |)(\d*)/;
        let radius = 0;
        if (borderRadiusRegex.test(originStyle)) {
            let radiusValue = borderRadiusRegex.exec(originStyle)[2];
            let newValue = parseInt(radiusValue) + changeValue;
            if (newValue < 0) newValue = 0;
            originStyle = originStyle.replace(borderRadiusRegex, `border-radius: ${newValue}`);
        } else {
            if (changeValue < 0) changeValue = 0;
            originStyle += `border-radius: ${changeValue}px;`
        }
        return originStyle;
    }

    function isShowed() {
        return showed;
    }

    function showFg($img) {
        if (!dom.isImg($img[0])) {
            return;
        }
        if (!showed) {
            fgImg = $img;
            fgOpacity = $img.css('opacity');
            try {
                $img.css({ 'opacity': parseFloat(fgOpacity) / 2, 'border': '1px dashed #6348FF' });
            } catch (e) {
                $img.css({ 'opacity': '0.5' });
            }
            replaceImgBtn.show();
            //$leftRotate.show();
            //$rightRotate.show();
            $minusScale.show();
            $addScale.show();
            $sizeFrontBtn.show();
            $minusRadius.show();
            $addRadius.show();
            $radiusBtn.show();
            $cropperImgBtn.show();
            $shadow.show();
            $linkbtn.show();
            if($img.hasClass("seamlessImage")){
                $upMove.show();
                $downMove.show();
            }
           // $imgToolbar.css({ 'width': '246px', 'height': '65px' });
            $imgToolbar.css({ 'width': '246px' });


            if (fgImg.css('boxShadow') == "none") {
                $shadow.find('#select').removeAttr("checked");
            } else {
                $shadow.find('#select').attr("checked", "checked");
            }
        }
    }

    function showBg($img) {
        if ($img.hasClass('bgImage')) {
            bgImg = $img;
        } else {
            if ($img.length > 0 && $img[0].firstChild && $img[0].firstChild.nodeType == 3) {
                return;
            }
            bgImg = $img.closest('section.bgImage');
            if(bgImg.hasClass("bgMark")){
                bgImg = null;
                return;
            }
        }
        if (!bgImg || !bgImg.hasClass('bgImage') || bgImg.length == 0) {
            bgImg = null;
            return;
        }
        if (!showed) {
            bgOpacity = bgImg.css('opacity');
            try {
                bgImg.css('opacity', parseFloat(bgOpacity) / 2);
            } catch (e) {
                bgImg.css('opacity', '0.5');
            }
            replaceBgBtn.show();
            $linkbtn.hide();

        }
    }

    function positionToolbar(left, top) {
        top = top - toolHeight - 5;
        $imgToolbar.css({
            "left": left + "px",
            "top": top + "px"
        });
    }

    replaceImgBtn.click((e) => {
        if (!loginUtils.checkAlert() || !fgImg) return;

        window.main.menus.changeImages((imageItem, host) => {
            fgImg.attr('src', host + imageItem.key);
        });
    });

    replaceBgBtn.click((e) => {
        if (!loginUtils.checkAlert() || !bgImg) return;
        window.main.menus.changeImages((imageItem, host) => {
            bgImg.css('background-image', 'url(' + host + imageItem.key + ')');
        });
    });

    $cropperImgBtn.click((e) => {
        e.stopPropagation();
        if (!loginUtils.checkAlert() || !fgImg) return;
        cropperToolbar.buildCropper(fgImg);
    });

    return {
        hideTool,
        showTool,
        isShowed
    }
}

export default ImageToolbar;
