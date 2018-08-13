"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjectList = getProjectList;
exports.getProjectDetail = getProjectDetail;
exports.doProjectCollect = doProjectCollect;
exports.doProjectShare = doProjectShare;
exports.doProjectNote = doProjectNote;
exports.getProjectSearchList = getProjectSearchList;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../constants/index.js");

var _request = require("../utils/request.js");

var _request2 = _interopRequireDefault(_request);

var _contentHandler = require("../utils/contentHandler.js");

var _contentHandler2 = _interopRequireDefault(_contentHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getProjectList(themeId, page) {
  var url = '/api/project/list?themeId=' + themeId;
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
      var resp, type;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _request2.default)({ url: url, data: { page: page } });

            case 2:
              resp = _context.sent;
              type = page > 1 ? _index3.PROJECT_CONCAT_LIST : _index3.PROJECT_LIST;

              dispatch({ type: type, data: resp.data });

            case 5:
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

function getProjectDetail(projectId) {
  var url = '/api/project/detail/' + projectId;
  return function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dispatch) {
      var resp, nodes;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _request2.default)({ url: url });

            case 2:
              resp = _context2.sent;

              dispatch({ type: _index3.PROJECT_DETAIL, data: resp.data });
              nodes = _contentHandler2.default.handle(resp.data.type)(resp.data.text, this);

              dispatch({ type: COMMON_NODES, nodes: nodes });

            case 6:
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

function doProjectCollect(projectId) {
  var url = '/api/project/toggleCollect';
  return function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dispatch) {
      var resp;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _request2.default)({ url: url, method: 'POST', data: { id: projectId } });

            case 2:
              resp = _context3.sent;

              dispatch({ type: _index3.PROJECT_COLLECT, data: resp.data, projectId: projectId });

            case 4:
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

function doProjectShare(projectId, type) {
  var url = '/api/project/share';
  return function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(dispatch) {
      var resp;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _request2.default)({ url: url, method: 'POST', data: { id: projectId, type: type } });

            case 2:
              resp = _context4.sent;

              dispatch({ type: _index3.PROJECT_SHARE, data: resp.data, projectId: projectId });

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }();
}

function doProjectNote(projectId, domIndex, text, note) {
  var url = '/api/project/share';
  return function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(dispatch) {
      var resp;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _request2.default)({
                url: url,
                method: 'POST',
                data: { id: projectId, domIndex: domIndex, text: text, note: note }
              });

            case 2:
              resp = _context5.sent;

              dispatch({ type: _index3.PROJECT_NOTE, data: resp.data, domIndex: domIndex });

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }();
}

function getProjectSearchList(keyword, page) {
  var url = '/api/project/list?keyword=' + keyword;
  return function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(dispatch) {
      var resp, type;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              dispatch({ type: _index3.LOADING, data: true });
              _context6.next = 3;
              return (0, _request2.default)({ url: url, data: { page: page } });

            case 3:
              resp = _context6.sent;

              dispatch({ type: _index3.LOADING, data: false });
              type = page > 1 ? _index3.SEARCH_CONCAT_LIST : _index3.SEARCH_LIST;

              dispatch({ type: type, data: resp.data });

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }();
}