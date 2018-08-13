'use strict';
import Component from '../Component';
import ChooseArticleItem from './ChooseArticleItem';

export default class extends Component {
    constructor(props) {
        super(props);

        this.pageSize = 3;
        this.pageNum = 1;
        this.hasNextPage = true;

        this.rendered();
    }

    rendered() {
        this.flush();
        this.find('.left-btn').click(() => {
            if (this.pageNum > 1) {
                this.pageNum -= 1;
                this.flush();
            }
        });
        this.find('.right-btn').click(() => {
            if (this.hasNextPage) {
                this.pageNum += 1;
                this.flush();
            }
        });
    }

    hideBtn() {
        this.find('.left-btn').hide();
        this.find('.right-btn').hide();
    }

    showBtn() {
        this.find('.left-btn').show();
        this.find('.right-btn').show();
    }

    flush() {
        $.get('/article/list', { pageSize: this.pageSize, pageNum: this.pageNum }, json => {
            if (json.status) {
                let articles = json.results;
                this.hasNextPage = this.pageSize == articles.length;

                if ((!articles || articles.length == 0) && this.pageNum == 1 ) {
                    this.hideBtn();
                    this.chooseArticleModal.hideFooter();
                    $articleLists.html(`<div>您还没有写过文章,赶紧前往<a href="http://editor.brainboom.cn/">编辑器</a>添加文章吧!</div>`);
                } else if (articles && articles.length != 0){
                    let $articleLists = this.find(".article-lists").html('');
                    articles.forEach(article => {
                        $articleLists.append(new ChooseArticleItem({
                            chooseArticleItems: this,
                            article: article
                        }));
                    });

                    this.chooseArticleModal.showFooter();
                    this.showBtn();
                }
            } else {
                $articleLists.text('很抱歉。系统内部错误导致查询文章失败,请联系管理员。');
            }
        });
    }

    render() {
        return $(`
           <div class="choose-article-body">
                <span class="left-btn">
                    <i class="fa fa-chevron-circle-left"></i>
                </span>
                <div class="article-lists">
                </div>
                <span class="right-btn">
                    <i class="fa fa-chevron-circle-right"></i>
                </span>
           </div>
        `);
    }
}