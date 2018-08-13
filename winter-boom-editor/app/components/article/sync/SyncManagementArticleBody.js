'use strict';

import Component from './../../Component';
import SyncBatch from './SyncBatch';
import SyncManagementFooter from './SyncManagementFooter';

export default class extends Component {
    constructor(props) {
        super(props);
        this.typeSync = 1;
        this.syncBatch = new SyncBatch({parent:this});
        this.syncManagementFooter = new SyncManagementFooter({parent: this});
        this.rendered();
    }

    rendered = () => {

        let $footerOperation = this.find('.footer-operation');
        $footerOperation.html('');
        $footerOperation.append(this.syncManagementFooter);
    };

    render() {
        return $(`
            <div class="modal-pic-body">
                <div class="row modal-warper">
                        <div class="title">将当前文章同步至公众号</div>
                        <div class="footer-operation">
                        </div>
                </div>
            </div>
        `);
    }
}










