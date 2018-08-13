// pages/subscribe/index/index.js
const util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    text: "",
    textCountLength: 0,
    save: true,
    disabled: false,
    limitLength:140
  },
  onLoad: function(options) {
    if (options.text) {
      this.data.text = options.text;
      this.data.textCountLength = this.data.text.length;
      this.setData({
        textCountLength: this.data.textCountLength,
        text: this.data.text
      });
    }
    let textLimit = options.textLimit;
    this.setData({ limitLength: textLimit });
  },
  onUnload: function() {
    if (this.data.save) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
       prevPage.setData({
         shareContent: this.data.text.replace(/ /g, "&nbsp;") 
      })
    }

  },
  onChangeText: function(event) {
    this.data.textCountLength = event.detail.value.length;
    if (this.data.textCountLength == 0){
      this.setData({ disabled: true });
    }else{
      this.setData({ disabled: false });
    }
    this.data.text = event.detail.value;
    this.setData({
      textCountLength: this.data.textCountLength,
      text: this.data.text
    });
  },
  onCancel: function() {
    this.setData({
      save: false
    });
    wx.navigateBack();
 
  },
  onSave: function() {
    wx.navigateBack();
  }

})