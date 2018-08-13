"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectList = projectList;
exports.projectDetail = projectDetail;
exports.projectSearchList = projectSearchList;

var _index = require("../constants/index.js");

var _lodash = require("../npm/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require("../utils/util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function projectList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _index.PROJECT_LIST:
      {
        var _projectList = _lodash2.default.clone(action.data.projectList);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _projectList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var project = _step.value;

            var nweTime = _util2.default.formatDate(new Date(project.datePublished));
            var newTatil = _util2.default.replaceHtmlChar(project.title);
            project.datePublished = nweTime;
            project.title = newTatil;
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

        return _projectList;
      }
    case _index.PROJECT_CONCAT_LIST:
      {
        var _projectList2 = _lodash2.default.clone(action.data.projectList);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _projectList2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _project = _step2.value;

            var _nweTime = _util2.default.formatDate(new Date(_project.datePublished));
            var _newTatil = _util2.default.replaceHtmlChar(_project.title);
            _project.datePublished = _nweTime;
            _project.title = _newTatil;
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

        return [].concat(_toConsumableArray(state), _toConsumableArray(_projectList2));
      }
    case _index.PROJECT_COLLECT:
      {
        var newList = _lodash2.default.clone(state);
        var projectId = action.projectId;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = newList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _project2 = _step3.value;

            if (_project2._id === projectId) {
              _project2.isCollected = !_project2.isCollected;
              _project2.isCollected ? _project2.collectCount += 1 : _project2.collectCount -= 1;
            }
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

        return newList;
      }
    case _index.PROJECT_SHARE:
      {
        var _newList = _lodash2.default.clone(state);
        var _projectId = action.projectId;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = _newList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _project3 = _step4.value;

            if (_project3._id === _projectId) {
              _project3.shareCount += 1;
            }
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
      }
    default:
      return state;
  }
}

function projectDetail() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _index.PROJECT_DETAIL:
      return action.data;
    case _index.PROJECT_COLLECT:
      {
        var project = _lodash2.default.clone(state);
        project.isCollected = !project.isCollected;
        project.isCollected ? project.collectCount + 1 : project.collectCount -= 1;
        return project;
      }
    case _index.PROJECT_SHARE:
      {
        var _project4 = _lodash2.default.clone(state);
        _project4.shareCount += 1;
        return _project4;
      }
    case _index.PROJECT_NOTE:
      {
        var _project5 = _lodash2.default.clone(state);
        var operator = action.data.operator;
        var domIndex = action.domIndex;
        if (operator === 'add') {
          if (!_project5.notes) _project5.notes = [];
          _project5.notes.push(domIndex);
        } else {
          _project5.notes = _lodash2.default.pull(_project5.notes, domIndex);
        }
      }
    default:
      return state;
  }
}

function projectSearchList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case _index.SEARCH_LIST:
      {
        var searchList = _lodash2.default.clone(action.data.projectList);
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = searchList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var project = _step5.value;

            var nweTime = _util2.default.formatDate(new Date(project.datePublished));
            var newTatil = _util2.default.replaceHtmlChar(project.title);
            project.datePublished = nweTime;
            project.title = newTatil;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return searchList;
      }
    case _index.SEARCH_CONCAT_LIST:
      {
        var _searchList = _lodash2.default.clone(action.data.projectList);
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = _searchList[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _project6 = _step6.value;

            var _nweTime2 = _util2.default.formatDate(new Date(_project6.datePublished));
            var _newTatil2 = _util2.default.replaceHtmlChar(_project6.title);
            _project6.datePublished = _nweTime2;
            _project6.title = _newTatil2;
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        return [].concat(_toConsumableArray(state), _toConsumableArray(_searchList));
      }
    default:
      return state;
  }
}