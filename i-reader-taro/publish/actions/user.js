"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserInfo = getUserInfo;
exports.getProjectNotes = getProjectNotes;
exports.getProjectCollects = getProjectCollects;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../constants/index.js");

var _request = require("../utils/request.js");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getUserInfo() {
  var url = '/api/user/info';
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
      var resp;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _request2.default)({ url: url });

            case 2:
              resp = _context.sent;

              dispatch({ type: _index3.USER_INFO, data: resp.data });

            case 4:
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

function getProjectNotes(page) {
  var url = '/api/projectNote/list?page=' + page;
  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dispatch) {
      var resp, type;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _request2.default)({ url: url });

            case 2:
              resp = _context2.sent;
              type = page > 1 ? _index3.USER_CONCAT_NOTES : _index3.USER_NOTES;

              dispatch({ type: type, data: resp.data });

            case 5:
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

function getProjectCollects(page) {
  var url = '/api/projectCollect/list?page=' + page;
  return function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dispatch) {
      var resp, type;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _request2.default)({ url: url });

            case 2:
              resp = _context3.sent;
              type = page > 1 ? _index3.USER_CONCAT_COLLECTS : _index3.USER_COLLECTS;

              dispatch({ type: type, data: resp.data });

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
}