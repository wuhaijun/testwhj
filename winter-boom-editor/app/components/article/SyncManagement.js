'use strict';
import _ from 'lodash';
import Component from './../Component';
import SyncManagementArticleBody from '././sync/SyncManagementArticleBody';
import BindWechatBody from '././sync/BindWechatBody';
import ConfirmBindWechatBody from '././sync/ConfirmBindWechatBody';
import Modal from '../common/Modal';
import Message from '../common/Message';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'syncManagementCurveModal'});
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
        this.modal.$body = new SyncManagementArticleBody({parent: this});
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
                this.modal.$header = $(`<h4>同步文章</h4>`);
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
            this.columenEditor.save((article) => {
                this.syncArticleId = this.columenEditor.getArticleId();
                this.getCoverImg = article.cover;
                if(this.getCoverImg) {
                    this.open();
                } else {
                    alert('文章请添加封面图');
                }
            });
            
        });
    };

    render() {
        return $(`<div class="header-content">
                    <div class="sync-article-btn">同步文章</div>
                </div>
        `);
    }
}