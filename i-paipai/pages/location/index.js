var QQMapWX = require('../../public/js/qqmap-wx-jssdk.min.js');
let config = require('../../config.js');

Page({
  data: {
    arroundList: [],
    total: 0,
    page_size: 20,
    page_index: 1,
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.getSystemInfo({
      success: res => {
        var hight = (res.windowHeight - 48) * (750 / res.windowWidth);
        this.setData({ scrollHeight: hight });
      }
    })

    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.getLoaction(res.latitude, res.longitude);
      },
      fail: () => {
        wx.hideLoading();
      }
    })
  },
  onShow: function () {
    wx.getStorage({
      key: 'checkedLocation',
      success: res => { this.setData({ location: res.data }); }
    });
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
      arroundList: []
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
    });
    wx.getStorage({
      key: 'pois',
      success: res => {
        this.setData({ arroundList: res.data });
      },
      fail: () => {
      }
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      page_size: 20,
      page_index: 1,
      arroundList: []
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      total: 0,
      page_index: 0,
      arroundList:[]
    });
    
    this.loadData();
  },

  chooseLocation: function (event) {
    wx.setStorage({
      key: "checkedLocation",
      data: event.currentTarget.dataset.checkedlocation
    })
    wx.navigateBack({
      delta: 1
    })
  },

  onLoadMore: function () {
    this.nextPage();
  },

  loadData: function () {
    var qqMapService = new QQMapWX({ key: config.qqMapServiceKey });
    qqMapService.search({
      keyword: this.data.inputVal,
      page_size: this.data.page_size,
      page_index: this.data.page_index,
      success: (res) => {
        this.setData({
          arroundList: this.data.arroundList.concat(res.data || []),
          total: res.count || 0,
          page_index: this.data.page_index + 1,
        });
      }
    });
  },

  nextPage: function () {
    let hasMore = this.data.total > (this.data.page_index - 1) * this.data.page_size;
    if (!hasMore) return;
    this.loadData();
  },

  getLoaction: function (latitude, longitude) {

    var qqMapService = new QQMapWX({ key: config.qqMapServiceKey });
    qqMapService.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 5,   //5 [默认]腾讯、google、高德坐标
      get_poi: 1,      //是否返回周边POI列表：
      success: (res) => {
        if (res.status == 0) {
          wx.hideLoading();
          var poisList = res.result.pois;
          var noLocation = { title: "所在位置" };
          var province = {
            title: res.result.ad_info.province,
            ad_info: res.result.ad_info
          };
          poisList.unshift(noLocation, province);
          this.setData({ arroundList: poisList });

          wx.getStorage({
            key: 'checkedLocation',
            success: res => {
              if (res.data.title != "所在位置") {
                wx.setStorage({
                  key: "checkedLocation",
                  data: res.data
                })
              }
            }
          });
        }
      }
    });
  }


})