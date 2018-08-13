let config = require('../../config.js');
const app = getApp();

Component({
  properties: {
    id: {
      value: "",
      type: String,
    },
    url: {
      value: "",
      type: String,
    }
  },
  data: {
    messageList: [],
    imageHost: config.qiniu.imageHost
  },
  ready: function () {
    this._theme();
  },
  methods: {
    _theme: function () {
      app.service({
        url: `${this.data.url}`,
        success: res => {
          this.triggerEvent('getThemes', { data: res.data });
          this.setData({ messageList: res.data })
        }
      })
    },
    onSubscribe: function (e) {
      let index = e.currentTarget.dataset.index;
      let _id = e.currentTarget.dataset.id;
      app.service({
        url: '/api/theme/toggleCollect',
        method: 'POST',
        data: { id: _id },
        success: res => {
          let messageList = [...this.data.messageList];
          messageList[index].isCollect = !messageList[index].isCollect;
          if (messageList && this.data.url == '/api/themeCollect/list') {
            messageList.splice(index,1)
          }
          if (messageList && this.data.url == '/api/theme/list') {
            if (messageList[index].isCollect) {
              messageList[index].count++
            } else {
              messageList[index].count--
            }
          }
          this.setData({ messageList });
          this.triggerEvent('togglecollect', { data: messageList[index] });
          this.triggerEvent('themecollect', { collect: this.data.messageList })
        },
      })
    },
  }
})