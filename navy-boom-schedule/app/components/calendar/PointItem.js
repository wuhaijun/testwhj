'use strict';
import Component from '../Component';
import ArticleItemsContainer from '../article/ArticleItemsContainer';
import CalendarItem from './CalendarItem';
import PointLocationMap from '../../../common/PointLocationMap';


export default class extends Component {

    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered() {
        this.find(".location").text(this.point.location);
        this.find(".supplier").text(this.point.supplier && this.point.supplier.nickname);
        this.find(".title").text(this.point.title);

        this.click(() => {
            window.router.go(`/articles/${ this.wechat._id }/${ this.point._id }/${ this.date }`);
        });

        this.find('[data-toggle="tooltip"]').tooltip();

        let $this = this;
        this.find('.point-item').hover(function (){
            $(this).addClass('active');
            $this.addClass('active');
        }, function() {
            $(this).removeClass('active');
            $this.removeClass('active');
        });

        this.find('.point-item i').click((e) => {
            if (window.confirm('是否确定删除该预定信息?')) {
                $.post('/point/delete', { _id: $this.point._id }, json => {
                    if (json.status) {
                        $this.pointItems.calendarItem.deletePoint($this.point);
                    }
                })
            }
            e.stopPropagation();
        });

        if (this.point.hasArticle) {
            this.addClass('has-article');
        } else {
            this.removeClass('has-article');
        }
    }

    render() {
        return $(
            `<div class="point-item-wrap">
                <div class="point-item">
                      <span class="location"> </span>
                      <span class="supplier"> </span>
                      <i class="fa fa-times"></i>
                </div>
                <div class="point-item-detail">
                      <div><span>点位: </span><span class="location"></span></div>
                      <div><span>供应商: </span><span class="supplier"></span></div>
                      <div><span>标题: </span><span class="title"> </span></div>
                </div>
             </div>`
        );
    }
}