'use strict';
import Component from '../Component';
import copyHtml from '../common/CopyUtil';
import Message from '../common/Message';
const message = new Message();

const categoryMapping = {
    "全部": 0, "模板推荐": 1, "我的收藏": 2
}
export default class extends Component {
    constructor(props) {
        super(props);
        this.starImg = "/static/images/icons/like_nor.svg";
        this.starSelectedImg = "/static/images/icons/like_press.svg";
        this.favouriteImg = "/static/images/icons/collect_nor.svg";
        this.favouriteSelectedImg = "/static/images/icons/collect_press.svg";
        this.limit = 20;
        this.skip = 20;
        this.total = 0;
        this.canScroll = true;
        this.rendered();
    }

    rendered = () => {
    };

    loadStyle(query = { type: null, category: null, limit: 20, skip: 0, keywords: null }, reload = true) {
        let queryStr = "?"
        this.canScroll = true;
        if (query.type) queryStr += "type=" + query.type + "&";
        if (query.category) queryStr += "category=" + query.category + "&"
        if (query.limit) queryStr += "limit=" + query.limit + "&"
        if (query.skip) queryStr += "skip=" + query.skip + "&"
        if (query.keywords) queryStr += "keywords=" + query.keywords + "&"
        if (reload) this.empty();
        let $styles = $('#styles');
        $styles.masonry({
            itemSelector: '.box',
            columnWidth: 320,
            gutter: 10,
            isFitWidth: true,
            horizontalOrder: true
        });
        $.get('/api/center/styles' + queryStr, json => {
            this.total = json.total;
            let $boxes = "";
            json.styles.forEach(it => {
                let $box = this.___renderStyle__(it);
                $styles.append($box).masonry().masonry('appended', $box);
            });
            $styles.imagesLoaded().progress(function (imgLoad , image) {
                $styles.masonry().masonry('reloadItems')
            });
        });
    }

    loadFavouriteStyle() {
        this.empty();
        this.canScroll = false;
        let $styles = $('#styles');
        $styles.masonry({
            itemSelector: '.box',
            columnWidth: 320,
            gutter: 10,
            isFitWidth: true
        });
        $.get('/api/center/favourite', json => {
            if (!json.status) return;
            json.styles.forEach(it => {
                let box = this.___renderStyle__(it);
                $styles.append(box).masonry().masonry('appended', box);
            });
        });
    }

    ___renderStyle__(v) {
        let starComp = "";
        if (this.canScroll) {
            starComp = `<img class="copy" styleId="${v._id}"  src="/static/images/icons/copy.svg" alt="">`
        }
        let $style = $(
            `<div class="box">
                <div class="style">
                    <div id=${v._id}>
                    ${v.html}
                    </div>
                    <div class="mask"></div>
                </div>
                <div class="footer">
                    <!--<div>${v.platform}</div>-->
                    <div>
                        <img class="copy" styleId="${v._id}"  src="/static/images/icons/copy.svg" alt="" data-toggle="tooltip" data-placement="left" title="复制, 然后直接黏贴到编辑器中使用" >
                        <img class="collect" styleId="${v._id}" favouriteId="${v.favouriteId}" favourite=${v.favourite} src="${v.favourite ? this.favouriteSelectedImg : this.favouriteImg}" alt="" data-toggle="tooltip" data-placement="left" title="收藏, 可至[我的收藏]中使用">
                        <span class="collect-num">${ v.favouriteCount || 0}</span>
                    </div>
                </div>
            </div>`
        );

        $style.find('[data-toggle="tooltip"]').tooltip()

        $style.find('.copy').on('click', function () {
            if (time) {
                clearTimeout(time);
            }
            $(this).addClass('active');
            let time = setTimeout(() => { $(this).removeClass('active'); }, 2000);
            let $styleHtml = $style.find('.mask').prev();
            copyHtml('.copy', $styleHtml.html());
            let styleId = $(this).attr('styleId');
            $.post('/api/center/copy', { styleId }, json => { });

        });

        $style.find('.collect').on('click', function () {
            let styleId = $(this).attr('styleId');
            let favouriteCount = parseInt($(this).next().html());
            let html = $(`#${styleId}`).html();
            let favouriteId = $(this).attr('favouriteId');

            if ($(this).attr('favourite') === 'true') {
                $.get('/api/collect/delete?id=' + favouriteId, json => {
                    if (json.status) {
                        $(this).attr('src', '/static/images/icons/collect_nor.svg');
                        $(this).attr('favourite', false);
                        favouriteCount -= 1;
                        $(this).next().html(favouriteCount);
                    }
                })
            } else {
                $.post('/api/center/favourite', { styleId, html }, json => {
                    if (json.status) {
                        $(this).attr('src', '/static/images/icons/collect_press.svg');
                        $(this).attr('favourite', true);
                        $(this).attr('favouriteId', json.favouriteId);
                        favouriteCount += 1;
                        $(this).next().html(favouriteCount);
                        message.success('已收藏，可至“编辑器-我的收藏”中使用');
                    }
                });
            }

        });
        return $style;
    }

    render() {
        return $(`
            <div id="styles">
            </div>
        `);
    }
}
