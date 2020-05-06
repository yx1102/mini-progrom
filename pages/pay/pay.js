import { request } from '../../api/request'
import { requestPayment, showToast } from '../../utils/asyncwx'
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
  async orderPay() {
    // 1. 获取token
    const token = wx.getStorageSync("token")
    // 2. 判断页面是否有需要的token，如果没有就跳转获取
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
    }

    // 3. 有token，创建订单
    // 准备请求头
    // const header = {Authorization: token}
    const { cartList, address, totalPrice } = this.data
    const order_price = totalPrice
    const consignee_addr = address.provinceName + address.cityName + address.countyName + address.detailInfo

    let goods = []
    cartList.forEach(item => goods.push({
      goods_id: item.goods_id,
      goods_number: item.num,
      goods_price: item.goods_price
    }))

    // 发送的信息
    let orderObj = { order_price, consignee_addr, goods }
    console.log(orderObj);


    // 4. 获取订单编号
    const { order_number } = await request({ url: '/my/orders/create', data: orderObj, method: 'post' })

    // 5. 发起预支付接口
    const { pay } = await request({ url: '/my/orders/req_unifiedorder', data: { order_number }, method: 'post' })

    // 6. 微信支付【由于没有企业权限，这里就不写了】
    // await requestPayment(pay)


    // 7. 查看订单支付的状态
    const res = await request({ url: '/my/orders/chkOrder', data: { order_number }, method: 'post' }) 
    await showToast({ title: '支付成功' })
    
    setTimeout(() => {
      // 8. 删除购物车的已支付商品的信息
      let newCart = wx.getStorageSync("cart")
      // 过滤，只剩下还没有选中的商品
      newCart = newCart.filter(item => !item.checked)
      // 重新保存回缓存中
      wx.setStorageSync("cart", newCart)

      // 9. 跳转至订单页面
      wx.navigateTo({
        url: '/pages/order/order',
      })
    }, 2000);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从内存中读取地址的数据显示
    const address = wx.getStorageSync("address")
    // 获取购物车的数据
    let cartList = wx.getStorageSync(("cart"))
    cartList = cartList.filter(item => item.checked)

    this.setData({ address })
    this.calCart(cartList)
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