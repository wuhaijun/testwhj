let config = require('../../../config.js');
const app = getApp();

Page({
  data: {
    collecteds: [],
    imageHost: config.qiniu.imageHost,
    isCollect: {},
    isShow: false,
  },
  onToggleCollect: function (e) {
    let collecteds = this.data.collecteds;
    let collected = e.detail.data;

    let index = this.data.collecteds.findIndex(it => it._id == collected._id);
    if (index == -1) {
      this.setData({ collecteds: [collected, ...this.data.collecteds] })
    } else {
      let temp = [...this.data.collecteds];
      temp.splice(index, 1);
      if (temp.length == 0) {
        this.setData({
          isShow: false,
        })
      }
      this.setData({ collecteds: temp })
    }
  },

  onGetThemes: function (e) {
    let collecteds = (e.detail.data || []).filter(it => it.isCollect);
    this.setData({ collecteds: collecteds });
    let isShow = (this.data.collecteds.length != 0);
    this.setData({ isShow: isShow });
  },

  onShow: function (options) {
    this.selectComponent('#theme-cards')._theme();
  },

  onPullDownRefresh: function () {
    if (this.data.collecteds.length != 0 ) {
      this.setData({
        isShow: true,
      })
    }else {
      this.setData({
        isShow: false,
      })
    }
  },
})