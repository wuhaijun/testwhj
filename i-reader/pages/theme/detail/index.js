let config = require('../../../config.js');
const util = require('../../../utils/util.js');

const app = getApp();
Page({
  data: {
    theme: {},
    scroll: false,
    imageHost: config.qiniu.imageHost,
    showPosterMask: false,
    showShareBar: false,
    article: {},
    shareImg: "",
    shareContent: "",
    shareArticleId:""
  },

  onLoad: function (options) {
    options.isCollect = options.isCollect === "true" ? true : false;
    this.setData({
      theme: options
    });
    wx.hideShareMenu();
  },

  onShow: function (options) {
    this.selectComponent('#article-cards').load();
  },

  onHide: function (options) {
    this.selectComponent('#article-cards').clear();
  },

  onSubscribe: function (e) {
    let _id = e.currentTarget.dataset._id;
    app.service({
      url: '/api/theme/toggleCollect',
      method: 'POST',
      data: {
        id: _id
      },
      success: res => {
        let theme = this.data.theme;
        if (res.data.operator == 'add') {
          this.data.theme.count++
        } else if (res.data.operator == "cancel") {
          this.data.theme.count--
        }
        theme.isCollect = !theme.isCollect;
        this.setData({
          theme: theme
        });
      },
    })
  },

  onUnload: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isCollect: this.data.theme,
    });
  },

  onPageScroll: function () {
    if (!this.data.scroll) this.setData({
      scroll: true
    })
  },

  onPullDownRefresh: function () {
    this.setData({
      scroll: false
    })
  },

  onReachBottom: function () {
    let articleList = this.selectComponent('#article-cards');
    articleList.loadMore();
  },

  onShareBox: function (event) {
    let article = event.detail.currentTarget.dataset.value;
    this.setData({
      showShareBar: true,
      shareContent: util.replaceHtmlChar(article.title),
      shareImg: article.coverImg.url || '',
      article: article,
      shareArticleId: article._id
    })
  },

  onClickMask: function (event) {
    this.setData({
      showShareBar: false
    });
  },

  hidePoster: function (event) {
    this.setData({
      showPosterMask: false
    });
  },

  saveSuccessPoster: function (event) {
    this.hidePoster();
    this.changeShareCount("img");
  },

  onMadePoster: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            showPosterMask: true,
            showShareBar: false
          });
        } else {
          wx.showModal({
            title: '用户未登录授权',
            content: '请先到用户中心登录授权。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/user/index/index'
                })
              }
            }
          })
        }
      }
    })
  },

  onShareAppMessage: function (res) {
    return {
      title: this.data.article.title,
      path: '/pages/article/detail/index?id=' + this.data.article._id,
      imageUrl: this.data.article.coverImg.url,
      success: (res) => {
        if (res.errMsg == "shareAppMessage:ok") {
          this.changeShareCount("chat");
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 1500
          })
        }
      },
      fail: (res) => {
        if (res.errMsg == "shareAppMessage:fail cancel") {
          wx.showToast({
            title: '转发取消',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '转发失败',
            duration: 1500
          })
        }
      },
      complete: (res) => {
        this.setData({
          showShareBar: false
        });
      }
    }
  },

  changeShareCount: function (types) {
    app.service({
      url: '/api/project/share',
      method: 'POST',
      data: {
        id: this.data.article._id,
        type: types
      },
      success: res => {
        if (res.data.operator == "add") {
          this.selectComponent('#article-cards').addShareCount(this.data.article._id);
        }
      }
    })
  }
})