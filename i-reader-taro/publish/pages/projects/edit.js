"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _common = require("../../actions/common.js");

var _index3 = require("../../npm/@tarojs/redux/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapState = function mapState(state) {
  return {};
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    changeText: function changeText(textContent) {
      dispatch((0, _common.changeText)(textContent));
    }
  };
};

var Edit = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(Edit, _BaseComponent);

  function Edit() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Edit);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Edit.__proto__ || Object.getPrototypeOf(Edit)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["textContent", "textCountLength", "save", "disabled", "limitLength"], _this.onChangeText = function (event) {
      var newText = event.detail.value;
      this.setState({
        textCountLength: newText.length,
        textContent: newText
      });
    }, _this.onCancel = function () {
      this.setState({
        save: false
      });
      wx.navigateBack();
    }, _this.onSave = function () {
      wx.navigateBack();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Edit, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Edit.prototype.__proto__ || Object.getPrototypeOf(Edit.prototype), "_constructor", this).call(this, props);
      this.state = {
        textContent: '',
        textCountLength: 0,
        save: true,
        disabled: false,
        limitLength: 0
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.$router.params.text) {
        var textContent = this.$router.params.text;
        var textCountLength = textContent.length;
        this.setState({
          textCountLength: textCountLength,
          textContent: textContent
        });
      }
      var textLimit = this.$router.params.textLimit;
      this.setState({ limitLength: textLimit });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.save) {

        this.props.changeText(this.state.textContent);
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      Object.assign(this.__state, {});
      return this.__state;
    }
  }]);

  return Edit;
}(_index.Component)) || _class);
Edit.properties = {
  "changeText": null
};
Edit.$$events = ["onChangeText", "onCancel", "onSave"];
exports.default = Edit;

Page(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Edit, true));