import React, { Component } from 'react';

const toString = Object.prototype.toString;
const blank = "  ";
const new_line = "\r\n";
let clipboard;

export default class DP extends Component {

    __isString__ = v => toString.call(v) === '[object String]';
    __isNumber__ = v => toString.call(v) === '[object Number]';
    __isBoolean__ = v => toString.call(v) === '[object Boolean]';
    __isObject__ = v => toString.call(v) === '[object Object]';
    __isArray__ = v => toString.call(v) === '[object Array]';
    __isFunction__ = v => toString.call(v) === '[object Function]';

    __toString__ = v => {
        if (this.__isString__(v)) return `"${v}"`;
        if (this.__isNumber__(v)) return `{ ${v} }`;
        if (this.__isBoolean__(v)) return "";
        if (this.__isObject__(v)) {
            let result = '{ ';
            for (let k in v) {
                result += `${k}: ${ this.__toString__(v[k]) }, `;
            }
            return result.substring(0, result.length -2) + ' }';
        }
        if (this.__isArray__(v)) return '[' + v.map(it => this.__toString__(it)).toString() + ']';
        if (this.__isFunction__(v)) {
            let func = v.toString();
            let body = func.substring(func.indexOf("{") + 1, func.lastIndexOf("}")).replace(/\n/g, '').replace(/\r\n/g, '').trim();
            return `{ () => { ${ body } } }`;
        }
    };

    jsxToString = (children, level = 0) => {
        if (this.__isArray__(children)) {
            let result = '';
            children.forEach((child, i) => {
                if (i !=0) result += new_line;
                result += this.jsxToString(child, level + 1);
            });
            return result;

        } else if(this.__isObject__(children)) {
            let child = children;
            let name =  this.__isString__(child.type) ? child.type : child.type.name;
            let ref = child.ref;
            let props = Object.assign({}, child.props);
            props.ref = ref;

            let p_children = props.children;
            delete props.children;

            let t1 = blank.repeat(level);
            let t2 = blank.repeat(level+2);
            let component = `${t1}<${ name } `;
            let i = 0;
            for (let k in props) {
                let v = props[k];
                if (v != null && v != undefined) {
                    if (i != 0) component += `${new_line}${t2}`;
                    i ++ ;

                    let vs = this.__toString__(v);
                    if (vs != "") component += `${k}=${vs}`;
                    else component += `${k}`;
                }
            }
            if (!p_children) {
                return component + ' />';
            } else {
                let content = this.jsxToString(p_children, level + 1);
                return `${ component }>${new_line}${ content }${new_line}${t1}</${name}>`;
            }
        } else if (this.__isString__(children)){
            return blank.repeat(level) + children;
        }
    };

    componentDidMount = () => {
        clipboard = new Clipboard('.btn-clipboard');
    };

    componentWillUnmount = () => {
        clipboard && clipboard.destroy();
    };

    render () {
        let code = this.jsxToString(this.props.children);
        return (
            <div style={ { "marginBottom": '50px' } }>
                <span>{ this.props.title }</span>
                <div className="bs-example" data-example-id="simple-pre">
                    <div style={ { border: '1px dashed rgb(226, 226, 226)' } }>
                        { this.props.children }
                    </div>
                    <div className="zero-clipboard">
                        <span className="btn-clipboard"
                              onMouseOver={ e => { $(e.target).addClass('tooltipped tooltipped-n') } }
                              onMouseLeave={ e => { $(e.target).attr('aria-label', 'Copy to clipboard!') } }
                              onClick={ e => { $(e.target).attr('aria-label', 'Copied!') } }
                              aria-label="Copy to clipboard!"
                              data-clipboard-text={ code } >

                            Copy
                        </span>
                    </div>
                    <pre><code className="xml">{ code }</code></pre>
                </div>
            </div>
        );
    }
}