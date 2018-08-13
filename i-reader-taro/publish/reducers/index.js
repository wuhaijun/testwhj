"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("../npm/redux/lib/redux.js");

var _project = require("./project.js");

var _theme = require("./theme.js");

var _user = require("./user.js");

var _common = require("./common.js");

exports.default = (0, _redux.combineReducers)({
  projectList: _project.projectList, projectDetail: _project.projectDetail, projectSearchList: _project.projectSearchList,
  themeList: _theme.themeList, themeMapping: _theme.themeMapping,
  userInfo: _user.userInfo, userNotes: _user.userNotes, userCollects: _user.userCollects,
  loading: _common.loading, nodes: _common.nodes, textContent: _common.textContent
});