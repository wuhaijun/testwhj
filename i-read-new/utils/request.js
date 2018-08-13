"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var checkSession = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var checkSessionResp, sessionId, sessionData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            checkSessionResp = void 0;
            sessionId = void 0;
            _context.prev = 2;
            _context.next = 5;
            return _index2.default.checkSession();

          case 5:
            checkSessionResp = _context.sent;

            console.log("checkSessionResp", checkSessionResp);
            _context.next = 9;
            return _index2.default.getStorage({ key: "sessionId" });

          case 9:
            sessionData = _context.sent;

            sessionId = sessionData.data;
            console.log("sessionId", sessionId);

            if (sessionId) {
              _context.next = 16;
              break;
            }

            _context.next = 15;
            return login();

          case 15:
            sessionId = _context.sent;

          case 16:
            _context.next = 24;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](2);

            console.log(_context.t0);
            _context.next = 23;
            return login();

          case 23:
            sessionId = _context.sent;

          case 24:
            return _context.abrupt("return", sessionId);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 18]]);
  }));

  return function checkSession() {
    return _ref.apply(this, arguments);
  };
}();

var login = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var loginResp, sessionData, sessionId;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _index2.default.login();

          case 2:
            loginResp = _context2.sent;
            _context2.next = 5;
            return _index2.default.request({ url: config.server + '/api/user/login/' + loginResp.code });

          case 5:
            sessionData = _context2.sent;
            sessionId = sessionData.data.sessionId;
            _context2.next = 9;
            return _index2.default.setStorage({ key: 'sessionId', data: sessionId });

          case 9:
            return _context2.abrupt("return", sessionId);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function login() {
    return _ref2.apply(this, arguments);
  };
}();

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var config = {
  "server": "https://ireader.brainboom.cn",
  "qiniu_imageHost": "http://boom-static.static.cceato.com/",
  "appName": "\u4E09\u5343\u7C73\uD83D\uDC2C"
};

exports.default = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(opts) {
    var url, method, data, sessionId, resp;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = opts.url || '';
            method = opts.method || 'GET';
            data = opts.data || {};
            _context3.next = 5;
            return checkSession();

          case 5:
            sessionId = _context3.sent;
            _context3.prev = 6;
            _context3.next = 9;
            return _index2.default.request({
              url: config.server + url,
              header: { sessionId: sessionId },
              method: method,
              data: data
            });

          case 9:
            resp = _context3.sent;
            return _context3.abrupt("return", resp);

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](6);

            console.log(_context3.t0);
            console.warn('Login error when call api: ' + url);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[6, 13]]);
  }));

  function request(_x) {
    return _ref3.apply(this, arguments);
  }

  return request;
}();