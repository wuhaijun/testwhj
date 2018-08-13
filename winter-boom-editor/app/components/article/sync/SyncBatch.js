'use strict';

import Component from './../../Component';
export default class extends Component {
    constructor(props) {
        super(props);

        this.page = 1;
        this.size = 3;
        this.choseArticleArray = [];

        this.rendered();
    }

    returnSelected = () => {
        return this.choseArticleArray;
    };

    __articleList__ = (page, size, callback = () => {}) => {
        $.getJSON('/article/list', {page: page, size: size}, list => {
            callback && callback(list.pagination);

            _.each(list.list, c => {
                let li = $(`<li id="${c._id}" class="wechat-li-article"><i class="checked-icon"></i></li>`).click(e => {
                    if (!!c.cover) {
                        if (li.hasClass("checked")) {
                            li.removeClass("checked");
                            let index = this.choseArticleArray.findIndex(it => it == c._id);
                            this.choseArticleArray.splice(index, 1);
                        } else {
                            li.addClass("checked");
                            this.choseArticleArray.push(c._id);
                        }
                    } else {
                        alert("暂时不能同步没有封面图的文章,请返回给文章添加封面图。");
                    }
                });

                if (this.choseArticleArray.indexOf(c._id) != -1) {
                    li.addClass('checked');
                }
                li.appendTo("#choseSyncArticle");

                let $bgImage = $(` <span class="bgimg" ></span>`).css({
                    'background': `rgba(0, 0, 0, 0) url("${c.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`
                });

                let $details = $(`<div class="article-title">${c.title}</div>
                                  <div class="update-time">${c.lastUpdated.substr(0, 10)}</div>`);

                li.append($bgImage);
                li.append($details);

            });
        });

    };


    rendered = () => {
        let $prev = this.find(".pagination-icon.left");
        let $next = this.find(".pagination-icon.right");

        let callback = (pagination) => {
            pagination.hasPrev ? $prev.addClass('active') : $prev.removeClass('active');
            pagination.hasNext ? $next.addClass('active') : $next.removeClass('active');
        };

        this.__articleList__(1, this.size, callback);

        $next.click(() => {
            if ($next.hasClass('active')) {
                this.page = this.page + 1;
                this.find("#choseSyncArticle").html('');
                this.__articleList__(this.page, this.size, callback);
            }
        });


        $prev.click(() => {
            if ($prev.hasClass('active')) {
                this.page = this.page - 1;
                this.find("#choseSyncArticle").html('');
                this.__articleList__(this.page, this.size, callback);
            }
        });

    };


    render() {
        return $(`
                     <div class="go-sync-container">
                        <div>
                            <ul id="choseSyncArticle" class="choseArticle">
                            </ul>
                            <span class="pagination-icon left"><i class="pagination-icon-left"></i></span>
                            <span class="pagination-icon right"><i class="pagination-icon-right"></i></span>
                        </div>
                     </div>
        `);
    }
}










