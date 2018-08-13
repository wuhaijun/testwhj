import _ from 'lodash';
import loginUtils from '../../utils/loginUtils';
import { wrapper } from '../../utils/EditorCommandWrapper';
import dom from '../../utils/dom';

function CropperToolbar($editable) {
    let $cropperToolbar = $(`<div class="cropper-tool-bar"></div>`);
    let $completeBtn = $(`<button class="complete-cropper btn"> 完成</button>`);
    let $cancelBtn = $(`<button class="cancel-cropper btn">放弃裁剪</button>`);

    $cropperToolbar.append($completeBtn);
    $cropperToolbar.append($cancelBtn);

    let toolHeight = $cropperToolbar.height();

    let currentImg; //原始图片
    let originImgStyle = "";
    let imgFatherContainer = $('<section id="imgFatherContainer"></section>')

    let cropperData;
    let $toobarWrapper; //编辑工具条容器，用以定位当前toolBar
    let options = {
        background: false,
        guides: false,
        dragCrop: false,
        zoomable: false,
        mouseWheelZoom: false,
        touchDragZoom: false,
        autoCropArea: 1,
        autoCrop: true,
        movable: false,
        rotatable:false,
        viewMode:3
    };

    $editable.on('click', '.winter-section-p img, .winter-section-p .bgImage',
        function (event) {
            let inner = $(this).closest('.winter-section-inner');
            if (inner.hasClass('winter-section-dynamic')
                && !inner.hasClass('winter-section-dynamic-edit')) {
                return;
            }
        });

    function hideTool() {
        $cropperToolbar.hide();
        $cropperToolbar.parent().hide();
    }

    function showTool() {
        positionToolbar();
        $cropperToolbar.show();
    }

    function positionToolbar() {
        $toobarWrapper =  $('.image-tool-bar');
        $cropperToolbar.appendTo($toobarWrapper);
    }

    function buildCropper(fgImg) {
        currentImg = fgImg;
        currentImg.wrap(function() {
            imgFatherContainer.width(currentImg.width());
            imgFatherContainer.height(currentImg.height());
            return imgFatherContainer;

        });   
        if (typeof (currentImg.attr('origin-src') !== "undefine")) {
            let originSrc = currentImg.attr('origin-src');
            let cropedSrc = currentImg.attr('src')
            currentImg.attr({ 'src': originSrc, 'origin-src': cropedSrc });
        }
        // options.data = cropperData;
        currentImg.cropper(options);
        showTool();
        $('body').bind('click', cancleCropperHandler);
    }

    let cancleCropperHandler = () => {
        $cancelBtn.click();
    }

    //取消裁剪
    $cancelBtn.on("click", function (e) {
        e.stopPropagation();
        $('body').unbind('click', cancleCropperHandler);

        currentImg.unwrap(imgFatherContainer);
        if (typeof (currentImg.attr('origin-src') !== "undefine")) {
            let originSrc = currentImg.attr('origin-src');
            let cropedSrc = currentImg.attr('src')
            currentImg.attr({ 'src': originSrc, 'origin-src': cropedSrc });
        }
        currentImg.cropper('clear');
        currentImg.cropper('destroy');
        hideTool();
    });

    //确认裁剪
    $completeBtn.on("click", function (e) {
        e.stopPropagation();
        $('body').unbind('click', cancleCropperHandler);

        currentImg.unwrap(imgFatherContainer);
        cropperData = currentImg.cropper('getData');
        currentImg.cropper('destroy');
        let originSrc = currentImg.attr('src');
        let cropedSrc = generatorCroppedImageUrl(originSrc, cropperData);
        currentImg.attr({ 'src': cropedSrc, 'origin-src': originSrc });
        hideTool();
    });

    function generatorCroppedImageUrl(url, crop = {}) {
        let imageMogr2 = "?imageMogr2";
        let urlObj = new URL(url);
        let originImageUrl = urlObj.origin + urlObj.pathname;
        let cropedUrl = originImageUrl + imageMogr2;

        //检查图片是否被旋转过        
        let rotate = null;     
        let regex = /\/rotate\/\d*/;
        if(regex.test(url)) {
            rotate = regex.exec(url)[0];
            cropedUrl += rotate;
        }

        let width = crop.width;
        let height = crop.height;
        let x = crop.x;
        let y = crop.y;
        cropedUrl += `/crop/!${width}x${height}a${x}a${y}`;
        
        return cropedUrl;
    }


    return {
        hideTool,
        showTool,
        buildCropper
    }
}

export default CropperToolbar;