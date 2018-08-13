'use strict';
import Component from './../../Component';
import PointLocationMap from '../../../../common/PointLocationMap';

export default class extends Component {
    constructor(props) {
        super(props);
        this.articles = [];
        this.selectedArticleId = [];
        this.rendered();
    }

    __swap__ = (index1, index2) => {
        if (index1 < 0 || index2 > this.selectedArticleId.length - 1) return;
        let arr = [...this.selectedArticleId];
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];

        this.selectedArticleId = arr;
    };

    __buildArticleList__ = (point, pointArticle, article) => {
        let $tags = (pointArticle.tags || []).map(tag => `<span class="s-tag">${ tag }</span>`).join("");
        let $article = $(
            `<div class="item" id="${ article._id }">
                 <div class="article-message">
                    <p class="article-title">${ article.title } </p>
                    <p class="article-time">${ article.lastUpdated.substr(0, 10) }  <span class="pointer">${ PointLocationMap[point.location] }</span></p>
                 </div>
                 <div class="article-pic">
                     <img src="${ article.cover }" alt="">
                 </div>
                 <div class="tags">${ $tags }</div>
            </div>`
        );

        return $article.click(()=> {
            if (!article.cover) {
                alert('抱歉,没有封面的文章不能被同步至公众号!');
            } else {
                let index = this.selectedArticleId.findIndex(it => it == article._id);
                if (index < 0) {
                    this.selectedArticleId.push(article._id);
                    this.__cloneArticle__(article);
                }
            }
        });
    };

    __cloneArticle__ = (article) => {
        let $operator = $(`<div class="selected-item-operator"></div>`);
        let $remove = $(`<i class="fa fa-trash fa-2x"></i>`).appendTo($operator);
        let $moveUp = $(`<i class="fa fa-arrow-up fa-2x"></i>`).appendTo($operator);
        let $moveDown = $(`<i class="fa fa-arrow-down fa-2x"></i>`).appendTo($operator);

        let $this = this;
        let $item = $(
                `<div class="selected-item" id="right${ article._id }">
                    <div class="img">
                        <img src="${ article.cover }" alt="">
                    </div>
                    <div class="title">
                        ${ article.title }
                    </div>
                </div>
            `)
            .append($operator)
            .hover(function() {
            $(this).find('.selected-item-operator').addClass('active');

            let index = $this.selectedArticleId.findIndex(it => it == article._id);
            if (index != 0) {
                $moveUp.show();
            } else {
                $moveUp.hide();
            }

            if (index + 1 < $this.selectedArticleId.length) {
                $moveDown.show();
            } else {
                $moveDown.hide();
            }
        }, function() {
            $(this).find('.selected-item-operator').removeClass('active');
        });

        let $rightArticleList = this.find('.selected-article-list');
        $rightArticleList.append($item);

        // 自动滚动
        let scrollHeight = $rightArticleList[0].scrollHeight;
        let clientHeight = $rightArticleList[0].clientHeight;
        if (clientHeight < scrollHeight) {
            $rightArticleList.animate({ scrollTop: scrollHeight }, 800);
        }

        $remove.click(() => {
            $item.hide('fast', () => {
                let index = this.selectedArticleId.findIndex(it => it == article._id);
                this.selectedArticleId.splice(index, 1);
                $item.remove();
            });
        });

        $moveUp.click(() => this.__upOrDown__($item, $item.prev(), article._id, 1));
        $moveDown.click(() => this.__upOrDown__($item, $item.next(), article._id, -1));
    };

    //alpha: up = 1, down = -1
    __upOrDown__ = ($current, $target, articleId, alpha) => {
        let index = this.selectedArticleId.findIndex(it => it == articleId);
        this.__swap__(index, index + (-1 * alpha));

        $target.css({"opacity": "0.5"}).animate({ top: (1* alpha) * $current.outerHeight(true)});
        $current.css({"opacity": "0.5"}).animate({ top: (-1 * alpha) * $target.outerHeight(true)}, () => {
            $current[alpha == 1 ? 'insertBefore' : 'insertAfter']($target).css({top: 0, "opacity": "1"});
            $target.css({top: 0, "opacity": "1"});
        });

        $current.find('.selected-item-operator').removeClass('active');
    };


    rendered = () => {
        let $leftArticleList = this.find('.left-list');
        (this.pointArticles || []).forEach(pointArticle => {
            $leftArticleList.append(this.__buildArticleList__(pointArticle.point || {}, pointArticle.pointArticle || {}, pointArticle.article || {}));
        });
    };

    render() {
        return $(`
           <div class="left col col-md-5">
                <div class="left-list">

                </div>
           </div>

           <div class="middle col col-md-1">
                 <i class="fa fa-angle-right"></i>
           </div >


           <div class="right col col-md-6">
                <div class="selected-article-list">

                </div>
           </div>
        `);
    }
}










