'use strict';

const stack = [];
export function push(url) {
    stack.push(url);
}

export function pop() {
    return stack.pop();
}

export function get() {
    return stack[stack.length - 1];
}