"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

require("../../npm/@tarojs/async-await/index.js");

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _user = require("../../actions/user.js");

var _project = require("../../actions/project.js");

var _login = require("../../actions/login.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var uesrImage = "/public/Images/userInfo.png";
var share = "/public/icon/icon_share_nor.png";
var empty = "/public/icon/icon_empty.png";

var config = {
  "server": "https://ireader.brainboom.cn",
  "qiniu_imageHost": "http://boom-static.static.cceato.com/",
  "appName": "\u4E09\u5343\u7C73\uD83D\uDC2C"
};

var mapState = function mapState(state) {
  return {
    userNote: state.userNotes,
    userInfo: state.userInfo,
    userCollect: state.userCollects,
    themeList: state.themeList,
    themeMapping: state.themeMapping
  };
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    onGetUserInfo: function onGetUserInfo() {
      dispatch((0, _user.getUserInfo)());
    },
    onGetProjectNotes: function onGetProjectNotes(page) {
      dispatch((0, _user.getProjectNotes)(page));
    },
    onGetProjectCollects: function onGetProjectCollects(page) {
      dispatch((0, _user.getProjectCollects)(page));
    },
    onDoProjectCollect: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = dispatch;
                _context.next = 3;
                return (0, _project.doProjectCollect)(page);

              case 3:
                _context.t1 = _context.sent;
                (0, _context.t0)(_context.t1);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onDoProjectCollect(_x) {
        return _ref.apply(this, arguments);
      }

      return onDoProjectCollect;
    }(),
    onLogin: function onLogin() {
      dispatch((0, _login.login)());
    }
  };
};

