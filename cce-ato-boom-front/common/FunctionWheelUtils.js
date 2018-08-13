function limitTime(func, time = 200) {
    let executing = false;
    let t = {};
    return function() {
        t.args = arguments;
        if(executing) {
            return;
        }
        executing = true;
        let ctx = this;
        setTimeout(function () {
            func.apply(ctx, t.args);
            executing = false;
        }, time);
    }
}

function frequently2once(func, time = 500) {
    let to;
    return function() {
        if(to) {
            clearTimeout(to);
        }
        let args = arguments;
        let ctx = this;
        to = setTimeout(function () {
            to = null;
            func.apply(ctx, args);
        }, time);
    }
}

module.exports = {limitTime, frequently2once};