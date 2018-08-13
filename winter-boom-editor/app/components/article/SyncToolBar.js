'use strict';
import _ from 'lodash';
import Component from './../Component';
import SyncArticleBody from '././sync/SyncArticleBody';
import BindWechatBody from '././sync/BindWechatBody';
import ConfirmBindWechatBody from '././sync/ConfirmBindWechatBody';
import Modal from '../common/Modal';
import Message from '../common/Message';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'syncManagementModal'});
        this.rendered();
    }

    confirmBind = (callback,type) => {

        $.getJSON('/wechat/mplist', result => {
            let bindNumber = result || [];
            if (bindNumber.length == 0) {
                this.__openGoBind__();
            } else {
                if(type==1){
                    this.__goChooseWechat__();
                }else{
                    this.__goSync__();
                }

            }
            isFunction(callback) && callback();
        });
    };

    goConfirmBindWechat = () => {
        this.modal.$body = new ConfirmBindWechatBody({parent: this});
        this.modal.flush();
    };

    __openGoBind__ = () => {
        this.modal.$body = new BindWechatBody({parent: this});
        this.modal.flush();
    };

    __goSync__ = () => {
        this.modal.$body = new SyncArticleBody();
        this.modal.flush();
    };
    __goChooseWechat__ = () => {
        this.modal.$body = new ChooseWechat({parent: this});
        this.modal.flush();
    };
    mobilePreview = () => {
        this.modal.$body = new MobilePreview({parent: this});
        this.modal.flush();
    };

    open = (type) => {
        if(type == 1){
            this.confirmBind(() => {
                this.modal.$header = $(`<h4>发送预览</h4>`);
                this.modal.open();
            },1);

        }else{
            this.confirmBind(() => {
                this.modal.open();
                gtag('event','Sync',{
                    'event_category':'Article',
                    'event_action':'Sync'
                });
            });
        }

    };

    rendered = () => {
        this.find('.sync-article-btn').click(() => {
            this.columenEditor.save(() => {
            });

            $.getJSON('/article/list', { page: 1, size: 1 }, list => {
                if (list.pagination.count === 0) {
                    this.message.info('请先创建文章');
                } else {
                    this.open();
                }
            });
        });
    };

    render() {
        return $(`<div class="header-content">
                    <div class="sync-article-btn">多图文同步</div>
                </div>
        `);
    }
}