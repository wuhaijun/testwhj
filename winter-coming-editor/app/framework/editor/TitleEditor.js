export default function () {
    let titleEditor = $('<div></div>').css({
        width: '100%',
        padding: '20px 0 30px 20px'
    });
    let titleInput = $('<input type="text" placeholder="请输入标题"/>').css({
        'font-size': '22px',
        'height': '46px',
        'width': '100%',
        'line-height': '46px',
        'display': 'block',
        'margin-bottom': '10px',
        'border': '0 none',
        'outline':'0 none',
        'border-bottom': '1px solid rgb(234, 234, 234)'
    });
    let authorInput = $('<input type="text" placeholder="请输入作者"/>').css({
        'display': 'block',
        'border': '0 none',
        'outline':'0 none',
        'border-bottom': '1px solid rgb(234, 234, 234)'
    });

    titleEditor.append(titleInput);
    titleEditor.append(authorInput);

    return {
        dom: titleEditor,
        title: titleInput,
        author: authorInput
    }
};