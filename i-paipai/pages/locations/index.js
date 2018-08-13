let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    locations:[]
  },

  onLoad: function (options) {
    app.service({
      url: '/api/photo/locations',
      success: res => {
        this.setData({ locations: res.data.locations })
      }
    })
  },
})