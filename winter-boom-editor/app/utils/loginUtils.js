'use strict';

let target = $('#login-modal');

function check() {
    return !!window.account;
};

function checkAlert() {
    let result = check();

    if(!result) {
        target.modal('show');
    }

    return result;
};

module.exports = {
    check,
    checkAlert
};
