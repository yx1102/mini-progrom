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
    // 全选按钮
    allChecked: false,
    // 总价钱
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },

  // 获取用户的收货地址
  async getUserAddress() {
    /*   1 绑定点击事件
    2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

    3 获取 用户 对小程序 所授予 获取地址的 (wx.getSetting) 权限 状态 scope
      1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
        scope 值 true 直接调用 获取收货地址
      2 假设 用户 从来没有调用过 收货地址的api 
        scope undefined 直接调用 获取收货地址
      3 假设 用户 点击获取收货地址的提示框 取消   
        scope 值 false 
        1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 wx.chooseAddress
        2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 */
    /* wx.getSetting({
      success: (result) => {
        const scopeAddress = result.authSetting["scope.address"]
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: (result) => {
              // 保存到缓存中
              wx.setStorageSync("address", result);
            }
          });
        } else {
          wx.openSetting({
            success: (result) => {
              wx.chooseAddress({
                success: (res) => {
                  // 保存到缓存中
                  wx.setStorageSync("address", res);
                }
              });
            }
          });
        }
      }
    }) */

    try {
      // 获取权限
      const result = await getSetting()
      const scopeAddress = result.authSetting["scope.address"]
      // 判断权限
      if (scopeAddress === false) {
        await openSetting()
      }
      const res = await chooseAddress()
      wx.setStorageSync("address", res)
    } catch (err) {
      console.log('收货地址' + err)
    }

  },

  // 是否选中商品计算
  handelChange(e) {
    this.data.cartList.forEach(item => {
      /* if(item.goods_id === e.target.dataset.id){
        item.checked = !item.checked
      } */
      console.log(item.goods_id);

    })
    // 1 获取被修改的商品的id
    const goods_id = e.target.dataset.id
    // 2 获取购物车数组 
    const { cartList } = this.data
    // 3 找到被修改的商品对象
    const index = cartList.findIndex(item => item.goods_id === goods_id)

    // 4 选中状态取反
    cartList[index].checked = !cartList[index].checked

    this.calCart(cartList)

  },

  // 全选和全不选
  allSelect() {
    // 获取data的值取反
    let { allChecked, cartList } = this.data
    allChecked = !allChecked

    // 遍历给每个元素都设置为跟 allChecked 一样的值
    cartList.forEach(item => item.checked = allChecked)

    this.calCart(cartList)
  },

  // 点击商品加减按钮实现数量的修改
  async updataCartCount(e) {
    const { id, options } = e.target.dataset
    const { cartList } = this.data
    const index = cartList.findIndex(item => item.goods_id === id)
    if(options === -1){
      if(cartList[index].num > 1){
        cartList[index].num --
      }else{
        const res = await showModal({ content: "您是否要删除？" });
        if (res.confirm) {
          cartList.splice(index, 1);
        }
      }
    }else{
      cartList[index].num ++
    }
    this.calCart(cartList)

  },

  // 判断是否跳转至支付页面
  async goToPay(){
    const {address, totalNum} = this.data
    if(!address){
      await showToast({title: '请选择地址'})
      return
    }else if(totalNum <= 0){
      await showToast({title: '请选择需要支付的商品'})
      return
    }

    // 跳转至其他页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从内存中读取地址的数据显示
    const address = wx.getStorageSync("address")
    // 获取购物车的数据
    const cartList = wx.getStorageSync(("cart")) || []

    this.setData({ address })
    this.calCart(cartList)
  },

  // 计算购物车全选，点击数量，选择单个商品计算的总数量总价【封装的函数】
  calCart(cartList) {
    // 判断商品是否需要被选中
    const allChecked = cartList.length ? cartList.every(item => item.checked) : false

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
      allChecked,
      totalPrice,
      totalNum
    })


    wx.setStorageSync("cart", cartList)
  }
})