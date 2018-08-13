//app.js
var util = require('./utils/util.js');
var config = require('./config.js');
App({
  onLaunch: function () {
    this.checkSession().then((sessionId, reset) => {
      if (reset) this.setSession(sessionId);
      console.info('Login success and sessionId = ' + sessionId);
    }).catch(() => {
      console.warn('Login error when call app onLaunch');
    });
  },

  checkSession: function() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => {
          let sessionId = wx.getStorageSync('sessionId');
          if (!sessionId) {
              this.loginPromise().then(result => {
              resolve(result.data.sessionId, true); 
            }).catch(() => {
              reject();
            })
          }
          else {
            resolve(sessionId, false);
          }
        },
        fail: () => {
          this.loginPromise().then(result => {
            resolve(result.data.sessionId, true);
          }).catch(() => {
            reject();
          })
        }
      })
    })
  },

  loginPromise: function() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          wx.request({
            url: config.server + '/api/user/login/' + res.code,
            success: result => {
              resolve(result)
            }
          });
        }
      })
    })
  },

  service: function (opts) {
    let url = opts.url || '';
    let callback = opts.success || function () { };
    let method = opts.method || 'GET';
    let data = opts.data || {};

    this.checkSession().then((sessionId) => {
      wx.request({
        url: config.server + url,
        header: { sessionId: sessionId },
        method: method,
        data: data,
        success: res => {
          callback(res);
        }
      })
    }).catch(() => {
      console.warn('Login error when call api: ' + url)
    })
  },

  setSession: function (data) {
    wx.setStorage({
      key: "sessionId",
      data: data
    })
  },
})