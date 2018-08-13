'use strict';
import Component from '../Component';
import Modal from '../common/Modal';
import ChooseArticleModal from './ChooseArticleModal';
import ArticleItems from './ArticleItems';

export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'chooseArticleModal'});
        this.unArticlePoints = [];

        this.articleItems = new ArticleItems({
            articleItemsContainer: this,
            wechatId: this.wechatId,
            pointId: this.pointId,
            date: this.date
        });

        this.rendered();
    }

    addUnArticlePoint(point) {
        let index = this.unArticlePoints.findIndex(it => it._id == point._id);
        if (index == -1) {
            this.unArticlePoints.push(point);
            this.flush();
        }
    }

    deleteUnArticlePoint(point) {
        let index = this.unArticlePoints.findIndex(it => it._id == point._id);
        if (index != -1) {
            this.unArticlePoints.splice(index, 1);
            this.flush();
        }
    }

    flush() {
        if (this.unArticlePoints.length == 0) {
            this.articleItems.hiddenAddArticleBtn();
        } else {
            this.articleItems.showAddArticleBtn();
        }
       // $header.setPageTitle(`添加文章列表`);

    }

    rendered(){

        this.renderDatetimePicker();
        this.find(".article-list-items").append(this.articleItems);
        this.find('.prev-page,.icon-back').click(() => {
            window.router.go('/' + this.wechatId);
        });

        let date = this.date;
        let wechatId = this.wechatId;
        $.get('/point/unArticle/list', { date: date, wechatId: wechatId }, json => {
            if (json.status) {
                this.unArticlePoints = json.results;
                this.flush();
            }
        });
    };

    renderDatetimePicker() {
        this.find("#datetimepicker").datetimepicker({
            weekStart: 1,
            todayBtn:  1,
            autoclose: true,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: 'yyyy-mm-dd',
            language: 'cn'
        }).on('changeDate', ev => {
            window.router.go(`/articles/${ this.wechatId }/${ this.pointId }/${ this.formatDate(ev.date)  }`);
        });

        this.find(".time-input").val(this.date);
    }

    formatDate(date){
        let month = date.getMonth() + 1;
        let dateStr = date.getFullYear()+"-"+month+"-"+date.getDate();
        return dateStr;
    }

    openChooseArticleModal() {
        this.modal.$header = $(`<h4>选择文章</h4>`);
        this.modal.$body = new ChooseArticleModal({
            articleItemsContainer: this,
            wechatId: this.wechatId,
            unArticlePoints: this.unArticlePoints,
            date: this.date
        });

        this.modal.open();
    }

    openReplaceArticleModal(point, pointArticle, article) {
        this.modal.$header = $(`<h4>替换文章</h4>`);
        this.modal.$body = new ChooseArticleModal({
            articleItemsContainer: this,
            wechatId: this.wechatId,
            unArticlePoints: this.unArticlePoints,
            date: this.date,
            point: point || {},
            pointArticle: pointArticle || {},
            article: article || {}
        });

        this.modal.open();
    }

    closeChooseArticleModal(){
        this.modal.close();
    }

    render() {
        return $(`
                <div class="article-module">
                    <div class="choose-date">
                       <div class="back-booking">
                             <i class="icon-back fa fa-arrow-circle-o-left"></i>
                             <span class="prev-page">  预定列表</span>
                           <i class="fa  fa-angle-right"></i>
                           <i class="fa fa-calendar"></i>
                           <div class="input-append date" id="datetimepicker"  data-date-format="yyyy-mm-dd" style="display: inline-block">
                                <input class="time-input" type="text" readonly>
                                <span class="add-on"><i class="icon-th"></i></span>
                            </div>
                       </div>

                    </div>
                    <div class="article-list">
                      <div class="article-list-items"></div>
                    </div>
                </div>
        `);
    }
}