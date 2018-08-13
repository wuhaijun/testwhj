'use strict';
import Component from './components/Component';
import Header from './components/Header';
import ContentContainer from './components/ContentContainer';
import LeftBar from './components/LeftBar';
import Router from './components/Router';

export default class extends Component {
    constructor(props) {
        super(props);
        this.header = new Header();
        this.contentContainer = new ContentContainer();
        this.sidebar = new LeftBar();

        window.router = new Router({
            routes: {
                '/:wechatId': (wechatId) => {
                    this.contentContainer.loadCalendarItems.apply(this.contentContainer, [wechatId]);
                },
                '/articles/:wechatId/:pointId/:date': (wechatId, pointId, date) => {
                    this.contentContainer.loadArticleItemsContainer.apply(this.contentContainer, [wechatId, pointId, date]);
                }
            }
        });
        window.router.start();

        window.$sidebar = this.sidebar;
        window.$header = this.header;
        window.$contentContainer = this.contentContainer;
        window.$app = this;

        this.rendered();
    }

    rendered = () => {
        this.append(this.sidebar);
        this.append(this.header);
        this.append(this.contentContainer);
    };


    render() {
       return $(`<div id="app-schedule" class="container-fluid"></div>`);
    }
}