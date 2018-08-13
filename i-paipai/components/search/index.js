let config = require('../../config.js');
let util = require('../../utils/util.js');
const app = getApp();

Component({
  behaviors: [],
  properties: {
    items: { 
      type: Array, 
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({ showItems: this.data.expand ? newVal : newVal.slice(0, this.data.showTagCount) })
      }
    },
    label: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ""
    }
  },

  data: { 
    expand: false,
    showTagCount: 24,
    showItems: []
   }, 

  ready: function () {
     this.__setShowItems__();
  },

  methods: {
    onChange: function () {
      this.setData({ expand: !this.data.expand });
      this.__setShowItems__();
    },

    __setShowItems__: function() {
      this.setData({ showItems: this.data.expand ? this.data.items : this.data.items.slice(0, this.data.showTagCount) })
    }
  }
})