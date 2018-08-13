"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userInfo = userInfo;
exports.userNotes = userNotes;
exports.userCollects = userCollects;

var _index = require("../constants/index.js");

var _util = require("../utils/util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function userInfo() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var data = action.data;
  switch (action.type) {
    case _index.USER_INFO:
      return data;
    default:
      return state;
  }
}

function userNotes() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var data = action.data;
  switch (action.type) {
    case _index.USER_NOTES:
      {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            var newTime = _util2.default.formatTime(new Date(item.notedDate));
            var newTitle = _util2.default.replaceHtmlChar(item.projectTitle);
            item.projectTitle = newTitle;
            item.notedDate = newTime;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return data;
      }
    case _index.USER_CONCAT_NOTES:
      {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _item = _step2.value;

            var _newTime = _util2.default.formatTime(new Date(_item.notedDate));
            var _newTitle = _util2.default.replaceHtmlChar(_item.projectTitle);
            _item.projectTitle = _newTitle;
            _item.notedDate = _newTime;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return [].concat(_toConsumableArray(state), _toConsumableArray(data));
      }
    default:
      return state;
  }
}

function userCollects() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var data = action.data;
  switch (action.type) {
    case _index.USER_COLLECTS:
      {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = data.projectList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var item = _step3.value;

            var nweTime = _util2.default.formatDate(new Date(item.datePublished));
            item.datePublished = nweTime;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return data;
      }
    case _index.USER_CONCAT_COLLECTS:
      {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = data.projectList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _item2 = _step4.value;

            var _nweTime = _util2.default.formatDate(new Date(_item2.datePublished));
            _item2.datePublished = _nweTime;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        var projectList = [].concat(_toConsumableArray(state.projectList), _toConsumableArray(data.projectList));
        var themeList = [].concat(_toConsumableArray(state.themeList), _toConsumableArray(data.themeList));
        return { projectList: projectList, themeList: themeList };
      }
    default:
      return state;
  }
}