'use strict';
import Message from './Message';
const message = new Message();

function copyHtml(target, text, event = 'copy', callback = err => {
    if (err)
        message.warn('复制失败，请升级浏览器');
    else {
        message.success('已复制到剪切板');
    }
}) {
    function handleCopy(e) {
        e.clipboardData.setData('text/html', text);
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
        document.removeEventListener(event, handleCopy);
        //@TODO 缺少浏览器的充分测试，但就目前查阅的信息来看，复制成功必然会执行这部分代码。所以将成功的回调放置在此。
        callback && callback();
    }

    document.addEventListener(event, handleCopy);
    let clipboard = new Clipboard(target, {
        text: () => {
            return text;
        }
    });

    clipboard.on('success', function (e) {
       // console.log('success');
        e.clearSelection();
        clipboard.destroy();
    });

    clipboard.on('error', function(e) {
        callback && callback(e);
        e.clearSelection();
        clipboard.destroy();
    });
}


export default copyHtml;