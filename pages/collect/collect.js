// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        title: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        title: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        title: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        title: '浏览足迹',
        isActive: false
      }
    ],
    // 商品收藏
    collectList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获取商品收藏列表
    const collectList = wx.getStorageSync("collectList") || []

    this.setData({
      collectList
    })
  },

  // 点击切换不同的页签
  handelItemTap(e){
    const {index} = e.detail
    const {tabs} = this.data
    tabs.forEach(((item,i) => i === index ? item.isActive=true : item.isActive=false))

    this.setData({
      tabs
    })
  }
})