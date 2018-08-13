Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    wxParseData: {
      type: Array,
      value: [],
    },
    notes:{
      type : Object,
      value: {}
    }
  },
  data: {
    currentNote: {}
  },
  created: function () {
  },
  ready: function () {
  },
  methods: {
    wxParseImgLoad: function (event) {
      this.triggerEvent('wxParseImgLoad', event);
    },
    wxParseImgTap: function (event) {
      this.triggerEvent('wxParseImgTap', event)
    }
  }
})