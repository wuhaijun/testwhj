'use strict';
import Component from '../Component';
import Modal from '../common/Modal';
import PointLocationMap from '../../../common/PointLocationMap';

export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'orderSuccessModal'});
        this.rendered();
    }

    rendered() {
        this.getDateTime();
        this.find(".cancel").click(() => {
            this.closeOrderModal();
        });

        this.find(".confirm").click(() => {
            let wechatId = this.wechat._id;
            let publishDate = $('span[name=publishDate]').text();
            let location = $('select[name=location]').val();
            let supplier = $('select[name=supplier]').val();
            let title = $('textarea[name=title]').val();
            let publishDates = publishDate.split('-');
            let publishYear = publishDates[0];
            let publishMonth = publishDates[1];
            let publishDay = publishDates[2];
            if (title && title.trim() && title.trim().length > 0) {
                let data = {wechatId, publishDate, location, supplier, title, publishYear, publishMonth, publishDay};
                $.post('/point/add', data, json => {
                    if (json.status) {
                        this.closeOrderModal();
                        this.calendarItem.addPoint(json.result);
                    } else {
                        alert('发文预定失败,请稍后重试!');
                    }
                });
            } else {
                this.message.warn('标题不可为空');
            }
        });

        $.get('/account/supplier/list', {wechatId: this.wechat._id}, json => {
            if (json.status) {
                let $supplierSelect = this.find('select[name=supplier]');
                json.results.forEach(result => {
                    $supplierSelect.append(`<option value=${ result._id }>${ result.nickname }</option>`);
                });
            }
        });

        let $select = this.find('select[name=location]');
        this.unAddedLocations.forEach(it => {
            $select.append(`<option value="${ it }">${ PointLocationMap[it] }</option>`);
        });
    }

    getDateTime() {
        this.find(".datetime").text(this.calendarItem.getDate());
    }

    closeOrderModal() {
        this.calendarItem.closeAddPointModal();
    }

    render() {
        return $(`
           <div class="order-info">
                    <div class="line">
                          <span class="left">发文时间: </span>
                          <span class="right datetime" name="publishDate"></span>
                    </div>
                    <div class="line">
                          <span class="left">文章点位: </span>
                          <span class="right">
                                <select name="location">
                                </select>
                          </span>
                    </div>
                     <div class="line">
                           <span class="left">供应商: </span>
                           <span class="right">
                                <select name="supplier">
                                </select>
                           </span>
                     </div>
                     <div class="line">
                           <span class="left main-text">文章标题: </span>
                           <span class="right">
                                <textarea class="textarea" name="title" maxlength="54"  placeholder="最多可显示54个字"></textarea>
                           </span>
                    </div>
                    <div class="bottom-button">
                        <span class="cancel"> 取消 </span>
                        <span class="confirm"> 确定 </span>
                    </div>
           </div>
        `);
    }
}