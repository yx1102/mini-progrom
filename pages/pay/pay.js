import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncwx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址
    address: {},
    // 购物车列表
    cartList: [],
    // 总价钱
    totalPrice: 0,
    // 总数量
    totalNum: 0,
    token: ''
  },

  // 判断是否跳转至支付页面
  orderPay(){
    // 如果页面没有token，那么跳转至授权页面获取token
    const token = wx.getStorageSync("token")

    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从内存中读取地址的数据显示
    const address = wx.getStorageSync("address")
    // 获取购物车的数据
    const cartList = wx.getStorageSync(("cart"))
    let checkCart = cartList.filter(item => item.checked)

    this.setData({ address })
    this.calCart(checkCart)
  },

  // 计算购物车全选，点击数量，选择单个商品计算的总数量总价【封装的函数】
  calCart(cartList) {
    
    // 商品的数量和价格
    let totalNum = 0, totalPrice = 0
    cartList.forEach(item => {
      if (item.checked) {
        totalPrice += item.goods_price * item.num
        totalNum += item.num
      }
      return totalPrice, totalNum
    })

    this.setData({
      cartList,
      totalPrice,
      totalNum
    })

  }
})