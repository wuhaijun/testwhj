const app = getApp();
var util = require('../../utils/util.js');
var GetLunarCalendar = require('../../utils/getLunarCalendar.js');

Component({
  properties: {
    body: {
      type: Object,
      value: {title:"",image:"",content:""}
    },
    nickname: {
      type:String,
      value: ""
    },
    isShow: {
      type: Boolean,
      value:false
    }
  },
  ready: function () {
    this.__getDate__();
    // this.__madeCanvas__();
  },
  methods: {
    // onSavePoster: function () {
    //   this.triggerEvent('savePoster',{});
    // },
    __preventTouchMove__: function () {
    },
    __getDate__: function () {
      let arrDate = util.getDate();
      let lunarDate = GetLunarCalendar.getLunarDate();
      this.setData({
        arrDate: arrDate,
        lunarDate: lunarDate
      });
    },
    __hideSnap__: function() {
      this.setData({isShow: false});
    },
    // __madeCanvas__: function () {
    //   const wxGetImageInfo = util.wxPromisify(wx.getImageInfo);
    //   wxGetImageInfo({
    //     src: this.data.coverImage
    //   }).then(res => {
    //     console.log("image",res);
    //     const ctx = wx.createCanvasContext('posterImg',this);
    //     ctx.clearRect(0, 0, 0, 0);

    //     //定义整个canvas的宽高,是个矩形，填充背景为白色
    //     const widthCanvas = app.globalData.systemInfo.windowWidth;
    //     const heightCanvas = app.globalData.systemInfo.windowHeight;

    //     ctx.setFillStyle('white');
    //     ctx.setStrokeStyle('white');
    //     ctx.rect(0, 0, widthCanvas, heightCanvas);

    //     ctx.fill();

    //     //规定内容距离左右的边距
    //     let spaceAround = 36 / 2;
    //     //内容居中的宽度
    //     let autoWidth = widthCanvas - spaceAround * 2;
    //     let blackColor = "#000000";
    //     let lightColor = "#8a8a8a";

    //     //画矩形 日期和斜边
    //     let dateRectWidth = 35;
    //     let dateRectHeigth = 35;
    //     ctx.setStrokeStyle(blackColor);
    //     ctx.strokeRect(spaceAround, spaceAround, dateRectWidth, dateRectHeigth);
    //     ctx.moveTo(spaceAround + 4, spaceAround + dateRectWidth - 4);
    //     ctx.lineTo(spaceAround + dateRectHeigth - 4, spaceAround + 4);
    //     ctx.setStrokeStyle(lightColor);
    //     ctx.setFontSize(10);
    //     ctx.setFillStyle(blackColor)
    //     ctx.fillText(this.data.arrDate[2], 24, 29, 50);
    //     ctx.fillText(this.data.arrDate[1], 38, 48, 50);

    //     //日期显示
    //     ctx.setFillStyle(lightColor);
    //     ctx.setFontSize(10);
    //     ctx.fillText(this.data.arrDate[2]+"/"+this.data.arrDate[1]+"/"+this.data.arrDate[0], 18 + 35 + 6, spaceAround + 10, 100);

    //     //昵称
    //     ctx.setFontSize(10);
    //     ctx.setFillStyle(blackColor);
    //     ctx.fillText('昵称', 18 + 35 + 6, spaceAround + 10 + 20, 50);

    //     ctx.setFontSize(10);
    //     ctx.setFillStyle(lightColor);
    //     ctx.fillText('正在脑洞阅读 上阅读', 18 + 35 + 6 + 30, spaceAround + 10 + 20, 50)
    //     //封面图片
    //     ctx.drawImage(res.path, spaceAround, spaceAround + 10 + 20 + 27, autoWidth, autoWidth * 3 / 5);

    //     //title文章标题
    //     let textTitle = this.data.title;
    //     textTitle = textTitle.substring(0, 50);
    //     let chr = textTitle.split("");
    //     let temp = "";
    //     let row = [];
    //     ctx.setFontSize(20);
    //     ctx.setFillStyle(blackColor);
    //     for (let i = 0; i < chr.length; i++) {
    //       if (ctx.measureText(temp).width < autoWidth) {
    //         temp += chr[i];
    //       } else {
    //         row.push(temp);
    //         temp = "";
    //       }
    //     }
    //     row.push(temp);
    //     if (row.length == 2) {
    //       let rowCut = row.slice(0, 2);
    //       let rowPart = rowCut[1];
    //       let test = "";
    //       let empty = [];
    //       for (let i = 0; i < rowPart.length; i++) {
    //         if (ctx.measureText(test).width < autoWidth) {
    //           test += rowPart[i];
    //         } else {
    //           break;
    //         }
    //       }
    //       empty.push(test);
    //       let group;
    //       if (empty[0].length < 24) {
    //         group = empty[0];
    //       } else {
    //         group = empty[0] + "...";
    //       }
    //       rowCut.splice(1, 1, group);
    //       row = rowCut;
    //     }
    //     for (let i = 0; i < row.length; i++) {
    //       ctx.fillText(row[i], spaceAround, 30 + i * 30 + spaceAround + 10 + 20 + 27 + autoWidth * 3 / 5 + 20, autoWidth);
    //     }

    //     //农历日期显示
    //     ctx.setFillStyle(lightColor);
    //     ctx.setFontSize(10);
    //     ctx.fillText('/农历', widthCanvas - spaceAround - 80, heightCanvas - 124 / 2 - 16);

    //     //农历日期显示
    //     ctx.setFillStyle(lightColor);
    //     ctx.setFontSize(10);
    //     ctx.fillText(this.data.lunarDate, widthCanvas - spaceAround - 46, heightCanvas - 124 / 2 - 16);

    //     //底部区域带背景色 二维码区域
    //     ctx.setFillStyle('#f1f1f1');
    //     let footerHeight = 124 / 2;
    //     let footerWidth = widthCanvas;
    //     let footerRectY = heightCanvas - footerHeight;
    //     ctx.fillRect(0, footerRectY, footerWidth, footerHeight);

    //     //底部二维码图片
    //     ctx.drawImage(res.path, spaceAround, footerRectY + 6, 50, 50);

    //     ctx.setFillStyle(lightColor);
    //     ctx.setFontSize(10);
    //     ctx.fillText('From 脑洞阅读', spaceAround + 50 + 18, footerRectY + 18);

    //     ctx.setFillStyle(blackColor);
    //     ctx.setFontSize(10);
    //     ctx.fillText('长按小程序码', spaceAround + 50 + 18, footerRectY + 18 + 16);

    //     ctx.setFillStyle(blackColor);
    //     ctx.setFontSize(10);
    //     ctx.fillText('进入脑洞阅读 阅读原文', spaceAround + 50 + 18, footerRectY + 18 + 32);
    //     ctx.stroke();
    //     ctx.draw();
    //     console.log("done");

    //   })

    // },

    onSavePoster: function (event) {
      console.log("onSavePoster");
      var that = this;
      wx.showLoading({
        title: '保存中',
      })

      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        quality: 0.6,
        fileType:'jpg',
        canvasId: 'posterImg',
        success: function (res) {
          console.log("success",res.tempFilePath);
          that.setData({
            posterUrl: res.tempFilePath,
          })
          that.saveImageToPhoto();

        },
        fail: function (res) {
          console.log("fail",res)
        },
        complete: function (res) {
          wx.hideLoading();
        }
      },this)


    },
    saveImageToPhoto: function () {
      var that = this;
      wx.getSetting({
        success: (res) => {
          console.log("res setting", res, res.authSetting);
          console.log("res.authSetting[scope.writePhotosAlbum]", res.authSetting['scope.writePhotosAlbum']);

        }
      })
      wx.saveImageToPhotosAlbum({
        filePath: that.data.posterUrl,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          console.log("res success", res);
        },
        fail(res) {
          console.log("res fail", res);
          if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {

          }
        }
  
      })
    },
  }

})