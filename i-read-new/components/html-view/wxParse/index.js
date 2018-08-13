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
  data: {
    currentNote: {}
  },
  methods: {
  }
})