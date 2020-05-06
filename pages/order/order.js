import { request } from '../../api/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        title: '全部',
        isActive: true
      },
      {
        id: 1,
        title: '代付款',
        isActive: false
      },
      {
        id: 2,
        title: '代发货',
        isActive: false
      },
      {
        id: 3,
        title: '退款/退货',
        isActive: false
      }
    ],

    type: {},
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载[只执行一次]
   */
  onLoad: function (options) {
    // 保存路径参数
    const type = options
    this.setData({
      type
    })
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面加载[可执行多次]
   */
  onShow() {
    // 先判断有无token，无token跳转获取，有token就执行操作
    const token = wx.getStorageSync("token")
    const {type} = this.data

    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }
    
    this.changeTitleByIndex(type.type - 1)
    this.getOrder()
  },

  // 点击切换内容
  handelItemTap(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    let type = {type: index+1}
    this.setData({
      type
    })
    
    // 重新发送请求的数据
    this.getOrder()
  },

  // 获取订单接口的数据
  async getOrder() {
    const result = await request({ url: '/my/orders/all', data: this.data.type })
    this.setData({
      // 先将里面的数组结构出来，然后新增一个可以转换时间格式的属性
      orderList: result.orders.map(item => ({ ...item, create_time_cn: (new Date(item.create_time * 1000).toLocaleString()) }))
    })
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    const { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  }
})