'use strict';

export default class {
    constructor() {
        this.$msg = $(`<div class="editor-message"></div>`);
        $('body').append(this.$msg);
    }

    success = message => {
        this.__clear__();
        this.$msg.addClass('success');
        this.$msg.append(`<i class="fa fa-check"></i>`);
        this.$msg.append(`<span>${ message }</span>`);
        this.__show__();
    };

    info = message => {
        this.__clear__();
        this.$msg.addClass('info');
        this.$msg.append(`<i class="fa fa-info"></i>`);
        this.$msg.append(`<span>${ message }</span>`);
        this.__show__();
    };

    warn = message => {
        this.__clear__();
        this.$msg.addClass('warn');
        this.$msg.append(`<i class="fa fa-warning"></i>`);
        this.$msg.append(`<span>${ message }</span>`);
        this.__show__();
    };

    error = message => {
        this.__clear__();
        this.$msg.addClass('error');
        this.$msg.append(`<i class="fa fa-close"></i>`);
        this.$msg.append(`<span>${ message }</span>`);
        this.__show__();
    };

    __show__ = () => {
        this.$msg.css({
            "opacity":"0",
            "top": "0"
        });
        this.$msg.animate({
            "opacity":"1",
            "top": "40%"
        }, 100);

        let st = setTimeout(() => {
            this.$msg.animate({
                "opacity":"0",
                "top": "0"
            }, 1000);
            clearTimeout(st);
        }, 2000);
    };

    __clear__ = () => {
        this.$msg.removeClass('success info warn error');
        this.$msg.html('');
    };
}