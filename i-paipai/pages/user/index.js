//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '关于随手拍',
    userInfo: {}
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  }
  
})
