'use strict';
import Component from './Component';
import _ from 'lodash';
import loginUtils from '../utils/loginUtils';
import SyncToolBar from './article/SyncToolBar';
import WxLogin from './WxLogin';


export default class extends Component {
    constructor(props) {
        super(props);

        this.__page__ = 1;
        this.__size__ = 20;
        this.__maxPage__ = 0;

        this.syncToolBar = new SyncToolBar({ columenEditor : this.editor });
        this.articles = [];

        this.rendered();
    }

    __getArticleList__ = callback => {
        $.getJSON('/article/list', {page:this.__page__, size:this.__size__}, result => {
            this.__maxPage__ = result.pagination.maxPage;
            this.articles = result.list;
            callback && callback();
        });
    };

    addArticle = article => {
        if (!article) return;

        let index = this.articles.findIndex(art => art.id == article.id);
        if (index == -1) {
            this.articles.push(article);
            this.$articleList.prepend(this.__build$Article__(article));
        } else {
            $(`#article_${article._id}`).remove();
            this.articles.splice(1, index);
            this.articles.push(article);
            this.$articleList.prepend(this.__build$Article__(article));
        }

        this.__masonry__();
    };



    __buildTitle__ = article => {
        let $articlesTitleBox = $(`<div class="articles-title-box">
                <span class="title">${ article.title }</span>
                <span class="summary">${ article.digest }</span>
        </div>`);
        return $articlesTitleBox;
    };


    __deleteArticle__ = (id) => {
        $.getJSON('/article/delete/' + id, json => {
            $('#article_' + id).remove();
            this.__masonry__();
        });
    };

    __buildHoverMask__ = article => {
        let $articlesHoverMask = $(`<div class="articles-hover-mask"></div>`);
                let $delBtn = $(`<i class="icon articles-del-btn-icon"></i>`);
                this.__popover__($delBtn, {
                    title: ``,
                    content: `<div style="padding:5px 0">确定删除这篇文章吗?</div>`,
                    ok: () => {
                        this.__deleteArticle__(article._id);
                    }
                });
                $articlesHoverMask.append($delBtn);

                let $editBtn = $(`<i class="icon articles-edit-btn-icon"></i>`);
                
                $editBtn.click(() => {
                    this.__showArticle__(article);
                    return false;
                });
                $articlesHoverMask.append($editBtn);
                return $articlesHoverMask;
    }

    __buildArticlesBgBox__ = article => {
        let $articlesBgBox = $(`<div class="articles-bg-box"></div>`);
        let $boxWrap = $(`<div class="images-wrap-box"></div>`);
        $articlesBgBox.css({
            'background': `rgba(0, 0, 0, 0) url("${article.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`
        }).click(() => {
            this.__showArticle__(article);
        });
        $boxWrap.append($articlesBgBox);
        return $boxWrap;
    };

    __showArticle__ = article => {
        $.get('/article/get/' + article._id, json => {
            article.content = json.content;
            this.editor.showArticle(article);
        });
    };

    __build$Article__ = article => {
        let $articlesWrapBox = $(`<div class="articles-wrap-box" id="article_${article._id}"></div>`);
        $articlesWrapBox.append(this.__buildArticlesBgBox__(article));
        $articlesWrapBox.append(this.__buildTitle__(article));
        $articlesWrapBox.append(this.__buildHoverMask__(article));
        return $articlesWrapBox;
    };

    __masonry__() {
        let $editorArticlesContent = this.find('#styles');
        $editorArticlesContent.masonry({
            itemSelector: '.articles-wrap-box',
            columnWidth: 320,
            gutter: 10,
            isFitWidth: true
        });
    }

    __remove__() {
        let $popover = $('.popover.bottom');
        $popover.remove();
    }

    rendered() {
        this.$comp = this;

        $('body').on('click',()=> {
            this.__remove__(); 
        })

        if(!loginUtils.check()) {
            // this.$comp.html(`
            // <div style="text-align: center;">
            //     <br/>
            //     <br/>
            //     <p>您还没有登录</p>
            //     <br/>
            //     <p>请登录体验完整功能</p>
            //     <br/>
            //     <a style="color: #459ae9" href="/login">登录/注册</a>
            // </div>
            // `);
            let wxLogin = new WxLogin();
            this.$comp.html(wxLogin);
            return;
        }

        /**
         * 处理排期工具模块跳转到编辑器的处理
         */
        let search = location.search;
        let params = search.substring(1, search.length).split('&').reduce(function(it1, it2) { var ps = it2.split('='); it1[ps[0]] = ps[1]; return it1 }, {});
        let articleId = params['articleId'];

        let $articleSyncBtn = this.find('.editor-articles-sync');
        $articleSyncBtn.append(this.syncToolBar);

        this.__masonry__();

        let $editorArticlesContent = this.find('#styles');
        this.__getArticleList__(() => {
            this.articles && this.articles.forEach(article => {
                let $article = this.__build$Article__(article);
                $editorArticlesContent.append($article).masonry().masonry('appended', $article);
            });
        });

        this.__scrollRequestMore__();
    }

    __scrollRequestMore__() {
        let $comp = this;
        let $stylesWrapper = this.find('.styles-wrapper');
        let $styles = $(this).find('#styles');
        $stylesWrapper.scroll(function() {
            $comp.__remove__();
            let scrollTop = $(this).scrollTop();
            let windowHeight = $(window).height();
            let scrollHeight = $styles.height();
            if(scrollHeight - windowHeight < scrollTop) {
                if($comp.__maxPage__ <= $comp.__page__) {
                    return;
                }
                $comp.__page__ += 1;
                $comp.__getArticleList__(() => {
                    $comp.articles && $comp.articles.forEach(article => {
                        let $article = $comp.__build$Article__(article);
                        $styles.append($article).masonry().masonry('appended', $article);
                    });
                });
            }
        });
    }

    render() {
        return $(`
            <div class="editor-styles">
                <div class="editor-articles-sync"></div>
                <div class="types">
                    <a href="javascript:;">我的图文</a>
                </div>
                <div class="styles-wrapper">
                    <div id="styles" class="editor-styles-content"></div>
                </div>
            </div>`);
    }
}