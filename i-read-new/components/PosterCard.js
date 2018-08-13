"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _util = require("../utils/util.js");

var _util2 = _interopRequireDefault(_util);

var _common = require("../actions/common.js");

var _index3 = require("../npm/@tarojs/redux/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = {
  "server": "https://ireader.brainboom.cn",
  "qiniu_imageHost": "http://boom-static.static.cceato.com/",
  "appName": "\u4E09\u5343\u7C73\uD83D\uDC2C"
};


var mapState = function mapState(state) {
  return { textContent: state.textContent };
};

var mapDispatch = function mapDispatch(dispatch) {
  return {
    changeText: function changeText(textContent) {
      dispatch((0, _common.changeText)(textContent));
    }
  };
};

var PosterCard = (_dec = (0, _index3.connect)(mapState, mapDispatch), _dec(_class = function (_BaseComponent) {
  _inherits(PosterCard, _BaseComponent);

  function PosterCard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PosterCard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PosterCard.__proto__ || Object.getPrototypeOf(PosterCard)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "coverImage", "showTips", "appName", "nickName", "qrImage", "arrDate", "canvasWidth", "canvasHeight", "qrImagePath", "textContent"], _this.__getClientRect__ = function () {
      var that = _this;
      return new Promise(function (resolve, reject) {
        var query = wx.createSelectorQuery().in(that.$scope);
        var nodeRef = query.select('#modal-poster');
        nodeRef.boundingClientRect(function (res) {
          if (!res) {
            console.warn('Cannot get the client react for #modal-poster');
            reject();
          } else {
            resolve(res);
          }
        }).exec();
      });
    }, _this.onSavePoster = function (e) {
      _this.__madeCanvas__();
      _index2.default.showLoading({
        title: '保存中'
      });
    }, _this.__madeCanvas__ = function () {
      _index2.default.getImageInfo({
        src: _this.state.qrImage,
        success: function success(res) {
          _this.setState({
            qrImagePath: res.path
          }, function () {
            if (_this.state.coverImage) {
              _index2.default.getImageInfo({
                src: _this.state.coverImage,
                success: function success(res) {
                  var coverImagePath = res.path;
                  _this.drawCanvas(coverImagePath);
                },
                fail: function fail(res) {}
              });
            } else {
              _this.drawCanvas();
            }
          });
        },
        fail: function fail(res) {
          console.warn("res", res.errMsg);
        }
      });
    }, _this.drawCanvas = function (coverImagePath) {

      var ctx = wx.createCanvasContext('posterImg', _this.$scope);
      ctx.clearRect(0, 0, 0, 0);
      //定义整个canvas的宽高,是个矩形，填充背景为白色
      var widthCanvas = _this.state.canvasWidth;
      var heightCanvas = _this.state.canvasHeight;
      ctx.setFillStyle('white');
      ctx.fillRect(0, 0, widthCanvas, heightCanvas);
      ctx.fill();

      //规定内容距离左右的边距
      var spaceAround = 36 / 2;
      //内容居中的宽度
      var autoWidth = widthCanvas - spaceAround * 2;
      var blackColor = "#000000";
      var lightColor = "#8a8a8a";

      //画矩形 日期和斜边
      var dateRectWidth = 35;
      var dateRectHeigth = 35;
      ctx.setStrokeStyle(blackColor);
      ctx.strokeRect(spaceAround, spaceAround, dateRectWidth, dateRectHeigth);
      ctx.moveTo(spaceAround + 4, spaceAround + dateRectWidth - 4);
      ctx.lineTo(spaceAround + dateRectHeigth - 4, spaceAround + 4);
      ctx.setStrokeStyle(lightColor);
      ctx.setFontSize(12);
      ctx.setFillStyle(blackColor);
      ctx.fillText(_this.state.arrDate[2], 24, 31, 50);
      ctx.fillText(_this.state.arrDate[1], 36, 48, 50);

      //日期显示
      ctx.setFillStyle(lightColor);
      ctx.setFontSize(10);
      ctx.fillText(_this.state.arrDate[2] + "/" + _this.state.arrDate[1] + "/" + _this.state.arrDate[0], 18 + 35 + 6, spaceAround + 10, 100);

      //昵称
      ctx.setFontSize(10);
      ctx.setFillStyle(blackColor);
      ctx.fillText(_this.state.nickName, 18 + 35 + 6, spaceAround + 10 + 20);
      var nickNameWidth = ctx.measureText(_this.state.nickName);
      ctx.setFontSize(10);
      ctx.setFillStyle(lightColor);
      var headText = '正在阅读这篇文章';
      if (!coverImagePath) {
        headText = "在" + config.appName + "上分享了一段文字";
      }

      ctx.fillText(headText, 18 + 35 + 6 + 10 + nickNameWidth.width, spaceAround + 10 + 20);
      //封面图片

      if (coverImagePath) {
        ctx.drawImage(coverImagePath, spaceAround, spaceAround + 35 + 27, autoWidth, autoWidth * 3 / 5);
      }
      //title文章标题
      var textTitle = _this.props.textContent;
      if (coverImagePath) {
        textTitle = textTitle.substring(0, 50);
      } else {
        textTitle = textTitle.substring(0, 140);
      }
      var chr = _this.props.textContent.split("");

      var temp = "";
      var row = [];
      ctx.setFontSize(18);
      ctx.setFillStyle(blackColor);
      for (var i = 0; i < chr.length; i++) {
        if (ctx.measureText(temp).width < autoWidth && chr[i].charCodeAt() != 10) {
          temp += chr[i];
        } else {
          row.push(temp);
          temp = "";
          temp = chr[i];
        }
      }
      row.push(temp);

      var coverImageHeight = void 0;
      if (!coverImagePath) {
        coverImageHeight = 30 + 60 + spaceAround + 35 + 27;
      } else {
        coverImageHeight = 20 + 30 + autoWidth * 3 / 5 + spaceAround + 35 + 27;
      }
      for (var _i = 0; _i < row.length; _i++) {
        ctx.setTextAlign('justify');
        ctx.fillText(row[_i], spaceAround, _i * 24 + coverImageHeight, autoWidth);
      }

      //底部区域带背景色 二维码区域
      ctx.setFillStyle('#fff');
      var footerHeight = 124 / 2;
      var footerWidth = widthCanvas;
      var footerRectY = heightCanvas - footerHeight;
      ctx.fillRect(0, footerRectY, footerWidth, footerHeight);

      ctx.setLineWidth(1);
      ctx.setStrokeStyle('#eaeaea');
      ctx.moveTo(spaceAround, footerRectY);
      ctx.lineTo(spaceAround + autoWidth, footerRectY);

      //底部二维码图片
      ctx.drawImage(_this.state.qrImagePath, spaceAround, footerRectY + 6, 50, 50);

      ctx.setFillStyle(blackColor);
      ctx.setFontSize(10);
      ctx.fillText('长按小程序码', spaceAround + 50 + 18, footerRectY + 28);

      ctx.setFillStyle(blackColor);
      ctx.setFontSize(10);
      ctx.fillText("进入" + config.appName + ' 阅读全文', spaceAround + 50 + 18, footerRectY + 42);
      ctx.stroke();
      ctx.draw(false, setTimeout(function () {
        _this.canvasToTempFilePath();
      }, 2500));
    }, _this.canvasToTempFilePath = function () {
      var that = _this;

      wx.canvasToTempFilePath({
        quality: 1,
        canvasId: 'posterImg',
        success: function success(res) {
          var posterUrl = res.tempFilePath;
          that.saveImageToPhoto(posterUrl);
        },
        fail: function fail(res) {},
        complete: function complete(res) {
          wx.hideLoading();
        }
      }, that.$scope);
    }, _this.saveImageToPhoto = function (posterUrl) {
      var that = _this;
      wx.saveImageToPhotosAlbum({
        filePath: posterUrl,
        success: function success(res) {
          that.onHandHide();
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function fail(res) {
          if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
            that.authorizeFail();
          }
          if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
            wx.showToast({
              title: '取消保存',
              icon: 'none',
              duration: 1500
            });
          }
        }
      });
    }, _this.authorizeFail = function () {
      wx.getSetting({
        success: function success(res) {
          if (res.authSetting['scope.writePhotosAlbum']) {} else {
            wx.showModal({
              title: '保存相册未授权',
              content: '如需正常使用小程序，请点击授权按钮，勾选保存到相册。',
              showCancel: false,
              success: function success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function success(res) {}
                  });
                }
              }
            });
          }
        }
      });
    }, _this.onEditTitle = function (e) {
      _this.setState({
        showTips: false
      });
      var titleContent = e.currentTarget.dataset.text;
      var textLimit = e.currentTarget.dataset.limit;
      _index2.default.navigateTo({
        url: '/pages/projects/edit?text=' + titleContent + "&textLimit=" + textLimit
      });
    }, _this.onHandHide = function () {
      _this.__triggerPropsFn("onHandHide", [null].concat([]));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PosterCard, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(PosterCard.prototype.__proto__ || Object.getPrototypeOf(PosterCard.prototype), "_constructor", this).call(this, props);
      this.state = {
        appName: '',
        nickName: '',
        qrImage: '',
        arrDate: '',
        showTips: true,
        canvasWidth: 0,
        canvasHeight: 0,
        qrImagePath: '',
        coverImage: ''
      };
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.props.changeText(this.props.title);

      var user_info = _index2.default.getStorageSync('user_info');
      var qrImage = config.server + '/api/common/weqr?scene=' + encodeURIComponent(this.props.shareArticleId) + "&page=" + encodeURIComponent("pages/article/detail/index");
      var coverImage = this.props.coverImage;
      if (coverImage && this.props.coverImage.indexOf("https") == -1) {
        coverImage = coverImage.replace("http", "https");
      }

      this.setState({
        appName: config.appName,
        nickName: user_info.nickName,
        qrImage: qrImage,
        arrDate: _util2.default.getDate(),
        coverImage: coverImage

      }, function () {});

      this.__getClientRect__().then(function (res) {
        _this2.canvasWidth = res.width;
        _this2.canvasHeight = res.height;
        _this2.setState({ canvasWidth: _this2.canvasWidth, canvasHeight: _this2.canvasHeight });
      }).catch(function () {
        var systemInfo = wx.getSystemInfoSync();
        var canvasWidth = systemInfo.screenWidth;
        var canvasHeight = systemInfo.screenHeight * 0.85;
        _this2.setState({ canvasWidth: canvasWidth, canvasHeight: canvasHeight });
        console.log('Cannot get the component react info, get the screen width and height: ', _this2.canvasWidth, _this2.canvasHeight);
      });

      setTimeout(function () {
        _this2.setState({
          showTips: false
        });
      }, 2500);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {}
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {}
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};

      var coverImage = this.__props.coverImage;
      var title = this.__props.title;
      var shareArticleId = this.__props.shareArticleId;
      var showTips = this.__state.showTips;
      var TextShow = null;
      var coverImageShow = null;
      var contentTitleShow = null;
      var styleObject = {
        width: this.__state.canvasWidth + "px",
        height: this.__state.canvasHeight + "px"
      };

      if (coverImage) {} else {
        coverImageShow = null;
      }

      var anonymousState__temp = this.__state.arrDate[2];
      var anonymousState__temp2 = this.__state.arrDate[1];
      var anonymousState__temp3 = (0, _index.internal_inline_style)(styleObject);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3
      });
      return this.__state;
    }
  }]);

  return PosterCard;
}(_index.Component)) || _class);
PosterCard.properties = {
  "changeText": null,
  "title": null,
  "shareArticleId": null,
  "coverImage": null,
  "textContent": null,
  "__fn_onHandHide": null
};
PosterCard.$$events = ["onEditTitle", "onSavePoster"];
exports.default = PosterCard;

Component(require('../npm/@tarojs/taro-weapp/index.js').default.createComponent(PosterCard));