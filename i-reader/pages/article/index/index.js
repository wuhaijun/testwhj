// pages/subscribe/index/index.js
const util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    isRecommended: false,
    isSubscribed: true,
    hasSubscribed: true,
    showPosterMask: false,
    showShareBar: false,
    shareImg: "",
    shareContent: "",
    article:{},
    shareArticleId:""
  },
  onLoad: function (options) {

  },
  onLoaded: function (e) {
    if (this.data.isSubscribed) {
      if (!e.detail.data || e.detail.data.length == 0 && e.detail.page == 1) {
        this.setData({ hasSubscribed: false, isRecommended: true, isSubscribed: false });
        // this.__requestArticleCardsCompLoad__();
      } else { 
        this.setData({ hasSubscribed: true })
      }
    }
  },

  toggleTab(e) {
    this.setData({
      isRecommended: !this.data.isRecommended,
      isSubscribed: !this.data.isSubscribed
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
      shareArticleId:article._id
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

  onShow: function (options) {
    this.setData({isRecommended:false,isSubscribed:true});
    this.__requestArticleCardsCompLoad__();
  },
  
  __requestArticleCardsCompLoad__:function() {
    let articleCardsComp = this.selectComponent('#article-cards');
    let pageClicked = articleCardsComp.data.pageClicked;
    articleCardsComp.load(pageClicked, pageClicked != 0,"self");
  },

  onHide: function (options) {
    // this.selectComponent('#article-cards').clear();
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: this.data.article.title,
        path: '/pages/article/detail/index?id=' + this.data.article._id +"&sharedArticle=sharedArticle",
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
          this.setData({ showShareBar: false });
        }
      }
    }
    if (res.from === 'menu') {
      let nickName = '';
      let userInfo = wx.getStorageSync('user_info');
      if (userInfo) {
        nickName = userInfo.nickName;
      }
      return {
        title: nickName + "正在邀请你来脑洞阅读",
        path: '/pages/article/index/index',
        success: (res) => {
          if (res.errMsg == "shareAppMessage:ok") {
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
          this.setData({ showShareBar: false });
        }
      }
    }
  },

  changeShareCount: function (types) {
    app.service({
      url: '/api/project/share',
      method: 'POST',
      data: { id: this.data.article._id, type: types },
      success: res => {
        if (res.data.operator == "add") {
          this.selectComponent('#article-cards').addShareCount(this.data.article._id);
        }
      }
    })
  }
})