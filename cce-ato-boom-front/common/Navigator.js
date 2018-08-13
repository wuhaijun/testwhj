'use strict';

let ua = (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) || '';
let Sys = {};
let s;
(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


export const isIE = () => Sys.ie;
export const isFirefox = () => Sys.firefox;
export const isChrome = () => Sys.chrome;
export const isOpera = () => Sys.opera;
export const isSafari = () => Sys.safari;



export const mq = window.matchMedia("(min-width: 768px)");
export const isPC = mq.matches;
export const isMobile = !isPC;