var User = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(User, _BaseComponent);

  function User() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, User);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["share", "hasUserInfo", "uesrImage", "currentTab", "collectLength", "empty", "themeCollectList", "iscancel", "id", "userInfoImage", "hasMoreCollect", "isClickShare", "showPosterMask", "shareArticleId", "shareContent", "userInfo", "userCollect", "themeMapping", "userNote"], _this.onHandleToggle = function (e) {
      var current = e.target.dataset.current;
      _this.setState({
        currentTab: current
      });
    }, _this.onHandleChange = function (e) {
      var current = e.detail.current;
      _this.setState({
        currentTab: current
      });
    }, _this.onHandleCancel = function (e) {
      e.stopPropagation();
      _this.setState({
        iscancel: false
      });
    }, _this.onHandleLongPress = function (on, id) {
      _this.setState({
        id: id,
        iscancel: on
      });
    }, _this.onHandleDeletTheme = function (id) {
      _this.props.userInfo.themeCollectCount--;
    }, _this.onHandleGetUserInfo = function (e) {
      _this.__triggerPropsFn("onGetUserInfo", [null].concat([]));
      _this.__triggerPropsFn("onGetProjectNotes", [null].concat([1]));
      _this.__triggerPropsFn("onGetProjectCollects", [null].concat([1]));
      if (e.detail.userInfo) {
        _index2.default.setStorage({
          key: 'user_info',
          data: e.detail.userInfo
        });
        _this.setState({
          userInfoImage: e.detail.userInfo,
          hasUserInfo: false
        });
      } else {
        _this.setData({
          hasUserInfo: true
        });
      }
    }, _this.onScrolltolower = function () {
      var notePage = Math.ceil(_this.props.userNote.length / 24);
      var nextPage = notePage + 1;
      _this.__triggerPropsFn("onGetProjectNotes", [null].concat([nextPage]));
    }, _this.onCollectScrolltolower = function () {
      var currentPage = Math.ceil(_this.props.userCollect.projectList.length / 24);
      var nextPage = currentPage + 1;
      _this.__triggerPropsFn("onGetProjectCollects", [null].concat([nextPage]));
    }, _this.onShareBox = function (event) {
      _this.setState({
        isClickShare: true,
        shareArticleId: event.currentTarget.dataset.id,
        shareContent: event.currentTarget.dataset.note
      });
    }, _this.onMadePoster = function () {
      _this.setState({
        showPosterMask: true,
        isClickShare: false
      });
    }, _this.onHandHide = function () {
      _this.setState({
        showPosterMask: false
      });
    }, _this.onClickMask = function (e) {
      _this.setState({
        isClickShare: false
      });
    }, _this.onHidePoster = function () {
      _this.setState({
        showPosterMask: false
      });
    }, _this.onShareAppMessage = function (res) {
      var nickName = '';
      var userInfo = wx.getStorageSync('user_info');
      if (userInfo) {
        nickName = userInfo.nickName;
      }
      return {
        title: nickName + "在" + config.appName + "上分享了一段文字",
        path: '/pages/projects/detail/index',
        success: function success(res) {
          if (res.errMsg == "shareAppMessage:ok") {
            wx.showToast({
              title: '转发成功',
              icon: 'success',
              duration: 1500
            });
          }
        },
        fail: function fail(res) {
          if (res.errMsg == "shareAppMessage:fail cancel") {
            wx.showToast({
              title: '转发取消',
              duration: 1500
            });
          } else {
            wx.showToast({
              title: '转发失败',
              duration: 1500
            });
          }
        },
        complete: function complete(res) {
          _this.setState({ showPosterMask: false, isClickShare: false });
        }
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(User, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(User.prototype.__proto__ || Object.getPrototypeOf(User.prototype), "_constructor", this).call(this, props);
      this.state = {
        currentTab: 0,
        hasUserInfo: false,
        iscancel: false,
        id: '',
        userInfoImage: '',
        hasMoreCollect: true,
        isClickShare: false,
        showPosterMask: false,
        shareArticleId: '',
        shareContent: ''
      };
    }
  }, {
    key: "onHandleDelete",
    value: function onHandleDelete() {
      var _this2 = this;

      this.__triggerPropsFn("onDoProjectCollect", [null].concat([this.state.id]));
      this.props.userInfo.projectCollectCount--;
      this.setState(function (prevState) {
        return {
          iscancel: false
        };
      });
      setTimeout(function () {
        _this2.__triggerPropsFn("onGetProjectCollects", [null].concat([1]));
      }, 200);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.__triggerPropsFn("onGetProjectCollects", [null].concat([1]));
      this.__triggerPropsFn("onGetProjectNotes", [null].concat([1]));
      var userInfo = _index2.default.getStorageSync('user_info');
      if (userInfo) {
        this.setState({
          userInfoImage: userInfo,
          hasUserInfo: false
        });
      } else {
        this.setState({
          hasUserInfo: true
        });
      };
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      this.__triggerPropsFn("onGetUserInfo", [null].concat([]));
      this.__triggerPropsFn("onGetProjectNotes", [null].concat([1]));
      this.__triggerPropsFn("onGetProjectCollects", [null].concat([1]));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};

      var collectLength = (this.__props.userCollect.projectList || []).length;
      var themeCollectList = this.__props.themeList.filter(function (item) {
        return item.isCollect;
      });

      var shareBar = void 0;
      var showShareBar = void 0;
      var posterMask = void 0;
      var posterCard = void 0;
      if (this.__state.isClickShare) {} else {
        shareBar = null;
        showShareBar = null;
      }

      if (this.__state.showPosterMask) {} else {
        posterMask = null;
        posterCard = null;
      }

      Object.assign(this.__state, {
        share: share,
        uesrImage: uesrImage,
        collectLength: collectLength,
        empty: empty,
        themeCollectList: themeCollectList
      });
      return this.__state;
    }
  }]);

  return User;
}(_index.Component)) || _class);
User.properties = {
  "__fn_onDoProjectCollect": null,
  "userInfo": null,
  "__fn_onGetProjectCollects": null,
  "__fn_onGetUserInfo": null,
  "__fn_onGetProjectNotes": null,
  "userNote": null,
  "userCollect": null,
  "themeList": null,
  "themeMapping": null
};
User.$$events = ["onShareBox", "onMadePoster", "onClickMask", "onHidePoster", "onHandHide", "onHandleGetUserInfo", "onHandleToggle", "onHandleChange", "onCollectScrolltolower", "onHandleLongPress", "onScrolltolower", "onHandleDeletTheme", "onHandleCancel", "onHandleDelete"];
exports.default = User;

Page(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(User, true));