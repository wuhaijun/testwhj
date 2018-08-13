'use strict';
import Component from '../Component';

export default class extends Component {

    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered() {
        this.find(".img-box").html(`<span class="img" style="background: url(${this.article.cover}) center center / cover no-repeat scroll rgba(0, 0, 0, 0);"></span>`);
        this.find(".title").text(this.article.title);

        this.click(() => {
            this.addClass("active").siblings().removeClass("active");
            this.chooseArticleItems.chooseArticleModal.selectArticle(this.article);
        });
    }

    render() {
        return $(`
           <div class="article-list-item">
               <div class="checked"><i class="fa fa-check"></i></div>
                <div class="img-box"></div>
                <div class="title">
                </div>
           </div>
        `);
    }
}