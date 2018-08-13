'use strict';
import Component from '../Component';
import Modal from '../common/Modal';
import AddPointModal from './AddPointModal';
import PointItems from './PointItems';
import PointLocationMap from '../../../common/PointLocationMap';
import { isSupplier, isAgent } from '../../../common/AccountUtils';

let showMore = false;
export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'addPointModal'});
        this.pointItems = null;
        this.unAddedLocations = [];
        this.startIndex = 0;
        this.showCount = 3;
        this.showPoints = [];
        this.rendered();
        this.addToolTip();
    }

    rendered() {
        let locations = this.points.map(it => it.location);
        this.unAddedLocations = Object.keys(PointLocationMap).filter(it => locations.indexOf(it) == -1);
        this.__flush__();
    }

    resize() {
        let width = this.width();
        let offsetTop = this.row * width;
        let offsetLeft = this.col * width;
        this.css('top', offsetTop);
        this.css('left', offsetLeft);
        this.css('height', width);
    }

    addPoint(point) {
        if (point && point._id) {
            this.points.push(point);
            let index = this.unAddedLocations.indexOf(point.location);
            if (index != -1) {
                this.unAddedLocations.splice(index, 1);
            }
            this.__flush__();
        }
    }

    deletePoint(point) {
        let index = this.points.findIndex(it => it._id == point._id);
        if (index != -1) {
            this.points.splice(index, 1);
            index = this.unAddedLocations.indexOf(point.location);
            if (index == -1) {
                this.unAddedLocations.push(point.location);
            }
            this.__flush__();
        }
    }

    __flush__() {
        this.html('');
        //this.points.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        let $day = $('<span class="current-day"></span>').appendTo(this);
        $day.text(this.currentDay);

        if (this.unAddedLocations.length != 0 && isAgent(account, this.wechat._id)) {
            let $addPoint = null;
            if (this.points.length == 0) {
                $addPoint = $(
                    `<div class="calendar-item-cover">
                        <i class="fa fa-plus-circle fa-3x" data-toggle="tooltip" data-placement="top" title="添加预定"></i>
                    </div>`);
            } else {
                $addPoint = $(`<i class="fa fa-plus-circle fa-2x" data-toggle="tooltip" data-placement="left" title="添加预定"></i>`);
            }

            $addPoint.click(() => {
                this.openAddPointModal();
            }).appendTo(this);
        }

        this.addActiveClassTodayOfMonth();
        let moreItem = this.points.length - this.showCount;
        if (moreItem > 0) {
            let $cover = $(`
            <div class="point-items-cover">
                <div style="padding: 2px">
                    <span>${ this.getDate() }</span>
                    <i class="fa fa-times close" style="font-size: 18px"></i>
                </div>
            </div>
            `).append(new PointItems({ points: this.points, wechat: this.wechat, calendarItem: this, date: this.getDate() })).appendTo(this);

            let $downBtn = $(`<a class="more">还有${ moreItem }项</a>`).appendTo(this);

            if (showMore) {
                $cover.addClass('active');
                $downBtn.hide();
            } else {
                $cover.removeClass('active');
                $downBtn.show();
            }

            $downBtn.click(() => {
                $cover.parent().siblings().find('.point-items-cover').removeClass('active');
                $cover.parent().siblings().find('.more').show();
                $cover.addClass('active');
                showMore = true;
                $downBtn.hide();
            });

            $cover.find('i.close').click(function() {
                $cover.removeClass('active');
                $downBtn.show();
                showMore = false;
            });
        } else {
            showMore = false;
        }

        this.showPoints = this.points.slice(0, 3);
        this.append(new PointItems({ points: this.showPoints, wechat: this.wechat, calendarItem: this, date: this.getDate() }));

        this.hover(() => {
            this.find('.calendar-item-cover').css('display', 'block');
        }, () => {
            this.find('.calendar-item-cover').css('display', 'none');
        });
    }

    addToolTip() {
       this.find('[data-toggle="tooltip"]').tooltip();
    }

    addActiveClassTodayOfMonth() {
        if (this.currentDay == this.date.getDate()) {
            this.find(".current-day").addClass("active");
        }
    }

    getDate() {
        let date = this.date.getFullYear()+"-"+(this.date.getMonth()+1) / 1+"-"+ this.currentDay;
        return date;
    }

    openAddPointModal() {
        this.modal.$header = $(`<h4>发文排期预定信息</h4>`);
        this.modal.$body = new AddPointModal({ calendarItem: this, wechat: this.wechat, unAddedLocations: this.unAddedLocations });
        this.modal.open();
    }

    closeAddPointModal(){
        this.modal.close();
    }

    render() {
        return $(`
            <div class="calendar-item">
            </div>
        `);
    }
}