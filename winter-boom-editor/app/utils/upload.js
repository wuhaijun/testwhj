'use strict';
import loadingUtils from './loadingUtils';

let body = $('body');

export default function ({name, url, success, error, timeout, multiple = false }) {

    let input = $(`<input type="file" id="upFile" accept="image/jpg,image/jpeg,image/png,image/gif" name="${name || 'file'}"/>`).hide().insertAfter(body);
    if (multiple) input.attr('multiple', 'multiple');

    let iframe = $('<iframe src="javascript:void(0);"></iframe>').hide().appendTo(body)[0];
    let getBody = () => $((iframe.contentDocument || iframe.contentWindow.document).body);

    let extra = {};
    let files;
    input.change(e => {
        let form = $('<form method="post" enctype="multipart/form-data"></form>');
        let iframeBody = getBody();
        iframeBody.empty();
        form.appendTo(iframeBody);
        form.attr('action', typeof(url) === 'string' ? url : url());

        let tempInput = input.clone().removeAttr('id');
        form.append(tempInput);

        //兼容safari的clone没有files属性。
        if(!tempInput[0].files || tempInput[0].files.length == 0) {
            tempInput[0].files = input[0].files;
        }
        // console.log(form.find('input').eq(0)[0].files, input[0].files);

        for (let k in extra) {
            if (extra.hasOwnProperty(k)) {
                form.append($(`<input type='text' name='${ k }' value='${ extra[k] }'>`));
            }
        }

        files = input[0].files;
        if (files.length < 1) return false;

        for (let file of files) {
            if (file.size >= 1024 * 1024 * 5) {
                alert('很抱歉,不能上传大于5M的图片');
                return;
            }
        }

        loadingUtils.showGlobalLoading();
        form.submit();
        let checkCount = 0;
        let checkResult = () => {
            let text = getBody().text();
            let result = {};
            if (text && text.trim()) {
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    console.error(e, text);
                }
            }
            if (result.status == 'ok') {
                input.val('');
                loadingUtils.hideGlobalLoading();
                success && success(result.keys,result.files);
            } else if (result.status == 'fail') {
                input.val('');
                loadingUtils.hideGlobalLoading();
                error && error();
            }else if (checkCount < 50) {
                setTimeout(checkResult, 100)
            } else {
                input.val('');
                loadingUtils.hideGlobalLoading();
                timeout && timeout();
            }
        };
        checkResult();
    });

    return {
        click: function (options) {
            Object.assign(extra, options);
            input.click();
        }
    }
}