let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Component({
  behaviors: [],
  properties: {
    pageNum: {
      type: Number,
      value: 1
    },
    pageSize: {
      type: Number,
      value: 999999
    },
    tag: {
      type: String,
      value: ""
    },
    location: {
      type: String,
      value: ""
    },
    keyword: {
      type: String,
      value: ""
    }
  },

  data: {
    scrollHeight: 0,
    total: 0,
    loading: true,
    hasMore: false,
    photoList: [],
    photoUrlList: []
  },

  created: function () {
    // wx.showLoading({
    //   title: '加载中...',
    // })
  },

  attached: function () {
    console.log('photo-list attached');
    wx.getSystemInfo({
      success: res => {
        var hight = res.screenHeight * 2;
        this.setData({ scrollHeight: hight });
      }
    })
    this.flush();
  },

  methods: {
    onImgPreview: function (event) {
      var src = event.currentTarget.dataset.src;
      var photoUrlList = this.data.photoUrlList;
      wx.previewImage({
        current: src,
        urls: photoUrlList
      })
    },

    onLoadMore: function () {
      this.__nextPage__();
    },

    flush: function () {
      app.service({
        url: '/api/photo/count',
        data: {
          tag: this.data.tag,
          location: this.data.location,
          keyword: this.data.keyword
        },
        success: res => {
          this.setData({ total: res.data.count || 0 });
          this.__refresh__();
        }
      });
    },

    __loadData__: function () {
      wx.showLoading({
        title: '加载中...',
      })
      app.service({
        url: '/api/photo/list',
        data: {
          pageSize: this.data.pageSize,
          pageNum: this.data.pageNum,
          tag: this.data.tag,
          location: this.data.location,
          keyword: this.data.keyword
        },
        success: (res) => {
          wx.hideLoading();
          this.setData({ loading: false })
          let results = res.data.photos;
          this.setData({ total: results.length || 0 });
          if (!results || results.length == 0) return;
          let photos = results.map(it => {
            it && (it.uploadedFormatDate = util.formatDate(new Date(it.uploadedDate)));
            return it
          });
          this.setData({
            photoList: this.data.photoList.concat(util.groupBy(photos, 'uploadedFormatDate')).sort((it1, it2) => it1.uploadedFormatDate - it2.uploadedFormatDate),
            photoUrlList: this.data.photoUrlList.concat(photos.map(it => it.url)),
            pageNum: this.data.pageNum + 1
          });
          
        }
      });
    },

    __refresh__: function () {
      this.setData({
        photoList: [],
        photoUrlList: [],
        pageNum: 1
      });
      this.__loadData__();
    },

    __nextPage__: function () {
      let hasMore = this.data.total > (this.data.pageNum - 1) * this.data.pageSize;
      this.setData({ hasMore: hasMore });
      if (!hasMore) return;

      this.__loadData__();
    },
  }
})