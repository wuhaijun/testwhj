'use strict';

import Component from './../../Component';
export default class extends Component {
    constructor(props) {
        super(props);
        this.articles = [];
        this.selectedArticleId = [];
        this.rendered();
    }

    returnSelected = () => {
        return this.selectedArticleId;
    };

    __hasUpBtnIcon__ = (section, $moveUp) => {
        let prevDom = section.prev();
        if (prevDom.length < 1) {
            $moveUp.hide();
        } else {
            $moveUp.show();
        }
    };

    __hasDownBtnIcon__ = (section, $moveDown) => {
        let nextDom = section.next();
        if (nextDom.length < 1) {
            $moveDown.hide();
        } else {
            $moveDown.show();
        }
    };

    __swapItems__ = (arr, index1, index2) => {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];

        this.selectedArticleId = arr;
        return arr;
    };

    __upRecord__ = (arr, $index) => {
        if ($index == 0) {
            return;
        }
        this.__swapItems__(arr, $index, $index - 1);
    };

    __downRecord__ = (arr, $index) => {
        if ($index == arr.length - 1) {
            return;
        }
        this.__swapItems__(arr, $index, $index + 1);
    };

    __getArticleList__ = (callback) => {
        $.getJSON('/article/list', result => {
            this.articles = result.list;
            callback && callback();
        });
    };

    __buildArticleList__ = (article) => {
        return $(`<div class="item" id="${article._id}">
                                 <div class="article-message">
                                           	<p class="article-title">${article.title} </p>
					                        <p class="article-time">${article.lastUpdated.substr(0, 10)}</p>
                                 </div>
                                 <div class="article-pic">
                                     <img src="${article.cover}" alt="">
                                 </div>
        </div>`).click(()=> {
            if (!!article.cover) {
                let index = $.inArray(article._id, this.selectedArticleId);
                if (index < 0) {
                    this.selectedArticleId.push(article._id);
                    this.__cloneArticle__(article);
                    let topPositon = $('.selected-article-list')[0].scrollHeight;
                    if ($('.selected-article-list')[0].clientHeight < topPositon) {
                        $(".selected-article-list").animate({scrollTop: topPositon}, 800);
                    }
                }
            } else {
                alert("没有封面图");
            }
        });
    };

    __cloneArticle__ = (article) => {
        let $operation = $(`<div class="operation"></div>`);
        let $remove = $(`<a href="javascript:;" title="删除文章" class="remove"><i class="fa fa-trash"></i></a>`);
        let $moveUp = $(`<a href="javascript:;" title="向上移动" class="move-up"><i class="fa fa-arrow-up"></i></a>`);
        let $moveDown = $(`<a href="javascript:;" title="向下移动" class="move-down"><i class="fa fa-arrow-down"></i></a>`);
        $operation.append($remove);
        $operation.append($moveUp);
        $operation.append($moveDown);

        let $item = $(`<div class="selected-item" id="right${article._id}">
                                <div class="img">
                                    <img src="${article.cover}" alt="">
                                </div>
                                <div class="title">
                                    ${article.title}
                                </div>
        </div>`).hover(() => {
            this.__hasUpBtnIcon__($("#right" + article._id), $moveUp);
            this.__hasDownBtnIcon__($("#right" + article._id), $moveDown);
        }, () => {
        });

        let $rightArticleList = this.find('.selected-article-list');
        $rightArticleList.append($item);
        $item.append($operation);

        $remove.click(() => {
            $("#right" + article._id).hide('fast', () => {
                let index = this.selectedArticleId.findIndex(it => it == article._id);
                this.selectedArticleId.splice(index, 1);
                $("#right" + article._id).remove();
            });
        });

        $moveUp.click(() => {
            let arr = this.selectedArticleId;
            let $index = this.selectedArticleId.findIndex(it => it == article._id);
            this.__upRecord__(arr, $index);

            let lastSection = $("#right" + article._id);
            let prevDom = lastSection.prev();
            prevDom.css({"opacity": "0.5"}).animate({top: lastSection.outerHeight(true)});
            lastSection.css({"opacity": "0.5"}).animate({top: -prevDom.outerHeight(true)}, () => {
                lastSection.insertBefore(prevDom).css({top: 0, "opacity": "1"});
                prevDom.css({top: 0, "opacity": "1"});
            });
        });

        $moveDown.click(() => {
            let arr = this.selectedArticleId;
            let $index = this.selectedArticleId.findIndex(it => it == article._id);
            this.__downRecord__(arr, $index);
            let lastSection = $("#right" + article._id);
            let nextDom = lastSection.next();
            nextDom.css({"opacity": "0.5"}).animate({top: -lastSection.outerHeight(true)});
            lastSection.css({"opacity": "0.5"}).animate({top: nextDom.outerHeight(true)}, () => {
                lastSection.insertAfter(nextDom).css({top: 0, "opacity": "1"});
                nextDom.css({top: 0, "opacity": "1"});
            });
        });
    };


    rendered = () => {
        let $leftArticleList = this.find('.left-list');
        this.__getArticleList__(() => {
            this.articles && this.articles.forEach(article => {
                $leftArticleList.append(this.__buildArticleList__(article));
            });
        });
    };

    render() {
        return $(`
           <div class="left col col-md-5">
                <div class="left-list">

                </div>
           </div>

           <div class="middle col col-md-1">
                 <i class="fa fa-chevron-right fa-3x"></i>
           </div >


           <div class="right col col-md-6">
                <div class="selected-article-list">

                </div>
           </div>
        `);
    }
}










