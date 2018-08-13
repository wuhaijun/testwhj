"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeList = themeList;
exports.themeMapping = themeMapping;

var _index = require("../constants/index.js");

var _lodash = require("../npm/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function themeList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  var data = action.data;
  switch (action.type) {
    case _index.THEME_LIST:
      return data;
    case _index.THEME_COLLECT:
      {
        var newList = _lodash2.default.clone(state);
        var themeId = action.themeId;
        for (var theme in newList) {
          if (theme._id === themeId) {
            theme.isCollect = !theme.isCollect;
            theme.isCollect ? theme.count += 1 : theme.count -= 1;
          }
        }
        return newList;
      }
    default:
      return state;
  }
}

function themeMapping() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case _index.THEME_MAPPING:
      {
        var result = _lodash2.default.keyBy(action.data, "_id");
        return result;
      }
    case _index.THEME_COLLECT:
      {
        var newMapping = _lodash2.default.clone(state);
        var themeId = action.themeId;
        var theme = newMapping[themeId];
        theme.isCollect = !theme.isCollect;
        theme.isCollect ? theme.count += 1 : theme.count -= 1;
        return newMapping;
      }
    default:
      return state;
  }
}