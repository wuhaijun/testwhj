'use strict';

let body = $('body');

export default function ({name, url, change, success, error, timeout}) {

    let input = $(`<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif" name="${name || 'file'}"/>`).hide().insertAfter(body);
    let iframe = $('<iframe src="javascript:void(0);"></iframe>').hide().appendTo(body)[0];

    let getBody = () => $((iframe.contentDocument || iframe.contentWindow.document).body);

    input.change(e => {
        let iframeBody = getBody();
        iframeBody.empty();
        let form = $('<form method="post" enctype="multipart/form-data"></form>');
        form.appendTo(iframeBody);
        form.attr('action', typeof(url) === 'string'? url: url());
        form.append(input.clone());
        if(change? change() : true) {
            form.submit();
            let checkCount = 0;
            let checkResult = () => {
                let result = getBody().text();
                checkCount ++;
                if(result.startsWith('success:')) {
                    success && success(result.substring(8));
                }else if(result.startsWith('error:')){
                    error && error(result.substring(6));
                }else if(checkCount < 50){
                    setTimeout(checkResult, 100)
                }else {
                    timeout && timeout();
                }
            }

            checkResult();
        }
    });

    return {
        click: function () {
            input.click();
        }
    }
}