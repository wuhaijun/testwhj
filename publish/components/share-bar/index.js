const app = getApp();
Component({
  properties: {

  },

  methods: {
    onMadePoster: function () {
      this.triggerEvent('madePoster', {  })
    }
  },
})