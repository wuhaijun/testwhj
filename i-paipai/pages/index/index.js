var config = require('../../config.js');
var util = require('../../utils/util.js');

const app = getApp();
Page({
  data: {
    dateTab: true,
    scrollTop: 0,
    hasFixed: false,
    categories: {},
    firstDate: '',
    lastDate: ''
  },

  onLoad: function (options) {
    app.service({
      url: '/api/photo/dates',
      success: res => {
        let firstDate = res.data.firstDate && util.formatDate(new Date(res.data.firstDate));
        let lastDate = res.data.lastDate && util.formatDate(new Date(res.data.lastDate));
        this.setData({ firstDate: (firstDate || '').replace(/\-/g, '.'), lastDate: (lastDate || '').replace(/\-/g, '.') })
      }
    })

    wx.getSystemInfo({
      success: res => {
        var hight = res.screenHeight * 2;  // 转化成rpx
        this.setData({ scrollHeight: hight });
      }
    })
  },

  // 时间轴和分类列表tab切换
  showDateTab: function () {
    this.setData({ dateTab: true })
  },
  showCategoryTab: function (event) {
    wx.showLoading({
      title: '加载中...',
    })
    app.service({
      url: '/api/photo/categories',
      success: res => {
        wx.hideLoading();
        let listByLocation = res.data.listByLocation;
        // if (listByLocation.length > 0){
        //   [1, 2, 3].forEach(it => {
        //     listByLocation.push({
        //       "location": " ",
        //       "data": ["/public/icons/no-pic.png"]
        //     });
        //   });
        // }

        res.data.listByLocation = listByLocation.slice(0, 4);
        this.setData({ categories: res.data || {} })
      }
    });
    this.setData({ dateTab: false })
  },

  scroll: function (e) {
    var scrollTop = this.data.scrollTop;
    this.setData({ scrollTop: e.detail.scrollTop });
    var hasFixed = this.data.hasFixed;
    if (scrollTop >= 118 && this.data.dateTab) {
      this.setData({
        hasFixed: true
      })
    } else {
      this.setData({
        hasFixed: false
      })
    }
  },

  /**
   * 用户滚动到顶部 
   */
  upper: function () {
    this.setData({ hasFixed: false });
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    return {
      title: '脑洞随手拍',
      path: '/pages/index/index',
      //imageUrl:"/public/icons/logo.png",
      success: function (res) {
        if (res.errMsg == "shareAppMessage:ok") {
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        if (res.errMsg == "shareAppMessage:fail cancel") {
          wx.showToast({
            title: '转发取消',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '转发失败',
            duration: 2000
          })
        }
      }
    }

  }

})