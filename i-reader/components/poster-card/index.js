const app = getApp();
var util = require('../../utils/util.js');
var config = require('../../config.js');

Component({
  properties: {
    coverImage: {
      type: String,
      value: "",
    },
    title: {
      type: String,
      value: "",
    },
    nickName: {
      type: String,
      value: "",
    },
    shareArticleId: {
      type: String,
      value: ""
    },
    showTips: {
      type: Boolean,
      value: true
    },
    shareText: {
      type: String,
      value: "",
    },
    qrImage: {
      type: String,
      value: ""
    }
  },

  canvasWidth: 0,
  canvasHeight: 0,

  ready: function () {
    let user_info = wx.getStorageSync('user_info');
    let qrImage = config.server + '/api/common/weqr?scene=' + encodeURIComponent(this.data.shareArticleId) + "&page=" + encodeURIComponent("pages/article/detail/index");
    this.setData({ appName: config.app.appName, nickName: user_info.nickName, qrImage: qrImage, arrDate: util.getDate()});
    if (this.data.coverImage.indexOf("https") == -1) {
      this.setData({ coverImage: this.data.coverImage.replace("http", "https") });
    }

    this.__getClientRect__().then((res) => {
      this.canvasWidth = res.width
      this.canvasHeight = res.height
      this.setData({ canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight });
    }).catch(() => {
      let systemInfo = wx.getSystemInfoSync();
      this.canvasWidth = systemInfo.screenWidth
      this.canvasHeight = systemInfo.screenHeight * 0.85
      this.setData({ canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight });
      console.log('Cannot get the component react info, get the screen width and height: ', this.canvasWidth, this.canvasHeight);
    })

    setTimeout(() => {
      this.setData({
        showTips: false,
      });
    }, 2500);
  },

  methods: {
    __getClientRect__: function() {
      return new Promise((resolve, reject) => {
        let query = wx.createSelectorQuery().in(this);
        let nodeRef = query.select('#modal-poster');
        nodeRef.boundingClientRect(res => {
          if (!res) {
            console.warn('Cannot get the client react for #modal-poster');
            reject();
          } else {
            resolve(res)
          }
        }).exec();
      })
    },

    __madeCanvas__: function () {
      wx.getImageInfo({
        src: this.data.qrImage,
        success: (res) => {
          this.setData({ qrImagePath: res.path });
          if (this.data.coverImage) {
            wx.getImageInfo({
              src: this.data.coverImage,
              success: (res) => {
                this.setData({ coverImagePath: res.path });
                this.drawCanvas();
              },
              fail: (res) => {
              }
            })
          } else {
            this.drawCanvas();
          }
        },
        fail: (res) => {
          console.warn("res", res.errMsg);
        }
      })
    },

    onSavePoster: function (event) {
      this.__madeCanvas__();
      wx.showLoading({
        title: '保存中',
      });
    },

    canvasToTempFilePath: function () {
      var that = this;
      let systemInfo = wx.getSystemInfoSync();
      wx.canvasToTempFilePath({
        quality: 1,
        canvasId: 'posterImg',
        success: function (res) {
          that.setData({
            posterUrl: res.tempFilePath,
          })
          that.saveImageToPhoto();
        },
        fail: function (res) {
        },
        complete: function (res) {
          wx.hideLoading();
        }
      }, that);
    },

    saveImageToPhoto: function () {
      var that = this;
      wx.saveImageToPhotosAlbum({
        filePath: that.data.posterUrl,
        success(res) {
          that.triggerEvent("saveSuccessPoster");
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail(res) {
          if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
            that.authorizeFail();
          }
          if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
            wx.showToast({
              title: '取消保存',
              icon: 'none',
              duration: 1500
            })
          }
        }

      })


    },
    authorizeFail: function () {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum']) {

          } else {
            wx.showModal({
              title: '保存相册未授权',
              content: '如需正常使用小程序，请点击授权按钮，勾选保存到相册。',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                    }
                  })
                }
              }
            })
          }
        }
      })
    },
    drawCanvas: function () {
      let ctx = wx.createCanvasContext('posterImg', this);
      ctx.clearRect(0, 0, 0, 0);

      //定义整个canvas的宽高,是个矩形，填充背景为白色
      let widthCanvas = this.canvasWidth;
      let heightCanvas = this.canvasHeight;
      ctx.setFillStyle('white');
      ctx.fillRect(0, 0, widthCanvas, heightCanvas);
      ctx.fill();

      //规定内容距离左右的边距
      let spaceAround = 36 / 2;
      //内容居中的宽度
      let autoWidth = widthCanvas - spaceAround * 2;
      let blackColor = "#000000";
      let lightColor = "#8a8a8a";

      //画矩形 日期和斜边
      let dateRectWidth = 35;
      let dateRectHeigth = 35;
      ctx.setStrokeStyle(blackColor);
      ctx.strokeRect(spaceAround, spaceAround, dateRectWidth, dateRectHeigth);
      ctx.moveTo(spaceAround + 4, spaceAround + dateRectWidth - 4);
      ctx.lineTo(spaceAround + dateRectHeigth - 4, spaceAround + 4);
      ctx.setStrokeStyle(lightColor);
      ctx.setFontSize(12);
      ctx.setFillStyle(blackColor);
      ctx.fillText(this.data.arrDate[2], 24, 31, 50);
      ctx.fillText(this.data.arrDate[1], 36, 48, 50);

      //日期显示
      ctx.setFillStyle(lightColor);
      ctx.setFontSize(10);
      ctx.fillText(this.data.arrDate[2] + "/" + this.data.arrDate[1] + "/" + this.data.arrDate[0], 18 + 35 + 6, spaceAround + 10, 100);

      //昵称
      ctx.setFontSize(10);
      ctx.setFillStyle(blackColor);
      ctx.fillText(this.data.nickName, 18 + 35 + 6, spaceAround + 10 + 20);
      let nickNameWidth = ctx.measureText(this.data.nickName);
      ctx.setFontSize(10);
      ctx.setFillStyle(lightColor);
      let headText = '正在阅读这篇文章';
      if (!this.data.coverImagePath) {
        headText = "在" + config.app.appName + "上分享了一段文字";
      }

      ctx.fillText(headText, 18 + 35 + 6 + 10 + nickNameWidth.width, spaceAround + 10 + 20)
      //封面图片
      if (this.data.coverImagePath) {
        ctx.drawImage(this.data.coverImagePath, spaceAround, spaceAround + 35 + 27, autoWidth, autoWidth * 3 / 5);
      }
      //title文章标题
      let textTitle = this.data.title;
      if (this.data.coverImagePath) {
        textTitle = textTitle.substring(0, 50);
      } else {
        textTitle = textTitle.substring(0, 140);
      }
      let chr = textTitle.split("");

      let temp = "";
      let row = [];
      ctx.setFontSize(18);
      ctx.setFillStyle(blackColor);
      for (let i = 0; i < chr.length; i++) {
        if ((ctx.measureText(temp).width < autoWidth) && chr[i].charCodeAt() != 10) {
          temp += chr[i];
        } else {
          row.push(temp);
          temp = "";
          temp = chr[i];
        }
      }
      row.push(temp);

      let coverImageHeight;
      if (!this.data.coverImagePath) {
        coverImageHeight = 30 + 60 + spaceAround + 35 + 27;
      } else {
        coverImageHeight = 20 + 30 + autoWidth * 3 / 5 + spaceAround + 35 + 27;
      }
      for (let i = 0; i < row.length; i++) {
        ctx.setTextAlign('justify');
        ctx.fillText(row[i], spaceAround, i * 24 + coverImageHeight, autoWidth);
      }

      //底部区域带背景色 二维码区域
      ctx.setFillStyle('#fff');
      let footerHeight = 124 / 2;
      let footerWidth = widthCanvas;
      let footerRectY = heightCanvas - footerHeight;
      ctx.fillRect(0, footerRectY, footerWidth, footerHeight);
      
      ctx.setLineWidth(1);
      ctx.setStrokeStyle('#eaeaea');
      ctx.moveTo(spaceAround, footerRectY);
      ctx.lineTo(spaceAround + autoWidth, footerRectY);

      //底部二维码图片
      ctx.drawImage(this.data.qrImagePath, spaceAround, footerRectY + 6, 50, 50);

      ctx.setFillStyle(blackColor);
      ctx.setFontSize(10);
      ctx.fillText('长按小程序码', spaceAround + 50 + 18, footerRectY + 28);

      ctx.setFillStyle(blackColor);
      ctx.setFontSize(10);
      ctx.fillText("进入" + config.app.appName + ' 阅读全文', spaceAround + 50 + 18, footerRectY + 42);
      ctx.stroke();
      ctx.draw(false, setTimeout(() => {
        this.canvasToTempFilePath();
      }, 2500));
    },
    onEditTitle: function (event) {
      this.setData({
        showTips: false,
      });
      let titleContent = event.currentTarget.dataset.text;
      let textLimit = event.currentTarget.dataset.limit;
      wx.navigateTo({
        url: '/pages/article/edit/index?text=' + titleContent + "&textLimit=" + textLimit
      })

    }
  }
})