let config = require('../../config.js');
const util = require('../../utils/util.js');

const app = getApp();

Component({
  properties: {
    themeId: {
      type: String,
      value: "",
    },
    isClick: {
      type: Boolean,
      value: "",
    }
  },

  data: {
    inputValue: '',
    page: 1,
    loading: true,
    articleList: [],
    themeList: {},
    pageClicked: 0,
    isClick: '',
  },

  ready: function () {
    this.load(1,false,"self");
  },

  methods: {
    clear: function() {
      this.setData({
        inputValue: '',
        page: 1,
        loading: true,
        articleList: [],
        themeList: {},
      })
    },

    load: function(page=this.data.page,update=false,origin="other") {
      app.service({
        url: '/api/project/list?themeId=' + this.data.themeId,
        data: { page: page },
        success: res => {
          let projectList = res.data.projectList;          
          let oldProjectList = this.data.articleList;
          if(update) {
            projectList.forEach((item,idx)=>{
              let nweTime = util.formatDate(new Date(item.datePublished));
              item.datePublished = nweTime;
              item.title = util.replaceHtmlChar(item.title);
              oldProjectList.splice((page * 24 - 24 + idx), 1, item);              
            });
            this.setData({ articleList: oldProjectList, loading: false,themeList: res.data.themeList});
          } else {
            projectList.forEach(item => {
              let nweTime = util.formatDate(new Date(item.datePublished));
              item.datePublished = nweTime;
              item.title = util.replaceHtmlChar(item.title);
            });
            if(origin === "self") oldProjectList = [];
            this.setData({ articleList: oldProjectList.concat(projectList || []), loading: false, themeList: res.data.themeList, isClick: this.data.isClick });
          }
          this.triggerEvent('loaded', { data: projectList, themeId: this.data.themeId, page: this.data.page });
        }
      })
    },
    
    loadMore: function() {
      this.setData({ page: this.data.page + 1, loading: true }, function() {
        this.load();
      })
    },

    setPageClicked: function (dataFromChild) {
      this.setData({ pageClicked: dataFromChild.detail});
    },

    addShareCount: function(articleId) {
      let articleCardComponent = this.selectComponent('#_' + articleId)
      if (articleCardComponent) {
        articleCardComponent.addShareCount();
      } else {
        console.warn('Can not find the article-card component by ', articleId);
      }
    },
  }
})