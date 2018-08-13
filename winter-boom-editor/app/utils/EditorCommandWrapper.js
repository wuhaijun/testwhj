let context;

function init(ctx) {
    context = ctx;
}

/*
 afterCommand trigger change event and record undo.
 */
function wrapper(fn) {
    return function () {
        if(!context || !fn)return;
        // context.invoke('editor.beforeCommand');
        let result = fn.apply(this, arguments);
        context.invoke('editor.afterCommand');
        return result;
    };
}

module.exports = {
    init,
    wrapper
};
