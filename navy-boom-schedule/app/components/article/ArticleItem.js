'use strict';
import Component from '../Component';
import Modal from '../common/Modal';
import { isFunction } from '../../../common/TypeUtils';
import Preview from './Preview';
import moment from 'moment';
import PointLocationMap from '../../../common/PointLocationMap';

export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'previewModal'});

        this.rendered();
    }

    rendered() {
        this.find(".author").text(this.article.author + ' , ' + this.__lastUpdateDate__());
        this.find(".title").text(this.article.title);
        this.find(".pinter").text(PointLocationMap[this.point.location]);
        this.find(".bg-img").html(`<span class="img-item" style="background: url(${this.article.cover}) center center / cover no-repeat scroll rgba(0, 0, 0, 0);"></span>`);

        let $tags = this.find('.tags');
        let tags = this.pointArticle.tags || [];
        tags.forEach(tag => {
            $tags.append(`<span class="s-tag">${ tag }</span>`);
        });

        // 删除
        let $deleteArticle = this.find('.delete-article');
        this.__popover__($deleteArticle, {
            title: '',
            placement: 'top',
            content: `<div style="padding:5px 0">确定删除此素材吗?</div>`,
            ok: ($popover, callback) => {
                $.post('/pointArticle/delete', { _id: this.pointArticle._id }, json => {
                    if (json.status) {
                        this.articleItems.deletePointArticle(this.pointArticle, this.point);
                    }
                });
                isFunction(callback) && callback();
            }
        });

        // 修改
        let $update = this.find('.change-article');
        $update.click(() => {
            window.open(window.config.EDITOR + '?articleId=' + this.article._id);
        });

        // 预览
        let $preview = this.find(".preview-article");
        $preview.click(() => {
            this.modal.$body = new Preview({ parent: this, article: this.article });
            this.modal.open();
        });

        // 替换
        let $replace = this.find('.replace-article');
        $replace.click(() => {
            this.articleItems.articleItemsContainer.openReplaceArticleModal(this.point, this.pointArticle, this.article);
        });

        this.find('[data-toggle="tooltip"]').tooltip();
    }

    __lastUpdateDate__() {
        let pointArticleDate = this.pointArticle.lastUpdated;
        let articleDate = this.article.lastUpdated;
        let date = pointArticleDate > articleDate ? pointArticleDate : articleDate;
        return moment(date).format('YYYY-MM-DD HH:mm');
    }

    render() {
        return $(`
           <div class="article-single-item">
                <div class="top-wrap">
                    <div class="bg-img"></div>
                </div>
                <div class="mid-content" style="padding: 10px;">
                    <div class="title" style="font-size: 16px; font-weight: bold"></div>
                    <div class="author"></div>
                    <div class="update-time"></div>
                    <div class="tips">
                        <span class="text">点位: </span><span class="pinter"> </span>
                    </div>
                    <div class="tags">
                    </div>
                </div>
                <div class="tool-footer">
                    <div class="child s-elevation preview-article"><i class="fa fa-eye" data-toggle="tooltip" data-placement="top" title="预览"></i></div>
                    <div class="child s-elevation change-article"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="修改"></i></div>
                    <div class="child s-elevation replace-article"><i class="fa fa-exchange" data-toggle="tooltip" data-placement="top" title="替换"></i></div>
                    <div class="child s-elevation delete-article"><i class="fa fa-trash-o" data-toggle="tooltip" data-placement="top" title="删除"></i></div>
                </div>
           </div>
        `);
    }
}