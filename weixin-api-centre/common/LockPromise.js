'use strict';

function Lock(options) {
    let {timeout} = Object.assign({
        timeout: -1
    }, options);

    let locked = false;
    let queue = [];

    function lock() {
        if(!locked) {
            locked = true;
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            let st, finished = false;
            if(timeout && timeout > 0) {
                st = setTimeout(function () {
                    if(finished) {
                        return;
                    }
                    finished = true;
                    reject(new Error('lock timeout', timeout));
                }, timeout);
            }
            queue.push(function () {
                if(finished) {
                    return;
                }
                finished = true;
                resolve();
            });
        });
    }
    
    function unlock() {
        let cb = queue.shift();
        cb && cb();
        locked = false;
    }
    
    return {
        lock, unlock
    };
};

module.exports = Lock;
