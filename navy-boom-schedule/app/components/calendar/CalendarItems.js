'use strict';
import Component from '../Component';
import CalendarItem from './CalendarItem';

export default class extends Component {

    constructor(props) {
        super(props);
        this.wechat = {  };
        this.date = new Date();
        this.$calenderItems = [];
        this.rendered();
    }

    rendered() {
        $.get('/wechat/get/', { wechatId: this.wechatId }, json => {
            if (json.status) {
                this.wechat = json.result;
                this.showCalendar();
                this.setTitle();
            }
        });
        this.find("a[title=上个月]").click(()=> {
            this.goPrevMonth();
        });
        this.find("a[title=下个月]").click(()=> {
            this.goNextMonth();
        });

        $(window).resize(() => {
            this.$calenderItems.forEach(it => it.resize());
        });
    }

    getWeekOfDayFromFirstDayOfMonth() {
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        return new Date(year, month, 1).getDay();
    }

    getCountDaysOfMonth() {
        let year = this.date.getFullYear();
        let month = this.date.getMonth() + 1;
        return new Date(year, month, 0).getDate();
    }

    setPageTitle(title) {
        this.find(".header-right").text(title+" -- 发文预定列表");
    }

    showCalendar(){
        this.setPageTitle(this.wechat.name);
        $.getJSON('/point/list',{ wechatId: this.wechat._id, year: this.date.getFullYear(), month: this.date.getMonth() + 1 }, json => {
            if (json.status) {
                let points = json.results;
                this.__showCalendar__(points);
            }
        });
    }

    __showCalendar__(points){
        this.find(".calendar-items").html('');

        let weekOfFirstDay = this.getWeekOfDayFromFirstDayOfMonth();
        let countDays = this.getCountDaysOfMonth();
        for (let i = 1; i <= countDays; i++) {
            let row = Math.floor(( (weekOfFirstDay + i - 1) / 7 ));
            let col = ((i - 1) % 7 + weekOfFirstDay) % 7;

            let $calendarItem = new CalendarItem({
                currentDay: i,
                row: row,
                col: col,
                date: this.date,
                calendarItems: this,
                wechat: this.wechat,
                points: points[i] || []
            });
            this.find(".calendar-items").append($calendarItem);
            this.$calenderItems.push($calendarItem);

            $calendarItem.resize();
        }
    }

    setTitle() {
        let year = this.date.getFullYear();
        let month = this.date.getMonth() + 1;
        this.find(".year").text(year);
        this.find(".month").text(month);
    }

    goPrevMonth(){
        this.__goMonth__(-1);
    }
    goNextMonth(){
        this.__goMonth__(1);
    }
    __goMonth__(number) {
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let today = this.date.getDate();
        this.date = new Date(year, month + number, today);

        this.showCalendar();
        this.setTitle();
    }

    getYearMonth(){
        let year = this.date.getFullYear();
        let month = this.date.getMonth() + 1;
        return year+"-"+month;
    }

    render() {
        return $(`
           <div class="calendar-container">
                    <div class="calendar-header fixed">
                           <div class="header-handle">
                               <span class="header-left">
                                  <a title="上个月"><i class="fa fa-chevron-left"></i></a>
                                  <span class="title"> <span class="year"></span>年<span class="month"></span>月 </span>
                                  <a title="下个月"><i class="fa fa-chevron-right"></i></a>
                               </span>
                               <span class="header-right"></span>
                           </div>
                           <div class="calendar-week">
                                 <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
                           </div>
                    </div>
                    <div class="calendar-items-warp">
                        <div class="calendar-items"></div>
                    </div>

           </div>

        `);
    }
}