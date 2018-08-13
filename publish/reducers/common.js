"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loading = loading;
exports.nodes = nodes;
exports.textContent = textContent;

var _index = require("../constants/index.js");

var _util = require("../utils/util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loading() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments[1];

  var data = action.data;
  switch (action.type) {
    case _index.LOADING:
      return data;
    default:
      return state;
  }
}

function nodes() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  var nodes = action.nodes;
  switch (action.type) {
    case _index.COMMON_NODES:
      return nodes;
    default:
      return state;
  }
}

function textContent() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var action = arguments[1];

  var textContent = action.textContent;
  switch (action.type) {
    case _index.COMMON_TEXT:
      return textContent;
    default:
      return state;
  }
}