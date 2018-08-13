Component({
  properties: {
    position:{
      type:Object,
      value:{}
    },
    notes: {
      type: Object,
      value: {}
    }
  },
  data: {
    isShow:false,
    isNote:false,
    isShare:false,
    markInfo:{}
  },
  created: function(){
  },
  ready: function () {
  },
  methods: {
    //复制事件
    onCopy: function() {
      this.hidePopup();
      let text = this.data.markInfo.text;
      let that = this;
      wx.setClipboardData({
        data: text,
        success: function (res) {
          that.unMark();
          wx.showToast({
            title:'复制成功',
            duration:1000
          });
        }
      })
    },
    //标注事件 
    showNoteModal: function() {
      if (this.data.notes[this.data.markInfo.index]) {
        this.onNoteSave();
        return;
      }
      this.hidePopup();
      this.setData({
        isNote:true
      });
    },
    //分享事件
    onShare: function() {
      this.hidePopup();
      let text = this.data.markInfo.text;
      this.triggerEvent('onShare', { data: text });
      this.unMark();

     // this.setData({isShare:true});
    },
    //模态框背景滚动事件，目的为了防止父组件滚动
    preventTouchMove: function () {
    },
    //隐藏自身popup
    hidePopup:function() {
      this.setData({ isShow: false });
    },
    //隐藏笔记弹框
    hideNoteModal: function () {
      this.setData({
        isNote: false
      });
    },
    //笔记取消事件
    onNoteCancel: function () {
      this.hidePopup();
      this.unMark();
      this.hideNoteModal();
    },
    //笔记保存事件
    onNoteSave: function () {
      this.hidePopup();
      let markInfo = this.data.markInfo;
      let index = markInfo.index;
      let text = markInfo.text;
      let note = this.data.note;
      let pid = markInfo.pid;
      let that = this;
      this.hideNoteModal();
      this.service({
        url: '/api/project/note',
        method: 'POST',
        data: {
          id: pid,
          domIndex: index,
          text: text,
          note: note
        },
        success: res => {
          let operator = res.data.operator;
          if (operator === "add") {
            this.triggerEvent('callbackSaveNote',{index:index});
          } else if (operator === "cancel") {
            this.triggerEvent('callbackCancelNote',{index:index});
          }
        }
      })
    },
    //取消mark效果
    unMark: function() {
      let index = this.data.markInfo.index;
      this.triggerEvent('unMark', { index: index });
    },
    onInput:function(event) {
      let note = event.detail.value;
      this.setData({note:note});
    },
    service: function (opts) {
      let url = opts.url || '';
      let callback = opts.success || function () { };
      let method = opts.method || 'GET';
      let data = opts.data || {};
      let sessionId = wx.getStorageSync('sessionId');
      wx.request({
        url: "https://ireader.brainboom.cn" + url,
        header: { sessionId: sessionId },
        method: method,
        data: data,
        success: res => {
          callback(res);
        }
      })
    }
  }
})