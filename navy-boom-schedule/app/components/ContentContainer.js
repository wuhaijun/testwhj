'use strict';
import Component from './Component';
import CalendarItems from './calendar/CalendarItems';
import ArticleItemsContainer from './article/ArticleItemsContainer';

export default class extends Component {

    constructor(props) {
        super(props);
        this.calendarItems = null;
        this.articleItemsContainer = null;
    }

    loadCalendarItems(wechatId) {
        this.calendarItems = new CalendarItems({ wechatId: wechatId });
        this.load(this.calendarItems);
    }

    loadArticleItemsContainer(wechatId, pointId, date) {
        this.articleItemsContainer = new ArticleItemsContainer({ wechatId: wechatId, pointId: pointId, date: date });
        this.load(this.articleItemsContainer);
    }

    load($comp){
        if ($comp) {
            this.find('.main-content').html('');
            this.find('.main-content').append($comp);
        }
    }

    render() {
        return $(`
        <div class="schedule-main-panel">
            <div class="row main-content"></div>
        </div>`);
    }
}