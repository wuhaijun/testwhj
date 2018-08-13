"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatorNodes = generatorNodes;
exports.changeText = changeText;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../constants/index.js");

var _request = require("../utils/request.js");

var _request2 = _interopRequireDefault(_request);

var _contentHandler = require("../utils/contentHandler.js");

var _contentHandler2 = _interopRequireDefault(_contentHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function generatorNodes(type, text, target) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
      var nodes;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              nodes = void 0;

              if (text) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", nodes = []);

            case 5:
              nodes = _contentHandler2.default.handle(type)(text, target);

            case 6:
              return _context.abrupt("return", dispatch({
                type: _index3.COMMON_NODES,
                nodes: nodes
              }));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}

function changeText(textContent) {
  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dispatch) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", dispatch({
                type: _index3.COMMON_TEXT,
                textContent: textContent
              }));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
}