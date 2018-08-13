'use strict';

import Component from './../../Component';
import SyncBatch from './SyncBatch';
import SyncMuchArticle from './SyncMuchArticle';
import SyncFooter from './SyncFooter';

export default class extends Component {
    constructor(props) {
        super(props);
        this.typeSync = 1;
        this.syncBatch = new SyncBatch({parent:this});
        this.syncMuchArticle = new SyncMuchArticle({parent: this});
        this.syncFooter = new SyncFooter({parent: this});
        this.rendered();
    }

    rendered = () => {
        let $batchList = this.find('.batch-list');
        let $muchArticleList = this.find('.much-article-list');
        let $leftTab = this.find('.batch-sync');
        let $rightTab = this.find('.much-article-sync');
        $batchList.html('');
        $muchArticleList.html('');
        $batchList.append(this.syncBatch);
        $muchArticleList.append(this.syncMuchArticle);

        $leftTab.click(() => {
            this.typeSync = 1;
            $leftTab.addClass("active").siblings().removeClass("active");
            $batchList.show();
            $muchArticleList.hide();
        });

        $rightTab.click(() => {
            this.typeSync = 2;
            $rightTab.addClass("active").siblings().removeClass("active");
            $muchArticleList.show();
            $batchList.hide();
        });

        let $footerOperation = this.find('.footer-operation');
        $footerOperation.html('');
        $footerOperation.append(this.syncFooter);
        $leftTab.click();
    };

    render() {
        return $(`
            <div class="modal-pic-body">
                <div class="row modal-warper">
                        <div class="sync-tab-bar">
                                <span class="batch-sync active">批量同步</span>
                                <span class="much-article-sync">合并同步</span>
                        </div>
                        <div class="title">请选择你要同步的文章(可多选)</div>
                        <div class="sync-list-area">
                                <div class="batch-list">

                                </div>
                                <div class="much-article-list">

                                </div>
                        </div>

                        <div class="footer-operation">

                        </div>
                </div>
            </div>
        `);
    }
}










