// pages/subscribe/search/index.js
const util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    searchList: [],
    contentList: [],
    themeList: {},
    keyword: "",
    page: 1,
    loadCompleted: false,
    loading: false,
    search: false,
    transition: false
  },

  onLoad: function (options) {
    this.setData({
      search: true,
    })
    wx.getStorage({
      key: 'history',
      success: res => {
        this.setData({ searchList: res.data || []})
      }
    })
  },

  confirm: function(e) {
    let keyword = e.detail.value || e.target.dataset.keyword || "";
    if (!keyword || !keyword.trim()) return;

    let searchList = [...this.data.searchList];
    let index = searchList.findIndex(it => it == keyword);
    if (index != -1) searchList.splice(index, 1);
    searchList.unshift(keyword);

    this.setData({ searchList: searchList.slice(0, 10), search: false, })
    wx.setStorage({
      key: 'history',
      data: searchList,
    })

    this.setData({ keyword: keyword, page: 1, loadCompleted: false, contentList: [],themeList: {} }, () => {
        this.__loadMore();
    })
  },

  __loadMore() {
    let page = this.data.page;
    let keyword = this.data.keyword;

    this.setData({ loading: true });
    app.service({
      url: `/api/project/list?keyword=${ keyword }&page=${ page }`,
      success: res => {
        res.data.projectList.forEach(item => {
          let newTime = util.formatDate(new Date(item.datePublished));
          item.datePublished = newTime;
          item.title = util.replaceHtmlChar(item.title);
        })
        this.setData({ 
          contentList: (this.data.contentList || []).concat(res.data.projectList || []),
          themeList: {...this.data.themeList || {}, ...res.data.themeList || {}},
           })   

        if (!res.data.projectList || res.data.projectList.length == 0) {
          this.setData({ loadCompleted: true, transition: true });
        }     
        this.setData({ loading: false })
      }
    })
  },

  clear: function (e) {
    wx.removeStorageSync('history')
    this.setData({ searchList: []})
  },

  onReachBottom: function () {
    if (!this.data.loadCompleted) {
      this.setData({ page: this.data.page + 1 }, () => {
        this.__loadMore();
      });
    }
  }
})