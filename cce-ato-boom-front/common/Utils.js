'use strict';

const toString = Object.prototype.toString;

export const isString = v => toString.call(v) === '[object String]';
export const isNumber = v => toString.call(v) === '[object Number]';
export const isBoolean = v => toString.call(v) === '[object Boolean]';
export const isObject = v => toString.call(v) === '[object Object]';
export const isArray = v => toString.call(v) === '[object Array]';
export const isFunction = v => toString.call(v) === '[object Function]';

export const format = date => {
    if (isString(date))
        date = new Date(date);

    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let yy = date.getFullYear();

    return [yy, (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('-');
};

export const flatten = arr => arr.reduce(
    (acc, val) => acc.concat(
        Array.isArray(val) ? flatten(val) : val
    ),
    []
);

export const mq = window.matchMedia("(min-width: 768px)");
export const isPC = mq.matches;
export const isMobile = !isPC;