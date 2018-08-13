"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../npm/@tarojs/redux/index.js");

var _project = require("../actions/project.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var collect = "/public/icon/icon_collect_pre.png";
var collected = "/public/icon/icon_collect_nor.png";
var share = "/public/icon/icon_share_nor.png";
var loadingsvg = "/public/icon/loading.svg";


var mapState = function mapState(state) {
  return {
    projectList: state.projectList,
    themeMapping: state.themeMapping
  };
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    onDoProjectCollect: function onDoProjectCollect(id) {
      dispatch((0, _project.doProjectCollect)(id));
    }
  };
};

var ArticleCards = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(ArticleCards, _BaseComponent);

  function ArticleCards() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ArticleCards);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ArticleCards.__proto__ || Object.getPrototypeOf(ArticleCards)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["collect", "collected", "share", "themeMapping", "loading", "loadingsvg", "isClick"], _this.onHandleDeatils = function (e) {
      var articleId = e.currentTarget.dataset.articleId;
      _index2.default.navigateTo({ url: '/pages/projects/detail/index?id=' + articleId });
    }, _this.onHandleCollect = function (e) {
      var id = e.currentTarget.dataset.id;
      _this.__triggerPropsFn("onDoProjectCollect", [null].concat([id]));
    }, _this.onHandleTotheme = function (e) {
      var _id = e.currentTarget.dataset.id;
      _index2.default.navigateTo({
        url: '/pages/themes/deatils?id=' + _id
      });
    }, _this.onHandleShare = function (e) {
      var dataShare = e.currentTarget.dataset;
      _this.__triggerPropsFn("onHandleShare", [null].concat([true, dataShare]));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ArticleCards, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ArticleCards.prototype.__proto__ || Object.getPrototypeOf(ArticleCards.prototype), "_constructor", this).call(this, props);
      this.state = {
        loading: true
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};

      var themeMapping = this.__props.themeMapping;
      Object.assign(this.__state, {
        collect: collect,
        collected: collected,
        share: share,
        themeMapping: themeMapping,
        loadingsvg: loadingsvg
      });
      return this.__state;
    }
  }]);

  return ArticleCards;
}(_index.Component)) || _class);
ArticleCards.properties = {
  "__fn_onDoProjectCollect": null,
  "__fn_onHandleShare": null,
  "themeMapping": null,
  "projectList": null,
  "isClick": null
};
ArticleCards.$$events = ["onHandleDeatils", "onHandleTotheme", "onHandleCollect", "onHandleShare"];
exports.default = ArticleCards;

Component(require('../npm/@tarojs/taro-weapp/index.js').default.createComponent(ArticleCards));