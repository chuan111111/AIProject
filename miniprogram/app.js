const CLOUD_ENV_ID = 'cloudbase-d7gic39vb7a5a4ced'

App({
  onLaunch: function () {
    if (!wx.cloud) {
      this.globalData.cloudReady = false
      return
    }
    try {
      wx.cloud.init({
        env: CLOUD_ENV_ID,
        traceUser: true
      })
      this.globalData.cloudReady = true
    } catch (error) {
      this.globalData.cloudReady = false
    }
  },

  globalData: {
    productName: 'PIXEL SOUL · 像素小屋',
    cloudReady: false,
    cloudEnvId: CLOUD_ENV_ID
  }
})
