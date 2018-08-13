function input(opts) {
    swal({
        title: opts.title,
        type: 'input',
        inputValue: opts.inputValue,
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
    }, opts.callback);
}

function confirm(opts) {
    swal({
        title: opts.title,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: opts.confirmButtonText,
        cancelButtonText: opts.cancelButtonText,
        closeOnConfirm: false
    }, opts.callback);
}

module.exports = {
    input, confirm
}