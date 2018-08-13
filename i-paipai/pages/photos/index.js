Page({
  data: { tag: '', location: '', keyword: '' },

  onLoad: function (options) {
    this.setData({
      tag: options.tag || '', location: options.location || '', keyword: options.keyword || ''})
  },
  closeInput: function () {
    wx.navigateBack()
  },
  reloadInput: function () {
    wx.navigateBack()
  }
})