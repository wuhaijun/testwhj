"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticleSimpleCards = function (_BaseComponent) {
  _inherits(ArticleSimpleCards, _BaseComponent);

  function ArticleSimpleCards() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ArticleSimpleCards);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ArticleSimpleCards.__proto__ || Object.getPrototypeOf(ArticleSimpleCards)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["themeMapping"], _this.onHandleDeatils = function (id) {
      _index2.default.navigateTo({ url: '/pages/projects/detail/index?id=' + id });
    }, _this.onHandleLongpress = function (e) {
      var articleId = e.currentTarget.dataset.eOnhandledeatilsAA;
      _this.__triggerPropsFn("onHandleLongPress", [null].concat([true, articleId]));
    }, _this.onScrolltolower = function () {
      _this.__triggerPropsFn("onCollectScrolltolower", [null].concat([]));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ArticleSimpleCards, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(ArticleSimpleCards.prototype.__proto__ || Object.getPrototypeOf(ArticleSimpleCards.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};

      var themeMapping = this.__props.themeMapping;
      Object.assign(this.__state, {
        themeMapping: themeMapping
      });
      return this.__state;
    }
  }]);

  return ArticleSimpleCards;
}(_index.Component);

ArticleSimpleCards.properties = {
  "__fn_onHandleLongPress": null,
  "__fn_onCollectScrolltolower": null,
  "themeMapping": null,
  "projectList": null
};
ArticleSimpleCards.$$events = ["onHandleDeatils", "onHandleLongpress", "onScrolltolower"];
exports.default = ArticleSimpleCards;

Component(require('../npm/@tarojs/taro-weapp/index.js').default.createComponent(ArticleSimpleCards));