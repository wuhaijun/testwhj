'use strict';

import Component from './../../Component';
import SyncMuchArticle from './SyncMuchArticle';
import SyncFooter from './SyncFooter';

export default class extends Component {
    constructor(props) {
        super(props);
        this.typeSync = 1;
        this.syncMuchArticle = new SyncMuchArticle({ parent: this, wechatId: this.wechatId, date: this.date, pointArticles: this.pointArticles });
        this.syncFooter = new SyncFooter({ parent: this, mplist: this.mplist, wechatId: this.wechatId, date: this.date });
        this.rendered();
    }

    rendered = () => {
        let $muchArticleList = this.find('.much-article-list');
        $muchArticleList.append(this.syncMuchArticle);

        let $footerOperation = this.find('.footer-operation');
        $footerOperation.html('');
        $footerOperation.append(this.syncFooter);
    };

    render() {
        return $(`
            <div class="modal-pic-body">
                <div class="row modal-warper">
                    <div class="title">
                        选择你要同步的文章
                    </div>
                    <div class="sync-list-area">
                        <div class="much-article-list"></div>
                    </div>
                    <div class="footer-operation"></div>
                </div>
            </div>
        `);
    }
}










