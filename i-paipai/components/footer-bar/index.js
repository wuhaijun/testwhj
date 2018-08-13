let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Component({
  behaviors: [],
  properties: {
  },
  data: {
    checked: 'index'
  },
  ready: function () {
  },
  methods: {
    showPhoto: function () {
      wx.showActionSheet({
        itemList: ['拍照', '从手机相册选择'],
        success: (res) => {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              this.chooseWxImage('camera');
            } else if (res.tapIndex == 1) {
              this.chooseWxImage('album');
            }
          }
        },
        fail: function (res) {
        }
      })
    },
    chooseWxImage: function (type) {
      wx.chooseImage({
        sizeType: ['compressed'],
        sourceType: [type],
        success: (res) => {
          wx.setStorage({
            key: "uploadImageList",
            data: res.tempFilePaths
          })
          wx.navigateTo({
            url: "../upload/index"
          })
        }
      })
    },
    
    toMine: function () {
      let currentPageUrl = util.getCurrentPageUrl();
      if (currentPageUrl != "pages/user/index")
        wx.reLaunch({
          url: '/pages/user/index',
        })
      this.setData({ checked: 'user' })
    },
   
    toHome: function () {
      let currentPageUrl = util.getCurrentPageUrl();
      if (currentPageUrl != "pages/index/index")
        wx.reLaunch({
          url: '/pages/index/index',
        })
      this.setData({ checked: 'index' })
    },
  }
})