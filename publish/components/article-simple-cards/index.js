const app = getApp();
Component({
  properties: {
    relatedArticleList: {
      type: Array,
      value: [],
    }, 
    themeList: {
      type: Object,
      value: {},
    }, 
  },

  data: {
    articleId: '',
    page: 1,
  },
  
  methods: {
    onArticleTap: function (event) {
      let articleId = event.currentTarget.dataset.articleId;
      wx.navigateTo({ url: "/pages/projects/detail/index?id=" + articleId })
    },

    longpress(e) {
      if (wx.openBluetoothAdapter) {
        wx.openBluetoothAdapter()
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
      this.triggerEvent('__longpress', { showmodal: true, articleId: e.currentTarget.dataset.articleId });
    },
    scrolltolower: function () {
      this.triggerEvent('__scrolltolower', {  });
    },

    navigateTotheme: function(event) {
      let themeList = event.currentTarget.dataset.themeList;
      let themeId = event.currentTarget.dataset.theme;
      let theme = themeList[themeId];
      wx.navigateTo({
        url: "/pages/themes/deatils?title=" + theme.name + "&desc=" + theme.desc + "&isCollect=" + theme.isCollect + "&_id=" + theme._id + "&count=" + theme.count
      })
    },
  }
})