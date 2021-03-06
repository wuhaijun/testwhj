'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __formatDateToArray__ = function __formatDateToArray__(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return [year, month, day, hour, minute, second];
};

var __formatNumber__ = function __formatNumber__(n) {
  return n.toString()[1] ? n : '0' + n;
};

function formatTime(date) {
  var array = __formatDateToArray__(date);
  return array.slice(0, 3).map(__formatNumber__).join('-') + '  ' + array.slice(3, 5).map(__formatNumber__).join(':');
}

function formatDate(date) {
  var array = __formatDateToArray__(date);
  return array.slice(0, 3).map(__formatNumber__).join('-');
}

function formatText(date) {
  var array = __formatDateToArray__(date).slice(0, 3);
  var days = parseInt((new Date().getTime() - date.getTime()) / 86400000);

  return days == 0 ? '今天' : days == 1 ? '昨天' : days == 2 ? '前天' : array.map(__formatNumber__).join('-');
}

function groupBy(arr, key) {
  var result = arr.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);return rv;
  }, {});
  var results = [];
  for (var k in result) {
    var _results$push;

    results.push((_results$push = {}, _defineProperty(_results$push, key, formatText(new Date(k))), _defineProperty(_results$push, 'data', result[k]), _results$push));
  }
  return results;
}

// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息  
function isError(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  });
}

// 清空错误信息  
function clearError(that) {
  that.setData({
    showTopTips: false,
    errorMsg: ""
  });
}

//两个数组合并去重
function unique(array, array1) {
  var setObj = new Set(array);
  for (var i = 0; i < array1.length; i++) {
    setObj.add(array1[i]);
  }
  return Array.from(setObj);
}

//获取当前页面路径
function getCurrentPageUrl() {
  var pages = getCurrentPages(); //获取加载的页面
  var currentPage = pages[pages.length - 1]; //获取当前页面的对象
  var url = currentPage.route; //当前页面url
  return url;
}

function replaceHtmlChar(text) {
  if (!text) return text;
  var translate_re = new RegExp('&(nbsp|amp|quot|lt|gt);', 'g');
  var translate = {
    "nbsp": " ",
    "amp": "&",
    "quot": "\"",
    "lt": "<",
    "gt": ">"
  };

  return text.replace(translate_re, function (match, entity) {
    return translate[entity];
  });
}

function getDate() {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1;
  var nowDay = nowDate.getDate();
  if (nowMonth < 10) nowMonth = "0" + nowMonth;
  if (nowDay < 10) nowDay = "0" + nowDay;
  var results = [nowYear, nowMonth, nowDay];
  return results;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  trim: trim,
  isError: isError,
  groupBy: groupBy,
  clearError: clearError,
  unique: unique,
  getCurrentPageUrl: getCurrentPageUrl,
  replaceHtmlChar: replaceHtmlChar,
  getDate: getDate
};