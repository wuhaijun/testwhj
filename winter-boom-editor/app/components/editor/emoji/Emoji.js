import data from './data'

let emotions = {  };
let usedOften = '常用';
let categories = [ usedOften ];

$(function() {
    emotions[usedOften] = { "default": [] };

    for (let i in data) {
        if (emotions[data[i].category] == undefined) {
            categories.push(data[i].category);
            emotions[data[i].category] = { [(data[i].subCategory)]: [data[i]] };
        } else if (emotions[data[i].category][data[i].subCategory] == undefined){
            emotions[data[i].category][data[i].subCategory] = [data[i]];
        } else {
            emotions[data[i].category][data[i].subCategory].push(data[i]);
        }
    }
});

function __showCategories__ (context) {
    let $categories = $('#emotions .categories');
    $categories.html('');

    categories.forEach(category => {
        $(`<a href="javascript:void(0);">${ category }</a>`).click(function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active')
            if (category == usedOften) {
                $.get('/emoji/used_list', (json) => {
                    emotions[usedOften]["default"] = json.emojis || [];
                    __showEmotions__(category, context);
                });
            } else {
                __showEmotions__(category, context);
            }
        }).appendTo($categories);
    });
}

function __showSubEmotions__ (emoji, context) {
    let chars = emoji.content.split('');
    chars.forEach(char => {
        let $symbol = $(`<a href="javascript:;"><span class="emoji-symbol">${ char }</span></a>`);
        $symbol.click(function() {
            context.invoke('editor.insertText', char);
            $.post('/emoji/used', { emoji: {
                category: emoji.category,
                subCategory: emoji.subCategory,
                content: char } }, () => {})
        });
        $('#emotions .container-emoji').append($symbol);
    })
}

function __showEmotions__ (category, context) {
    var iconHeight = 24;
    var iconWidth = 24;

    $('#emotions .container-emoji').html('');

    let subs = Object.keys(emotions[category]);
    emotions[category][subs[0]].forEach(emoji => {
        let emoji_category = emoji.category;
        if (emoji_category == '符号') {
            __showSubEmotions__(emoji, context);
            $('.class-code').html('')
            subs.forEach(i => {
                let $span = $(`<button class="category-btn">${i}</button>`);
                $span.click(function () {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    $('#emotions .container-emoji').html('');
                    emotions[category][i].forEach(emoji => {
                        __showSubEmotions__(emoji, context);
                    })
                });
                if (emoji.content.length > 1) {
                    $('.class-code').append($span);
                }
            })
        } else {
            $('.class-code').html('');
            let $content = $(`<img src="${ emoji.content }" alt="${ emoji.name }" width="${ iconWidth }" height="${ iconHeight }" />`);
            let $a = $(`<a href="javascript:void(0);"></a>`);
            let showWidth = emoji_category == '搞笑' ? iconWidth * 5 : iconWidth;
            let showHeight = emoji_category == '搞笑' ? iconHeight * 5 : iconHeight;

            $a.click(function(){
                context.invoke('editor.restoreRange');
                let node = $(`<img src="${ emoji.content }" style="width:${ showWidth }px !important;height:${ showHeight }px !important;">`);
                context.invoke('editor.insertNode', node[0]);
                $.post('/emoji/used', { emoji: emoji }, () => {})

            }).hover(function() {
                if (iconWidth != showWidth || iconHeight != showHeight) {
                    $(this).append($(`
                    <div style="position: absolute" id="__temp__">
                        <img src="${ emoji.content }" width="${ showWidth }px" height="${ showHeight }px"/>
                    </div>`).fadeIn(200))
                }
            }, function() {
                $('#__temp__').remove()
            });
            $a.append($content);
            $('#emotions .container-emoji').append($a);
        }
    });
}

export default function(target, context){
    var eTop = target.offset().top + target.height() + 15;
    var eLeft = target.offset().left - 125; //125是 有些屏幕下，右边会被遮盖

    if($('#emotions .categories')[0]){
        $('#emotions').css({top: eTop, left: eLeft});
        $('#emotions').toggle();
        return;
    }
    $(".editorDialog").remove(); //避免多个弹窗  editorDialog 公共class
    $('body').append('<div id="emotions" class="editorDialog"></div>');
    $('#emotions').css({top: eTop, left: eLeft});
    $('#emotions').html('<div>正在加载，请稍候...</div>');
    $('#emotions').click(function(event){
        event.stopPropagation();
    });

    $('#emotions').html('<div class="categories"></div><div class="class-code"></div><div class="container-emoji"></div>');
    __showCategories__(context);
    __showEmotions__('经典', context);

    $('body').click(function(){
        $('#emotions').remove();
    });
    //点击编辑器区域 弹窗也消失
    $('.note-editable').click(function(){
        $('#emotions').remove();
    });

}
