"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../npm/@tarojs/redux/index.js");

var _theme = require("../actions/theme.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var follow = "/public/icon/icon_follow.png";
var config = {
  "server": "https://ireader.brainboom.cn",
  "qiniu_imageHost": "http://boom-static.static.cceato.com/",
  "appName": "\u4E09\u5343\u7C73\uD83D\uDC2C"
};


var imageHost = config.qiniu_imageHost;

var mapState = function mapState(state) {
  return {};
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    onDoThemeCollect: function onDoThemeCollect(id) {
      dispatch((0, _theme.doThemeCollect)(id));
    }
  };
};

var ThemeCard = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(ThemeCard, _BaseComponent);

  function ThemeCard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ThemeCard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ThemeCard.__proto__ || Object.getPrototypeOf(ThemeCard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray0", "follow", "themeList", "themeCollectCount"], _this.onHandleSubscribe = function (e) {
      var _id = e.currentTarget.dataset.id;
      var themeList = _this.props.themeList;
      _this.__triggerPropsFn("onDoThemeCollect", [null].concat([_id]));
      var index = _this.props.themeList.findIndex(function (item) {
        return item._id == _id;
      });
      if (themeList[index].isCollect) {
        _this.__triggerPropsFn("onHandleDeletTheme", [null].concat([_id]));
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ThemeCard, [{
    key: "_constructor",
    value: function _constructor(props) {
      console.log(props);
      _get(ThemeCard.prototype.__proto__ || Object.getPrototypeOf(ThemeCard.prototype), "_constructor", this).call(this, props);
      this.state = {
        themeList: [],
        themeCollectCount: ''
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var loopArray0 = (this.__props.themeList || []).map(function (item, index) {
        var $loopState__temp2 = "/pages/themes/deatils?id=" + item._id;
        var $loopState__temp4 = imageHost + "theme/" + item._id + "_m.jpg";
        return _extends({}, item, {
          $loopState__temp2: $loopState__temp2,
          $loopState__temp4: $loopState__temp4
        });
      });
      Object.assign(this.__state, {
        loopArray0: loopArray0,
        follow: follow
      });
      return this.__state;
    }
  }]);

  return ThemeCard;
}(_index.Component)) || _class);
ThemeCard.properties = {
  "themeList": null,
  "__fn_onDoThemeCollect": null,
  "__fn_onHandleDeletTheme": null
};
ThemeCard.$$events = ["onHandleSubscribe"];
exports.default = ThemeCard;

Component(require('../npm/@tarojs/taro-weapp/index.js').default.createComponent(ThemeCard));