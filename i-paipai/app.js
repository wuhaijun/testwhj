//app.js
var util = require('./utils/util.js');
var config = require('./config.js');
App({
  onLaunch: function () {
    wx.checkSession({
      success: () => {
        let sessionId = wx.getStorageSync('sessionId');
        this.globalData.sessionId = sessionId;

        if (!sessionId) this.login();

        let userInfo = wx.getStorageSync('userInfo');
        this.globalData.userInfo = userInfo;
      }
    })
  },

  login: function () {
    wx.login({
      success: res => {
        wx.getUserInfo({
          withCredentials: true,
          success: data => {
            wx.request({
              url: config.server + '/api/user/login/' + res.code,
              success: res => {
                this.setSession(res.data.sessionId);
                this.setUserInfo(data.userInfo);
                this.service({
                  url: '/api/user/setUserInfo',
                  data: data.userInfo,
                  method: 'POST',
                  success: res => {
                    wx.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                });
              }
            });
          }
        })
      }
    })
  },
  authorizeLoginFail: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
        } else {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用小程序，请点击授权按钮，勾选用户信息。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    this.login();
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  service: function (opts) {
    let url = opts.url || '';
    let success = opts.success || function () { };
    let fail = opts.fail || function () { };
    let method = opts.method || 'GET';
    let data = opts.data || {};
    wx.request({
      url: config.server + url,
      header: { sessionId: this.globalData.sessionId },
      method: method,
      data: data,
      success: res => {
        if (res.data.errcode == 10000) {
          this.login();
        } else {
          success(res);
        }
      },
      fail: () => {
        fail();
      }
    })
  },
  setUserInfo: function (data) {
    this.globalData.userInfo = data;
    wx.setStorage({
      key: "userInfo",
      data: data
    })
  },
  setSession: function (data) {
    this.globalData.sessionId = data;
    wx.setStorage({
      key: "sessionId",
      data: data
    })
  },
  globalData: {
    userInfo: null,
    sessionId: null
  }


})