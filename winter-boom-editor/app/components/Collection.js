'use strict';
import Component from './Component';
import loginUtils from '../utils/loginUtils';
import WxLogin from './WxLogin';


export default class extends Component {
    constructor(props) {
        super(props);

        this.favouriteSelectedImg = "/static/images/icons/collect_press.svg";

        this.rendered();
    }

    __section__ = (style) => {
        let $section = $(style.html);
        _.each($section.find('*').contents(), c => {
            if(c.nodeType && c.nodeType === 3 && _.trim(c.textContent).length == 0) {
                c.remove();
            }
        });
        return $section;
    };

    __stat__ = (style) => {
        $.post('/api/style/use', { styleId: style._id }, data => {
        });
    };

    ___masonry__() {
        let $styles = this.find('#styles');
        $styles.masonry({
            itemSelector: '.style',
            columnWidth: 320,
            gutter: 10,
            isFitWidth: true
        });
    }

    __loadStyles__() {
        let $comp = this;
        let $styles = this.find('#styles');
        $styles.html('');

        if(!loginUtils.check()) {
            $comp.html(`
            <div style="text-align: center;">
                <br/>
                <br/>
                <p>您还没有登录</p>
                <br/>
                <p>请登录体验完整功能</p>
                <br/>
                <a style="color: #459ae9" href="/login">登录/注册</a>
            </div>
            `);
            return;
        }


        this.___masonry__();

        $.get('/api/center/favourite', json => {
            json.styles.forEach(style => {
                let $box = $(`
                <div id="style-${ style._id }" class="style">
                    <div>
                    ${ style.html }
                    </div>
                    <div class="mask">
                        <img class="collect" data-favourite-id="${ style.favouriteId }" data-style-id="${style._id  }" src="${ this.favouriteSelectedImg }">
                    </div>
                </div>`);
                $styles.append($box).masonry().masonry('appended', $box);

                $box.click(() => {
                    this.editor.insert(this.__section__(style));
                    this.__stat__(style);
                    gtag('event','Select',{
                        'event_category':'Styles',
                        'event_action':'Select',
                        'event_label':style._id
                    });
                })
            });

            $styles.imagesLoaded().progress(function (imgLoad , image) {
                $styles.masonry().masonry('reloadItems')
            });

            this.find('.collect').click(function(e) {
                e.preventDefault();
                e.stopPropagation();

                let styleId = $(this).data('style-id');
                let favouriteId = $(this).data('favourite-id');

                $.get('/api/collect/delete?id=' + favouriteId, json => {
                    if (json.status) {
                        $comp.find('#style-' + styleId).remove();
                        $comp.___masonry__();
                    }
                })
            });
        })
    }

    rendered() {
        let $comp = this;

        if(!loginUtils.check()) {
            let wxLogin = new WxLogin();
            $comp.html(wxLogin);
            return;
        }

        this.__loadStyles__();

        this.find('.styles-wrapper').scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) {
                if ($comp.total <= $comp.skip) {
                    $('.center-bottom').css('display', "block");
                    return;
                }
                if ($comp.canScroll) {
                    $comp.loadStyle({
                        type: $comp.parent.centerHeader.type,
                        keywords: $comp.parent.centerHeader.keywords,
                        skip: $comp.skip,
                        limit: $comp.limit
                    }, false);
                    $comp.skip += $comp.limit
                }
            }
        })
    }

    render() {
        return $(`
        <div class="editor-styles">
            <div class="styles-wrapper">
                <div id="styles" class="editor-styles-content"></div>
            </div>
        </div>`);
    }
}
