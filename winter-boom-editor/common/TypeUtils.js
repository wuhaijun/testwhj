'use strict';

const toString = Object.prototype.toString;

export const isString = v => toString.call(v) === '[object String]';
export const isNumber = v => toString.call(v) === '[object Number]';
export const isBoolean = v => toString.call(v) === '[object Boolean]';
export const isObject = v => toString.call(v) === '[object Object]';
export const isArray = v => toString.call(v) === '[object Array]';
export const isFunction = v => toString.call(v) === '[object Function]';