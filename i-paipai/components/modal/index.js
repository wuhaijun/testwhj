let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Component({
  behaviors: [],
  properties: {
    title: { 
      type: String, 
      value: '标题'
    },
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        newVal ? this.onShow() : this.onHide();
      }
    }
  },

  data: {
    animation: {
      duration: 200,
      timingFunction: "linear",
      delay: 0
    },
    translateY: 600,
    timeOut: 20,
  },

  ready: function () {
    this.data.show ? this.onShow() : this.onHide();
  },

  methods: {
    onShow: function () {
      let animation = wx.createAnimation(this.data.animation)
      this.animation = animation
      animation.translateY(this.data.translateY).step()
      
      this.setData({ animationData: animation.export() })
      this.triggerEvent('show');

      setTimeout(() => {
        animation.translateY(0).step()
        this.setData({ animationData: animation.export() })
      }, this.data.timeOut)
    },

    onHide: function() {
      let animation = wx.createAnimation(this.data.animation)
      this.animation = animation
      animation.translateY(this.data.translateY).step()
      this.setData({ animationData: animation.export() })

      setTimeout(() => {
        animation.translateY(0).step()
        this.setData({ animationData: animation.export() })
        this.triggerEvent('hide')
      }, this.data.timeOut)
    },

    onConfirm: function() {
      this.triggerEvent('confirm');
    },

    onCancel: function () {
      this.triggerEvent('cancel');
    }
  }
})