//滚动
var myElement = document.querySelector(".headroom");
// 创建 Headroom 对象，将页面元素传递进去
var headroom  = new Headroom(myElement);
// 初始化
headroom.init();


$(document).ready(function(){
    let animates = ['.magnanimity', '.exclusive', '.afflatus', '.origin-p', '.origin-card', '.cooperate-p', '.cooperate-div'];
    let $animates = animates.map(v => $(v));
    //动画
    $(window).on("scroll",function(){
        $animates.forEach(v => setAnimation(v))
    })

    //鼠标经过离开换图
    $('body').on('mousemove', '[data-move]', function() {
        $(this).attr('src', $(this).attr('data-move'))
    })
    $('body').on('mouseleave', '[data-leave]', function() {
        $(this).attr('src', $(this).attr('data-leave'))
    })
    
    $('.tools').on('mousemove',function () {
        $(this).find('.tools-div').fadeIn(200);
        $('.tools-tool span').addClass('borderT');
    })
    $('.tools').on('mouseleave',function () {
        $(this).find('.tools-div').fadeOut(100);
        $('.tools-tool span').removeClass('borderT');
    })


});

let $window = $(window)
function setAnimation(node) {
    let h = node.offset().top - $window.scrollTop() - $window.height()
    if (h < node.height() / 2) {
        node.addClass('animated fadeInUp visible');
    } else {
        node.removeClass('animated fadeInUp visible');
    }
}