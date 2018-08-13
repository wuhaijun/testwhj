'use strict';
import Component from './Component';

export default class extends Component {
    constructor(props) {
        super(props);
        this.__page__ = 1;
        this.__size__ = 5;
        this.__maxPage__ = 0;
        this.type = '';
        this.rendered();

        this.templateRequest;
        this.changeType = false;
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

    __cleanStyles__() {
        this.__page__ = 1;
        if(this.templateRequest !=null) this.templateRequest.abort();
        this.find('#styles').html('');
    }

    __loadStyles__() {
        let $comp = this;
        let $styles = this.find('#styles');

        $styles.masonry({
            itemSelector: '.template-list',
            columnWidth: 320,
            gutter: 10,
            isFitWidth: true
        });

        this.templateRequest = $.get('/api/template/', { page: this.__page__, size: this.__size__, type: this.type }, json => {
            this.__maxPage__ = json.pagination.maxPage;
            (json.results || []).forEach(template => {
                let $template = $(`<div class="template-list" id=${template.template._id}></div>`);
                (template.styles || []).forEach(style => {
                    let $style = $(`<div class="template-style" id=${style._id}>${ style.html }</div>`);
                    $style.click(() => {
                        this.editor.insert(this.__section__(style));
                    });
                    $template.append($style);
                });
                $styles.append($template).masonry().masonry('appended', $template);
            });
            $styles.imagesLoaded().progress(function (imgLoad , image) {
                $styles.masonry().masonry('reloadItems')
            });
        })
    }
    rendered() {
        let $types = this.find('.types');
        let $comp = this;

        $.getJSON('/api/templateTypes', json => {
            (json.results || []).forEach(type => {
                $types.append(`<a href="javascript:;" id="${ type }">${ type }</a>`);
            });
            $types.children('a').click(function(e) {
                e.preventDefault();
                e.stopPropagation();

                let $this = $(this);
                $this.siblings().removeClass('active');
                $this.addClass('active');
                $comp.type = $this.text();

                $comp.__cleanStyles__();
                $comp.__loadStyles__();
            });
            $($types.children('a')[0]).click();
        });

        $comp.__scrollRequestMore__();
    }

    __scrollRequestMore__() {
        let $comp = this;
        let $stylesWrapper = this.find('.styles-wrapper');
        $stylesWrapper.scroll(function() {
            let scrollTop = $(this).scrollTop();
            let scrollHeight = $(this).find('#styles').height();
            let windowHeight = $(window).height();
            if(scrollHeight - windowHeight < scrollTop) {
                if($comp.__maxPage__ <= $comp.__page__) {
                    return;
                }
                $comp.__page__ += 1;
                $comp.__loadStyles__();
            }
        });
    }

    render() {
        return $(`
        <div class="editor-styles">
            <div class="editor-styles-search">
                <div class="types template">
                </div>
            </div>
            <div class="styles-wrapper">
                <div id="styles" class="editor-styles-content"></div>
            </div>
        </div>`);
    }
}