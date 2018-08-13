'use strict';
import Component from './Component';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    changeImages(callback) {
        let $menuImage = this.find('.menu.image');
        /*
        if(!$menuImage.hasClass("active") || this.main.content.hasClass('out')){
        }*/
        $menuImage.click();

        this.main.content.changeImageCallback = callback;
    }

    reloadImages() {
        this.find('.menu.image').click();
    }

    rendered() {
        let $comp = this;
        this.find('.menu.style').click(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.main.content.renderStyles();
        });

        this.find('.menu.template').click(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.main.content.renderTemplates();
        });

        this.find('.menu.article').click(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.main.content.renderArticles();
        });

        this.find('.menu.collection').click(function() {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.main.content.renderCollection();
        });

        this.find('.menu.image').click(function(e) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $comp.main.content.renderImages();
        });

        this.find('.menu.style').click();

        this.find('#qq-btn').popover({
            trigger: 'hover',
            html: true
        });
        this.on('dbclick',this.onClickTest);
    }
    onClickTest(e) {
        e.stopPropagation();
        return false;
    }

    render() {
        return $(`
        <div class="editor-menus">
            <ul>
                <li class="menu style"><i class="icon-boom-ys-nor"></i>样式</li>
                <li class="menu image"><i class="icon-boom-picture-nor"></i>图库</li>
                <li class="menu collection"><i class="icon-boom-collection-nor"></i>收藏</li>
                <li class="menu template"><i class="icon-boom-mb-nor"></i>模板</li>

                <li class="menu article"><i class="icon-boom-article-nor"></i>文章</li>
            </ul>
            <div style="width: 49px; margin: 200px auto 0 auto; text-align: center;">
                <a target="_blank" href="http://shang.qq.com/wpa/qunwpa?idkey=073bf4225dd3561c61c3c01c0cfb065190c1474deddda15a5c06ce7b0bb6fa2c">
                    <button id="qq-btn" type="button" class="btn btn-info btn-sm btn-icon mr5"
                    title="" data-container="body" data-placement="right"
    data-content="<div style='text-align:center;'><img width='60%' src='http://boom-static.static.cceato.com/qq/CE030F58C72739FCE53651BE8F44283C.jpg'/><br/><br/><span style='font-size:12px'>QQ群号: 629747505</span></div>">
                    <i class="fa fa-qq"></i>
                    <span>交流群</span>
                    </button>
                </a>
            </div>
        </div>`);
    }
}
