const app = getApp();

Page({
  data: {
    tags: [],
    locations: [],
    inputValue: '',  
    suggests: []  
  },

  onLoad: function(option) {
    app.service({
      url: '/api/photo/tags',
      success: res => { this.setData({ tags: (res.data.tags || [])}) }
    })

    app.service({
      url: '/api/photo/locations',
      success: res => { this.setData({ locations: (res.data.locations || []).map(it => it.name).filter(it => it) }) }
    })

    this.setData({ inputValue: option.tag || option.location || option.keyword || ''})
  },
 
  inputTyping: function(e) {
    let inputValue = e.detail.value;
    this.setData({ inputValue: inputValue })

    let matchTags = this.data.tags.filter(tag => tag.indexOf(inputValue) != -1)
    let matchLocations = this.data.locations.filter(tag => tag.indexOf(inputValue) != -1)

    this.setData({ suggests: matchTags.concat(matchLocations) })
  },

  confirmTyping: function(e) {
    let site = e.detail.value;
    wx.navigateTo({
      url: '/pages/photos/index?keyword='+site
    })
  }
})