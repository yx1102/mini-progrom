Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // 获取用户信息
    const userInfo = wx.getStorageSync("userInfo")
    const collect = wx.getStorageSync("collectList") || []
    console.log(collect,userInfo);
    
    const collectNum = collect.length

    this.setData({
      userInfo,
      collectNum
    })
  }
})