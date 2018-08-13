'use strict';
import Component from '../Component';
import { isFunction } from '../../../common/TypeUtils';
import ChooseArticleItems from './ChooseArticleItems';
import PointLocationMap from '../../../common/PointLocationMap';

export default class extends Component {
    constructor(props) {
        super(props);
        this.selectedArticle =  { };
        this.tags = [];

        this.__popover__(this.find('.add-tag'), {
            title: `新建标签`,
            content: `<input type="text" class="add-tag-input" value=''>`,
            ok: ($popover, callback) => {
                let tagName = $popover.find('.add-tag-input').val();
                //console.log("this.tags:"+this.tags);
                this.__addTags__(tagName, callback);
            }
        });

        this.rendered();
    }

    selectArticle(article) {
        this.selectedArticle = article;
    }

    toggleTag(tagName) {
        let index = this.tags.findIndex(it => it == tagName);
        if (index == -1) {
            this.tags.push(tagName);
            if(this.tags.length == 3) {
                this.find('.add-tag').hide();
            }
        } else {
            this.tags.splice(index, 1);
            if(this.tags.length < 3) {
                this.find('.add-tag').show();
            }
        }

    }

    addPointArticle(pointId) {
        if (this.selectedArticle && this.selectedArticle._id) {
            let pointArticle = {  };
            pointArticle.articleId = this.selectedArticle._id;
            pointArticle.pointId = pointId;
            pointArticle.wechatId = this.wechatId;
            pointArticle.publishDate = this.date;
            pointArticle.tags = this.tags;

            $.post('/pointArticle/add', pointArticle, json => {
                if (json.status) {
                    let result = json.result;
                    this.articleItemsContainer.articleItems.addPointArticle(result);
                    this.articleItemsContainer.closeChooseArticleModal();
                }
            });
        }
    }

    hideFooter() {
        this.find('.pinter-info').hide();
    }

    showFooter() {
        this.find('.pinter-info').show();
    }

    rendered() {
        let $articleBody = this.find(".article-list-modal");
        let $chooseArticleList =  new ChooseArticleItems({ chooseArticleModal: this });
        $chooseArticleList.appendTo($articleBody);

        let $cancle = this.find(".cancel");
        let $commit = this.find(".commit");
        let $select = this.find('#select-main');

        $commit.click(() => {
            this.addPointArticle($select.val());
        });
        $cancle.click(()=> {
            this.articleItemsContainer.closeChooseArticleModal();
        });

        // 替换进入
        if (this.point) {
            $select.append(`<option value="${ this.point._id }">${PointLocationMap[this.point.location]}</option>`);
            $select.attr('disabled', true);

        // 添加文章进入
        } else {
            this.unArticlePoints.forEach(point => {
                if(!!location.pathname.split("/")[3] && location.pathname.split("/")[3] == point._id ){
                    $select.append(`<option value="${ point._id }" selected>${PointLocationMap[point.location]}</option>`);
                    $select.attr('disabled', false);
                }else{
                    $select.append(`<option value="${ point._id }" >${PointLocationMap[point.location]}</option>`);
                    $select.attr('disabled', false);
                }

            });
        }

        // 替换文章进入
        ((this.pointArticle||{} ).tags || []).forEach(tag => {
            this.__addTags__(tag);
        });
        this.selectArticle(this.article || {});
    }

    __addTags__ (tagName, callback) {
        if (tagName && tagName.trim() && tagName.trim().length < 7) {
            let $showTag = this.find(".show-tag");
            let $newTag = $(`<span class="s-tag">${tagName} </span>`);
            let $delete = $(`<i class="fa fa-times delete" title="删除"></i>`);
            $delete.click(() => {
                $newTag.remove();
                this.toggleTag(tagName);
            });
            this.toggleTag(tagName);

            let index = this.tags.findIndex(it => it == tagName);
            if(index != -1){
                $newTag.append($delete);
                $showTag.prepend($newTag);
            }else{
                this.message.warn('标签不能重复');
            }

            if (isFunction(callback)) callback();
        } else {
            this.message.warn('标签为1~6个字符');
        }

    }

    render() {
        return $(`
           <div class="choose-article">
                    <div class="header-title">选择你要添加的图文</div>
                    <div class="article-list-modal"></div>
                    <div style="clear:both;"></div>
                    <div class="footer">
                        <div class="choose-article-footer">
                            <div class="pinter-info">
                                <span class="pointer-text">文章点位</span>
                                <span class="show-pointer">
                                    <select id="select-main" name="location"></select>
                                </span>
                                <span class="tag-text">为该篇文章打标签</span>
                                <span class="show-tag">
                                     <i class="fa fa-plus-circle add-tag"></i>
                                </span>
                            </div>
                            <div class="control-modal">
                                 <span class="cancel">取消</span>
                                 <span class="commit">确定</span>
                            </div>
                   </div>
                    </div>

           </div>
        `);
    }
}