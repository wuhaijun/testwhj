'use strict';
import Component from './Component';
import DynamicStyleUtils from '../utils/DynamicStyleUtils';
import Pagination from './Pagination';

const categoryMapping = {
    "全部": 0
};

export default class extends Component {
    constructor(props) {
        super(props);

        this.favouriteImg = "/static/images/icons/collect_nor.svg";
        this.favouriteSelectedImg = "/static/images/icons/collect_press.svg";

        this.type = '';
        this.keywords = '';
        this.pageSize = 60;
        this.pagination = null;

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

    __pagination__(pageSize, pageNum) {
        this.__loadStyles__(pageSize, pageSize * (pageNum - 1), false)
    }

    __loadStyles__(limit, skip, refresh = true) {
        let $comp = this;
        let $styles = this.find('#styles');
        $styles.html('');
        $.get('/api/center/styles', { type: $comp.type, keywords: $comp.keywords, limit: limit, skip: skip }, json => {
            json.styles.forEach(style => {
                let $box = $(`
                <div class="style">
                    <div class="style-html" id=${style._id}>
                    </div>
                    <div class="mask"></div>
                </div>`);
                let $section = this.__section__(style);
                $box.find(".style-html").append($section);

                let insertFn = e => {
                    let $htmlcode = $section.clone();
                    $htmlcode.attr('rel', style._id);
                    this.editor.insert($htmlcode);
                    this.__stat__(style);
                    gtag('event','Select',{
                        'event_category':'Styles',
                        'event_action':'Select',
                        'event_label':style._id
                    });
                };
                let dynamic = style.dynamic || DynamicStyleUtils.debug(style._id);
                if(dynamic) {
                    let $htmlcode = $section.clone();
                    $htmlcode.attr('rel', style._id);
                    DynamicStyleUtils.selectInit($section, $htmlcode, dynamic, insertFn);
                }else {
                    $box.click(insertFn);
                }

                $styles.append($box).masonry().masonry('appended', $box);


                let $collect = $(`<img class="collect" data-favourite-id="${ style.favouriteId }" data-favourite="${ style.favourite }" src="${style.favourite ? this.favouriteSelectedImg : this.favouriteImg}" >`);
                $box.find('.mask').append($collect);

                $collect.click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    let favourite = $(this).data('favourite');
                    let favouriteId = $(this).data('favourite-id');
                    if (favourite === 'true') {
                        $.get('/api/collect/delete?id=' + favouriteId, json => {
                            if (json.status) {
                                $(this).data('favourite', 'false');
                                $(this).attr('src', $comp.favouriteImg);
                            }
                        })
                    } else {
                        $.post('/api/center/favourite', { styleId: style._id, html: style.html }, json => {
                            if (json.status) {
                                $(this).data('favourite', 'true');
                                $(this).data('favourite-id', json.favouriteId);
                                $(this).attr('src', $comp.favouriteSelectedImg);
                            }
                        });
                    }
                });
            });
            
            $styles.imagesLoaded().progress(function (imgLoad , image) {
                $styles.masonry().masonry('reloadItems')
            });

            if (refresh) {
                this.pagination = new Pagination(this.pageSize, json.total, this.__pagination__, this);
            }
            if(json.total >= 60 ) {
                $styles.append(this.pagination.render())
            };
        })
    }


    __renderTypes__(data, $types, $comp) {
        $types.empty();

        data.forEach((v1, i) => {
            let $menu = $(
                `<li type=${ v1.name }>
                    ${ v1.name }
                    <ul class="sub sub-margin">
                        ${ v1.children.filter(v2=>v2!="引导分享").map(v2 => 
                    `<li type=${ v2 }>${ v2 }</li>`
                ).join('')}
                    </ul>
                </li>`);
            $types.append($menu);
        });
        $types.append($(`<li type="最近使用">最近使用</li>`));
        $types.find('li').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let $this = $(this);
            $this.siblings().children().hide();
            $this.children().show();
            $this.siblings().removeClass('active');
            $this.siblings().find('li').removeClass('active');
            $this.addClass('active');
            let $li = $('.search-type li');
            $li.css('color','#464646');
            $comp.type = $(this).attr('type');
            $comp.__loadStyles__($comp.pageSize, 0);
        });
        $types.find('li').mouseover(function () {
            let $this = $(this);
            $this.siblings().children().hide();
            $this.children().show();
        })
        $types.find('li').mouseout(function () {
            let $this = $(this);
            $this.children().hide();
        })

    }

    __categorySelect(category, $comp, $types) {
        let categoryValue = categoryMapping[category];
        switch (categoryValue) {
            case 0: {
                $.get('/api/center/types', json => {
                    $comp.__renderTypes__(json.result, $types, $comp);
                }); break;
            }
            default: break;
        }
    }


    rendered() {
        let $search = this.find('.search-type');
        let $types = this.find('.sub-title');
        let $comp = this;
        let $styles = this.find('#styles');
        $styles.masonry({
            itemSelector: '.style',
            columnWidth: 320,
            gutter: 10,
            isFitWidth: true
        });
        $search.on('click', 'li', function () {
            $types.html('');
            let $this = $(this);
            let category = $this.html();
            $this.css('color','#6348FF');
            $comp.type = '';
            $comp.__categorySelect(category, $comp, $types);
            $comp.__loadStyles__($comp.pageSize, 0);
        });

        this.find('.search-type li').click();

        this.find('.search-input > input').on('change', function (event) {
            $comp.keywords = this.value;
            $comp.__loadStyles__($comp.pageSize, 0);
        });
}

    render() {
        return $(`
        <div class="editor-styles">
            <div class="editor-styles-search" style="height:90px;">
                <div class="search-input">
                    <img src="/static/images/icons/search.svg" alt="">
                    <input placeholder="找不到想要的,输入关键字搜索试试哟"/>
                </div>
                <div class="search-type">
                    <ul class="search-tabs">
                        <li class="active" style="margin-right:10px;font-size: 12px;">全部</li>
                    </ul>
                </div>
                 <div class="classify" style="display:inline-block;">
                    <ul class="sub-title clearfix">
                    </ul>
                </div>
                <!--<i class="arrow"></i>-->
            </div>
            <div class="styles-wrapper">
                <div id="styles" class="editor-styles-content"></div>
            </div>
        </div>`);
    }
}