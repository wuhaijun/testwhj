"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../constants/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var config = {
  "server": "https://ireader.brainboom.cn",
  "qiniu_imageHost": "http://boom-static.static.cceato.com/",
  "appName": "\u4E09\u5343\u7C73\uD83D\uDC2C"
};

function login() {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
      var loginResp, sessionData, storeResp;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _index2.default.login();

            case 2:
              loginResp = _context.sent;
              _context.next = 5;
              return _index2.default.request({ url: config.server + '/api/user/login/' + loginResp.code });

            case 5:
              sessionData = _context.sent;
              _context.next = 8;
              return _index2.default.setStorage({ key: 'sessionId', data: sessionData.data.sessionId });

            case 8:
              storeResp = _context.sent;

              dispatch({ type: _index3.LOGIN, data: storeResp.data });

            case 10:
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