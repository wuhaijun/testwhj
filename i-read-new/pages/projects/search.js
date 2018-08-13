"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _project = require("../../actions/project.js");

var _theme = require("../../actions/theme.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var search_icon = "/public/icon/icon_search.png";
var search_empty = "/public/icon/icon_search_empty.png";
var loading_icon = "/public/icon/loading.svg";


var mapState = function mapState(state) {
  return {
    searchList: state.projectSearchList,
    themeMapping: state.themeMapping,
    loading: state.loading
  };
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    onGetProjectSearchList: function onGetProjectSearchList(keyword, page) {
      dispatch((0, _project.getProjectSearchList)(keyword, page));
    },
    onGetThemeList: function onGetThemeList() {
      dispatch((0, _theme.getThemeList)());
    }
  };
};

var Search = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(Search, _BaseComponent);

  function Search() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Search);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Search.__proto__ || Object.getPrototypeOf(Search)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["search_icon", "search_empty", "loading_icon", "keyword", "keywords", "search", "loading", "page", "loadCompleted", "searchList", "themeMapping"], _this.onHandleConfirm = function (e) {
      var keyword = e.detail.value || e.target.dataset.keyword || "";
      if (!keyword || !keyword.trim()) {
        return;
      }
      _this.__triggerPropsFn("onGetProjectSearchList", [null].concat([keyword, 1]));
      var keywords = [].concat(_toConsumableArray(_this.state.keywords));
      var index = keywords.findIndex(function (it) {
        return it == keyword;
      });
      if (index != -1) keywords.splice(index, 1);
      keywords.unshift(keyword);
      if (_this.props.searchList.length == 0) {
        _this.setState({
          search: true,
          loading: false
        });
      }
      _this.setState({ keywords: keywords.slice(0, 10), search: true, keyword: keyword, loading: true, page: 2 });
      _index2.default.setStorage({
        key: 'history',
        data: keywords
      });
    }, _this.onHandleClear = function () {
      _index2.default.removeStorageSync('history');
      _this.setState({ keywords: [] });
    }, _this.loadmore = function () {
      var page = Math.ceil(_this.props.searchList.length / 24);
      var nextPage = page + 1;
      var keyword = _this.state.keyword;
      _this.__triggerPropsFn("onGetProjectSearchList", [null].concat([keyword, nextPage]));
    }, _this.onReachBottom = function () {
      _this.loadmore();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Search, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Search.prototype.__proto__ || Object.getPrototypeOf(Search.prototype), "_constructor", this).call(this, props);
      this.state = {
        keyword: '',
        keywords: [],
        search: false,
        loading: false,
        page: 2,
        loadCompleted: false
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      _index2.default.getStorage({ key: 'history' }).then(function (res) {
        _this2.setState({
          keywords: res.data
        });
      });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.__triggerPropsFn("onGetThemeList", [null].concat([]));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      Object.assign(this.__state, {
        search_icon: search_icon,
        search_empty: search_empty,
        loading_icon: loading_icon
      });
      return this.__state;
    }
  }]);

  return Search;
}(_index.Component)) || _class);
Search.properties = {
  "__fn_onGetThemeList": null,
  "__fn_onGetProjectSearchList": null,
  "searchList": null,
  "loading": null,
  "themeMapping": null
};
Search.$$events = ["onHandleConfirm", "onHandleClear"];
exports.default = Search;

Page(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Search, true));