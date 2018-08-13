'use strict';
import Component from '../Component';
import CenterList from './CenterList';

const categoryMapping = {
    "全部": 0, "模板推荐": 1, "我的收藏": 2
};

export default class extends Component {
    constructor(props) {
        super(props);

        this.type = null;
        this.keywords = null;
        this.category = null;

        this.rendered();
    }

    rendered = () => {
        let $search = this.find('.search-type');
        let $types = this.find('.sub-title');
        let $comp = this;

        $search.on('click', 'li', function () {
            $types.html('');
            let $this = $(this);
            let category = $this.html();
            $this.siblings().removeClass('active');
            $this.addClass('active');
            $comp.__categorySelect(category, $comp, $types);
        });
        this.find('.search-type li').first().click();

        this.find('.search-icon').on('click', function () {
            $(this).find('.search-input').fadeIn();
        });
 

        this.find('.search-input').on('change', function (event) {
                $comp.keywords = this.value;
                $comp.parent.centerList.loadStyle({ keywords: this.value });
        });
        
    };

    __categorySelect(category, $comp, $types) {
        let categoryValue = categoryMapping[category];
        switch (categoryValue) {
            case 0: {
                $.get('/api/center/types', json => {
                    $comp.__renderTypes__(json.result, $types, $comp);
                    $comp.parent.centerList.loadStyle({});
                }); break;
            }
            case 1: {
                $types.html('');
                break;
            }
            case 2: {
                $types.html('');
                $comp.parent.centerList.loadFavouriteStyle();
                break;
            }
            default: break;
        }
    }

    __renderTypes__(data, $types, $comp) {
        $types.empty();

        data.forEach((v1, i) => {
            let $menu = $(
                `<li type=${ v1.name }>
                    ${ v1.name }
                    <ul class="sub classify-sub">
                        ${ v1.children.map(v2 => `<li type=${ v2 }>${ v2 }</li>`).join('')}
                    </ul>
                </li>`);
            $types.append($menu);
        });

        $types.find('li').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let $this = $(this);
            $this.siblings().removeClass('active');
            $this.siblings().find('li').removeClass('active');
            $this.addClass('active');
            $comp.type = $(this).attr('type');
            $comp.parent.find('.center-bottom').hide();
            $comp.parent.centerList.loadStyle({ type: $comp.type, keywords: $comp.keywords });
        });

    }

    render() {
        return $(`
        <div class="search clearfix">
            <div class="search-icon">
                <img src="/static/images/icons/search.svg" alt="">
                <input class="search-input" type="text" placeholder="请输入关键字搜索">
            </div>
            <div class="search-type">
                <ul class="search-tabs">
                    <li class="active">全部</li>
                    <li>我的收藏</li>
                </ul>
            </div>
        </div>
        <div class="classify">
            <ul class="sub-title clearfix">
            </ul>
        </div>
        `);
    }
}
