//index.js
//获取应用实例
const util = require('../../../utils/util.js');
let ContentHandler = require('../../../utils/contentHandler.js');
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    collectList: [],
    themeList: {},
    noteList: [],
    user: {},
    themenumber: '',
    iscancel: false,
    articleId: '',
    collectnumber: '',
    showPosterMask: false,
    collectpage: 1,
    notepage: 1,
    loadCompleted: false,
    text: '',
    note: '',
    showPosterMask: false,
    showShareBar: false,
    article: {},
    shareContent: '',
    shareArticleId: ""

  },

  /** 
   * 滑动tab切换 
   */
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  toggle(e) {
    let current = e.target.dataset.current;
    this.setData({
      currentTab: current
    })
  },

  /** 
   * 获取笔记列表
   */
  noteType: function () {
    app.service({
      url: `/api/projectNote/list?page=${this.data.notepage}`,
      success: res => {
        res.data.forEach(item => {
          let newTime = util.formatTime(new Date(item.notedDate));
          item.notedDate = newTime;
        })
        let noteList = this.data.noteList;
        if (this.data.notepage === 1) {
          noteList = res.data
        } else {
          noteList = [...this.data.noteList, ...res.data]
        }
        if (!res.data || res.data.length == 0) {
          this.setData({
            loadCompleted: true
          });
        }
        this.setData({
          noteList,
        })
      }
    })
  },
  // 获取收藏列表
  getCollect() {
    app.service({
      url: `/api/projectCollect/list?page=${this.data.collectpage}`,
      success: res => {
        res.data.projectList.forEach(item => {
          item.datePublished = util.formatDate(new Date(item.datePublished));
          item.title = util.replaceHtmlChar(item.title);
        })
        let collectList = [];
        let themeList = {};
        // 当获取第一页的时候直接替换数组，后续的追加
        if (this.data.collectpage === 1) {
          collectList = res.data.projectList;
          themeList = res.data.themeList;
        } else {
          collectList = [...this.data.collectList, ...res.data.projectList];
          themeList = { ...this.data.themeList, ...res.data.themeList };
        }
        if (!res.data.projectList || res.data.projectList.length == 0) {
          this.setData({
            loadCompleted: true
          });
        }

        this.setData({
          collectList,
          themeList
        })
      }
    })
  },

  getUserInfomation() {
    app.service({
      url: '/api/user/info',
      success: res => {
        this.setData({
          user: res.data,
          themenumber: res.data.themeCollectCount,
          collectnumber: res.data.projectCollectCount,
        })
      }
    })
  },
  onLoad() {
    wx.hideShareMenu();
    this.getCollect();
    this.noteType();
    this.getUserInfomation();

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let userInfo = wx.getStorageSync('user_info');
          if (userInfo) {
            this.setData({
              userInfo: userInfo,
              hasUserInfo: false
            });
          } else {
            this.setData({
              hasUserInfo: true
            });
          };

        } else {
          this.setData({
            hasUserInfo: true
          });
        }
      }
    })

    let that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  bindGetUserInfo: function (e) {
    this.getUserInfomation();
    this.getCollect();
    this.noteType();
    if (e.detail.userInfo) {
      wx.setStorage({
        key: 'user_info',
        data: e.detail.userInfo,
      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: false
      })
    } else {
      this.setData({
        hasUserInfo: true
      })
    }

  },
  themecollect(e) {
    this.data.user.themeCollectCount = e.detail.collect.length;
    this.setData({
      user: this.data.user
    })
  },
  cancel() {
    this.setData({
      iscancel: false,
    })
  },
  __delete() {
    let index = this.data.collectList.find(item => item._id == this.data.articleId);
    this.data.collectList.splice(this.data.collectList[index], 1);
    app.service({
      url: '/api/project/toggleCollect?id=',
      method: 'POST',
      data: {
        id: this.data.articleId,
      },
      success: res => {
        this.setData({
          collectnumber: this.data.collectList.length,
          collectList: this.data.collectList,
          iscancel: false,
        })
        this.getUserInfomation();
      }
    })

  },
  longpress(e) {
    this.setData({
      iscancel: e.detail.showmodal,
      articleId: e.detail.articleId
    })
  },
  __scrolltolower(e) {
    if (!this.data.loadCompleted) {
      this.setData({
        collectpage: this.data.collectpage + 1
      }, () => {
        this.getCollect();
      });
    }
  },
  scrolltolower() {
    if (!this.data.loadCompleted) {
      this.setData({
        notepage: this.data.notepage + 1
      }, () => {
        this.noteType();
      });
    }
  },
  onShareBox: function (event) {
    let text = event.currentTarget.dataset.note;
    this.setData({
      showShareBar: true,
      shareContent: util.replaceHtmlChar(text),
      shareArticleId: event.currentTarget.dataset.id
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
    this.setData({
      showPosterMask: true,
      showShareBar: false
    });
  },

  onShow: function (options) {
    this.setData({
      collectpage: 1,
      loadCompleted: false,
    })
    this.getCollect();
    this.noteType();
    this.getUserInfomation();
    let themeCards = this.selectComponent('#theme-cards');
    if (themeCards) {
      themeCards._theme();
    }
  },

  onShareAppMessage: function (res) {
    let nickName = '';
    if (this.data.userInfo) {
      nickName = this.data.userInfo.nickName
    }
    return {
      title: nickName + "在脑洞阅读上分享了一段文字",
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
        id: this.data.shareArticleId,
        type: types
      },
      success: res => {
       
      }
    })
  }

})