Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    item: {
      type: Object,
      value: {},
    },
    notes: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onMark: function (event) {
      var myEventOption = { bubbles: true, composed:true} // 触发事件的选项
      this.triggerEvent('onMark', event, myEventOption);
    },
    onCopy: function(event) {
    }
  }
})