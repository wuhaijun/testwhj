'use strict';

let win = window, supportPushState = 'pushState' in history, evt = supportPushState ? 'popstate' : 'hashchange', self = {};
let regexps = [
        /[\-{}\[\]+?.,\\\^$|#\s]/g,
        /\((.*?)\)/g,
        /(\(\?)?:\w+/g,
        /\*\w+/g,
    ],
    getRegExp = function(route) {
        route = route.replace(regexps[0], '\\$&')
            .replace(regexps[1], '(?:$1)?')
            .replace(regexps[2], function(match, optional) {
                return optional ? match : '([^/?]+)'
            }).replace(regexps[3], '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    extractParams = function(route, fragment) {
        let params = route.exec(fragment).slice(1);
        let results = [], i;
        for(i = 0; i < params.length; i++) {
            results.push(decodeURIComponent(params[i]) || null);
        }
        return results;
    };

export default class {
    constructor(opts) {
        this.opts = opts;
        this.routes = opts.routes;/*路由的路径*/
        this.sep = opts.sep || '';
        this.go(location.pathname, true);
        self = this;/*把this 存下来  在后面调用*/
    }

    exec(path) {
        for(let r in this.routes) {
            let route = getRegExp(r);/*把路由字符串  变成正则表达式*/
            if (!route.test(path)) {/*不能匹配那就下一个*/
                continue;
            }
            /*下面是执行 路由回调函数的核心方法*/
            if (typeof this.routes[r] === 'function') {
                this.routes[r].apply(this, extractParams(route, path));
            } else {
                let fn = this.opts[this.routes[r]];
                fn ? fn.apply(this, extractParams(route, path)) : void 0;
            }
        }
    }

    emmit(path) {
        if(supportPushState) {
            path = path.state.path;
        }else {
            path = location.href.split('#')[1] || '';
        }
        self.exec(path);
    }

    start() {
        win.addEventListener ? win.addEventListener(evt, this.emmit, false) : win.attachEvent('on' + evt, this.emmit)
    }
    
    stop() {
        win.removeEventListener ? win.removeEventListener(evt, this.emmit, false) : win.detachEvent('on' + evt, this.emmit);
    }

    go(path, isReplace) {
        if(supportPushState) {
            if(isReplace) {/*替换当前url*/
                history.replaceState({path: path}, document.title, path);
            }else {
                history.pushState({path: path}, document.title, path);
            }
        }else {
            if(this.sep !== '/') {
                location.hash = this.sep + path;
            }
        }//执行完上面的代码url虽然改变了，但是页面还是纹丝不动       下面代码的作用就是 依靠当前路径来找到回调函数，从而执行js
        this.exec(path);
    }

    back() {
        history.back();
    }

    hold() {
        let isReplace = false, path = href !== undefined ? href : e.target.pathname;
        if(!supportPushState) {/*如果不支持PushState*/
            path = '/' + path;
        }else {
            if(path === history.state.path) {/*如果还是点击的当前页面*/
                isReplace = true;
            }
        }
        this.go(path, isReplace);
        if(e && e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue = false;
            return false;
        }
    }
}