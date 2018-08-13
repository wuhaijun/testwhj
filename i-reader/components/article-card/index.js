let config = require('../../config.js');
const util = require('../../utils/util.js');

const app = getApp();

Component({
  properties: {
    article: {
      type: Object,
      value: {  },
    },

    themeList: {
      type: Object,
      value: {}
    },
    page: {
      type: Number,
      value: 0
    },
    isClick: {
      type: Boolean,
      value: "",
    }
  },

  methods: {
    onArticleTap: function (event) {
      this.triggerEvent("setPageClicked", parseInt(this.data.page));
      var articleId = event.currentTarget.dataset.articleId;
      wx.navigateTo({
        url: '/pages/article/detail/index?id=' + articleId
      })
    },

    onShareBox: function (event){
      var myEventOption = { bubbles: true, composed: true } // 触发事件的选项
      this.triggerEvent('onShareBox', event, myEventOption);
    },

    onToggleCollect: function (e) {
      app.service({
        url: '/api/project/toggleCollect',
        method:'POST',
        data: { id: this.data.article._id },
        success: res => {
          let article = this.data.article;
          if (article.isCollected) {
            article.collectCount--
          } else {
            article.collectCount++
          }
          article.isCollected = !article.isCollected
          this.setData({ article })
        }
      })
    },
    
    navigateTotheme () {
      let theme = this.data.themeList[this.data.article.themeId];
      wx.navigateTo({
        url: "/pages/theme/detail/index?title=" + theme.name  + "&desc="+ theme.desc +"&isCollect=" + theme.isCollect +"&_id=" + theme._id +"&count=" + theme.count
      })
    },

    addShareCount: function() {
      let article = this.data.article;
      article.shareCount = article.shareCount + 1;
      this.setData({ article })
    }
  }
})