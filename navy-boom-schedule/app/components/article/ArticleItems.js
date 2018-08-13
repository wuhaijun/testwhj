'use strict';
import _ from 'lodash';
import Component from '../Component';
import Modal from '../common/Modal';
import { isFunction } from '../../../common/TypeUtils';
import ArticleItem from './ArticleItem';
import SyncArticleBody from '././sync/SyncArticleBody';
import BindWechatBody from '././sync/BindWechatBody';
import ConfirmBindWechatBody from '././sync/ConfirmBindWechatBody';
import { isSupplier, isAgent } from '../../../common/AccountUtils';

export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'syncManagementModal'});
        this.results = [];

        this.$addBtn = null;
        this.$syscBtn = null;

        this.rendered();
    }

    addPointArticle(pointArticle) {
        let index = this.results.findIndex(it => it._id == pointArticle._id);
        if (index != -1) {
            this.results.splice(index, 1);
        }
        this.results.push(pointArticle);
        this.__flush__();
        this.articleItemsContainer.deleteUnArticlePoint(pointArticle.point);
    }

    deletePointArticle(pointArticle, point) {
        let index = this.results.findIndex(it => it._id == pointArticle._id);
        if (index != -1) {
            this.results.splice(index, 1);
            this.__flush__();
            this.articleItemsContainer.addUnArticlePoint(point);
        }
    }

    hiddenAddArticleBtn() {
        this.$addBtn.addClass('hidden');
        this.$syscBtn.addClass('mid');
    }

    showAddArticleBtn() {
        this.$addBtn.removeClass('hidden');
        this.$syscBtn.removeClass('mid');
    }

    hiddenSyncArticleBtn() {
        this.$syscBtn.addClass('hidden');
        this.$addBtn.addClass('mid');
    }

    showSyncArticleBtn() {
        this.$syscBtn.removeClass('hidden');
        this.$addBtn.removeClass('mid');
    }

    __flush__() {

        let $$articles = this.find('.articles');
        $$articles.html('');

        let $articles = $(`<div class="article-wrap"></div>`).appendTo($$articles);
        this.results.forEach(result => {
            $articles.append(new ArticleItem({ articleItems: this, article: result.article || {}, point: result.point || {}, pointArticle: result.pointArticle || {} }));
        });
        this.results.length != 0 ? this.showSyncArticleBtn() : this.hiddenSyncArticleBtn();
    }

    flush(wechatId, date) {
        $.get('/pointArticle/list', { wechatId, date }, json => {
            if (json.status) {
                this.results = json.results;
                let unArticlePoints = json.pointIds;
                this.__flush__();

                let $tips = $(`<div style="text-align: center;margin-top:80px">没有数据</div>`);
                if(this.results.length == 0 && unArticlePoints.length == 0 ){
                    this.find(".article-single-item").html('');
                    this.find(".article-single-item").append($tips);
                }
            }
        });
    }

    rendered(){
        this.flush(this.wechatId, this.date);

        this.$addBtn = this.find('.add-article-btn').click(() => {
            this.articleItemsContainer.openChooseArticleModal();
        });
        this.$syscBtn = this.find('.sync-article-btn').click(() => {
            this.confirmBind(() => {
                this.modal.$header = $(`<h4>同步文章</h4>`);
                this.modal.open();
            });
        });

        let exchange = (attr, $this) => {
            let html = $this.html();
            $this.html($this.data(attr));
            $this.data(attr, html);
        };
        this.find('[data-text]').hover(function() {
            exchange('text', $(this));
        }, function() {
            exchange('text', $(this));
        });

        if (!isAgent(account, this.wechatId)) {
            this.hiddenSyncArticleBtn();
        }
    };

    __goSync__ = (mplist) => {
        this.modal.$body = new SyncArticleBody({ mplist: mplist, wechatId: this.wechatId, date: this.date, pointArticles: this.results });
        this.modal.flush();
    };


    confirmBind = (callback) => {
        $.get('/wechat/mplist', json => {
            if (json.status) {
                let mplist = json.results;
                if (mplist.length == 0) {
                    this.__openGoBind__();
                } else {
                    this.__goSync__(mplist);
                }
                isFunction(callback) && callback();
            }
        });
    };


    __openGoBind__ = () => {
        this.modal.$body = new BindWechatBody({ parent: this });
        this.modal.flush();
    };

    goConfirmBindWechat = () => {
        this.modal.$body = new ConfirmBindWechatBody({ parent: this });
        this.modal.flush();
    };


    render() {
        return $(`
            <div>
                <div class="article-single-item article-operator" style="position: relative">
                    <div class="add-article-btn ctrl-btn" data-text="添加文章"><i class="fa fa-plus fa-2x"></i></div>
                    <div class="sync-article-btn ctrl-btn" data-text="同步文章"><i class="fa fa-paper-plane fa-2x"></i></div>
                </div>
                <div class="articles"></div>
            </div>`
        );
    }
}