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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var search = "/public/icon/icon_search.png";

var config = {
  "server": "https://ireader.brainboom.cn",
  "qiniu_imageHost": "http://boom-static.static.cceato.com/",
  "appName": "\u4E09\u5343\u7C73\uD83D\uDC2C"
};

var mapState = function mapState(state) {
  return {
    projectList: state.projectList,
    projectDetail: state.projectDetal,
    themeList: state.themeList,
    themeMapping: state.themeMapping
  };
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    onGetProjectList: function onGetProjectList(id, page) {
      dispatch((0, _project.getProjectList)(id, page));
    },
    doProjectShare: function doProjectShare(id, type) {
      dispatch((0, _project.doProjectShare)(id, type));
    },
    onGetThemeList: function onGetThemeList() {
      dispatch((0, _theme.getThemeList)());
    }
  };
};

var Project = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(Project, _BaseComponent);

  function Project() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Project);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Project.__proto__ || Object.getPrototypeOf(Project)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["asSubscribed", "isSubscribed", "isRecommended", "search", "page", "isClickShare", "showPosterMask", "shareImg", "shareArticleId", "shareContent", "projectType", "projectList", "themeMapping"], _this.onHandleToggleSub = function () {
      _this.setState(function (prevState) {
        return {
          isRecommended: !prevState.isRecommended,
          isSubscribed: !prevState.isSubscribed,
          projectType: ''
        };
      });
      _this.__triggerPropsFn("onGetProjectList", [null].concat(['', 1]));
    }, _this.onHandleToggleRec = function () {
      _this.setState(function (prevState) {
        return {
          isRecommended: !prevState.isRecommended,
          isSubscribed: !prevState.isSubscribed,
          projectType: 'subscribe'
        };
      });
      _this.__triggerPropsFn("onGetProjectList", [null].concat(['subscribe', 1]));
    }, _this.loadmore = function () {
      var page = Math.ceil(_this.props.projectList.length / 24);
      var nextPage = page + 1;
      _this.__triggerPropsFn("onGetProjectList", [null].concat([_this.state.projectType, nextPage]));
    }, _this.onReachBottom = function () {
      _this.loadmore();
    }, _this.onHandleShare = function (isClickShare, dataShare) {
      _this.setState({
        isClickShare: isClickShare,
        shareImg: dataShare.url,
        shareArticleId: dataShare.id,
        shareContent: dataShare.title
      });
    }, _this.onHandHide = function () {
      _this.props.doProjectShare(_this.state.shareArticleId, "img");
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
    }, _this.onMadePoster = function () {

      wx.getSetting({
        success: function success(res) {
          if (res.authSetting['scope.userInfo']) {
            _this.setState({
              showPosterMask: true,
              isClickShare: false
            });
          } else {
            _index2.default.showModal({
              title: '用户未登录授权',
              content: '请先到用户中心登录授权。',
              showCancel: false,
              success: function success(res) {
                if (res.confirm) {
                  _index2.default.switchTab({
                    url: '/pages/user/index'
                  });
                }
              }
            });
          }
        }
      });
    }, _this.onShareAppMessage = function (res) {
      if (res.from === 'button') {
        return {
          title: _this.state.shareContent,
          path: '/pages/projects/detail/index?id=' + _this.state.shareArticleId + "&sharedArticle=sharedArticle",
          imageUrl: _this.state.shareImg,
          success: function success(res) {
            if (res.errMsg == "shareAppMessage:ok") {
              _this.props.doProjectShare(_this.state.shareArticleId, "chat");
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
            _this.setState({ showShareBar: false, isClickShare: false });
          }
        };
      }
      if (res.from === 'menu') {
        var nickName = '';
        var userInfo = wx.getStorageSync('user_info');
        if (userInfo) {
          nickName = userInfo.nickName;
        }
        return {
          title: nickName + "正在邀请你来" + config.appName,
          path: '/pages/projects/index',
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
            _this.setState({ showShareBar: false, isClickShare: false });
          }
        };
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Project, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Project.prototype.__proto__ || Object.getPrototypeOf(Project.prototype), "_constructor", this).call(this, props);
      this.state = {
        isRecommended: true,
        isSubscribed: false,
        page: 1,
        isClickShare: false,
        showPosterMask: false,
        shareImg: '',
        shareArticleId: '',
        shareContent: '',
        projectType: ''
      };
    }
  }, {
    key: "onHandleSearchClick",
    value: function onHandleSearchClick() {
      _index2.default.navigateTo({ url: '/pages/projects/search' });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.__triggerPropsFn("onGetProjectList", [null].concat(['', this.state.page]));
      this.__triggerPropsFn("onGetThemeList", [null].concat([]));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};

      var asSubscribed = this.__props.themeList.filter(function (item) {
        return item.isCollect;
      });
      var status = void 0;
      if (asSubscribed.length == 0) {} else {}
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
        asSubscribed: asSubscribed,
        search: search
      });
      return this.__state;
    }
  }]);

  return Project;
}(_index.Component)) || _class);
Project.properties = {
  "__fn_onGetProjectList": null,
  "__fn_onGetThemeList": null,
  "projectList": null,
  "doProjectShare": null,
  "themeList": null,
  "themeMapping": null
};
Project.$$events = ["onHandleToggleSub", "onHandleToggleRec", "onMadePoster", "onClickMask", "onHidePoster", "onHandHide", "onHandleShare"];
exports.default = Project;

Page(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Project, true));