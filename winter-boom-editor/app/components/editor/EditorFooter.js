'use strict';
import Component from './../Component';
import upload from '../../utils/upload';
import Modal from '../common/Modal';
import CheckBrowser from './CheckBrowser';

export default class extends Component {
    constructor(props){
        super(props);

        this.$sourceInput = null;
        this.$digestTextarea = null;

        this.modal = new Modal({id: 'checkBrowserModal'});
        this.checkBrowser();

        this.rendered();
    }

    checkBrowser = () =>{
        this.modal.$body = new CheckBrowser({parent: this});
        let isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
        let isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
        if(!isChrome && !isMobile && document.body.clientWidth>768){
            this.modal.open();
        }
    };

    rendered = () => {
        this.$sourceInput = this.find('.col-editor-footer-source input');
        this.$digestTextarea = this.find('.col-editor-footer-digest textarea');
    };

    digest = val => {
        if (val == undefined) {
            return this.$digestTextarea.val();
        } else {
            this.$digestTextarea.val(val);
        }
    };

    sourceUrl = val => {
        if (val == undefined) {
            return this.$sourceInput.val();
        } else {
            this.$sourceInput.val(val);
        }
    };

    clear = () => {
        this.digest('');
        this.sourceUrl('');
    };

    isEmpty = () => {
        let digest = this.digest();
        let sourceUrl = this.sourceUrl();

        return !(digest && digest.trim() || sourceUrl && sourceUrl.trim());
    };

    render() {
        return $(`
            <div class="col-editor-footer">
                <div class="col-editor-footer-digest">
                    <textarea maxlength="54" placeholder="选填摘要，如果不填写会默认抓取正文前54个字"></textarea>
                </div>
                <div class="col-editor-footer-source">
                    <input type="text" placeholder="请输入原文链接" />
            </div>
            </div>
        `);
    }
}