// pages/subscribe/details/index.js
var ContentHandler = require('../../../utils/contentHandler.js');
var util = require('../../../utils/util.js');
var GetLunarCalendar = require('../../../utils/getLunarCalendar.js');
var config = require('../../../config.js');

const app = getApp();
Page({
  data: {
    showFooter: true,
    loading: true,
    showShareBar: false,
    notes: {}, //notes用来记录原始标注的信息，即从数据库中获取的标注信息
    showPosterMask: false,
    article: {},
    editorTitle: "",
    hasContent: true,
    shareImg: "",
    shareContent: "",
    shareArticleId: "",
    showBackHome:false,
    showBackHomeSmall:false
  },
  scrollTop: 0,
  windowHeight: wx.getSystemInfoSync().windowHeight,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info("options", options);
    let scene = decodeURIComponent(options.scene);
    let articleId;
    (scene != "undefined") ? articleId = scene : articleId = options.id;
    if (options.sharedArticle || (scene != "undefined")){
      this.setData({ showBackHome: true });
      this.setAnimation();
    }
    var that = this;
    app.service({
      url: '/api/project/detail/' + articleId,
      success: res => {
        //判断数据是否为空对象
        if (JSON.stringify(res.data) == "{}") {
          this.setData({
            loading: false,
            hasContent: false
          });
        } else {
          this.setData({
            hasContent: true
          });
          let articleTime = util.formatDate(new Date(res.data.datePublished));
          let notes = {};
          res.data.notes.forEach(note => {
            notes[note] = true;
          });
          this.setData({
            notes: notes,
          });

          res.data.likeProjects.projectList.forEach(item => {
            let newTime = util.formatDate(new Date(item.datePublished));
            item.datePublished = newTime;
            item.title = util.replaceHtmlChar(item.title);
          })
          let nodes = ContentHandler.handle(res.data.type)(res.data.text, that);
          this.setData({
            nodes: nodes,
            article: {
              title: util.replaceHtmlChar(res.data.title),
              datePublished: articleTime,
              biz_name: res.data.biz_name || '脑洞资讯平台',
              _id: options.id,
              coverImg: res.data.coverImg.url || '',
              isCollected: res.data.isCollected
            },
            editorTitle: util.replaceHtmlChar(res.data.title)
          },
            function () {
              this.setData({
                loading: false,
                relatedArticleList: res.data.likeProjects.projectList,
                themeList: res.data.likeProjects.themeList
              });
            });
        }

      }

    })

  },

  setAnimation: function() {
    let times = setTimeout(() => {
      this.setData({
        showBackHomeSmall: true,
        showBackHome: false,
      });
    }, 3200);
  },

  backHomePage: function () {
    wx.switchTab({
      url: '/pages/article/index/index'
    })
  },

  changebackHomeBtn: function () {
    this.setData({
      showBackHomeSmall: false,
      showBackHome: true,
    });
    this.setAnimation();
  },

  onToggleCollect: function (e) {
    app.service({
      url: '/api/project/toggleCollect',
      method: 'POST',
      data: {
        id: this.data.article._id
      },
      success: res => {
        let article = this.data.article;
        article.isCollected = !article.isCollected
        this.setData({
          article
        })
      }
    })
  },

  // onPageScroll: function (ev) {
  //   let ev_scrollTop = ev.scrollTop;
  //   if (ev_scrollTop <= 0) {
  //     ev_scrollTop = 0;
  //   }
  //   if (ev_scrollTop > this.scrollTop) {
  //     if (this.data.showFooter) {
  //       this.setData({
  //         showFooter: false
  //       })
  //     }
  //   } else {
  //     if (!this.data.showFooter) {
  //       this.setData({
  //         showFooter: true
  //       })
  //     }
  //   }
  //   this.scrollTop = ev_scrollTop;
  // },

  onMark: function (event) {
    let detail = event.detail;
    let touches = detail.touches[0];
    let value = detail.currentTarget.dataset.value;
    let index = value.index;
    let text = value.text;

    //设置popup的各项属性
    let popupComp = this.selectComponent("#popup");
    popupComp.setData({
      isShow: true,
      markInfo: {
        touches: touches,
        index: index,
        text: text,
        pid: this.data.article._id
      }
    });

    let htmlViewComp = this.selectComponent("#htmlView")
    let childNotes = htmlViewComp.data.notes;
    childNotes[index] = true;
    htmlViewComp.setData({
      notes: childNotes
    });
  },

  //给popup使用，实现操作后的mark取消
  unMark: function (event) {
    let detail = event.detail;
    let index = detail.index;
    if (!this.isPersistenced(index)) {
      let htmlViewComp = this.selectComponent("#htmlView");
      let childNotes = htmlViewComp.data.notes;
      childNotes[index] = false;
      htmlViewComp.setData({
        notes: childNotes
      });
    }
  },

  //当前组件上的mark取消，用户主动行为
  cancelMark: function () {
    let popupComp = this.selectComponent("#popup");
    popupComp.setData({
      isShow: false
    });
    this.setData({
      notes: this.data.notes
    });
  },

  callbackSaveNote: function (event) {
    let detail = event.detail;
    let index = detail.index;
    let newNotesForThis = {};
    Object.assign(newNotesForThis, this.data.notes);
    newNotesForThis[index] = true;
    this.setData({
      notes: newNotesForThis
    });
  },

  callbackCancelNote: function (event) {
    let detail = event.detail;
    let index = detail.index;
    let newNotesForThis = {};
    Object.assign(newNotesForThis, this.data.notes);
    newNotesForThis[index] = false;
    this.setData({
      notes: newNotesForThis
    });
  },

  isPersistenced: function (key) {
    return this.data.notes[key] ? true : false;
  },

  onSharebar: function (event) {
    this.setData({
      shareImg: this.data.article.coverImg,
      shareContent: this.data.article.title,
      shareArticleId: this.data.article._id
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            showShareBar: true
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

  onShare: function (event) {
    let shareText = event.detail.data;

    this.setData({
      showShareBar: true,
      shareImg: "",
      shareContent: shareText,
      shareArticleId: this.data.article._id
    });
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
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

  onShareAppMessage: function (res) {
    let that =  this;
    return {
      title: that.data.article.title,
      path: '/pages/article/detail/index?id=' + that.data.article._id,
      imageUrl: that.data.article.coverImg,
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
      fail: function (res) {
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
      complete: function () {
        that.setData({ showPosterMask: false, showShareBar: false });
      }
    }
  },

  changeShareCount: function (types) {
    app.service({
      url: '/api/project/share',
      method: 'POST',
      data: { id: this.data.article._id, type: types },
      success: res => {

      }
    })
  }


})