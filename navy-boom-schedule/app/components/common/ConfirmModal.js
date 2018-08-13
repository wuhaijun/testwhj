'use strict';
import Modal from './Modal';

export default class {
    constructor() {
        this.modal = new Modal({ id: 'confirmModal' });

        this.$body = $(`<div></div>`);
        this.modal.$body = this.$body;
    }

    confirm = (title, yesCallback = () => {}, noCallback = () => {}) => {
        this.render(title, yesCallback, noCallback);
        this.modal.open();
    };

    close = () => {
        this.modal.close();
    };

    render(title, yesCallback, noCallback) {
        this.$body.html('');

        let $title = $(`<div class="title"></div>`);
        $title.append(`<i class="fa fa-warning"></i>`);
        $title.append(`<div>${ title }</div>`);

        let $footer = $(`<div class="footer"></div>`);
        let $cancel = $(`<span class="btn cancel">取消</span>`);
        let $ok = $(`<span class="btn ok">确认</span>`);

        $cancel.click(() => {
            noCallback();
            this.close();
        });

        $ok.click(() => {
            yesCallback();
            this.close();
        });

        $footer.append($cancel);
        $footer.append($ok);

        this.$body.append($title);
        this.$body.append($footer);
    }
}