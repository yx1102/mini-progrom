import {request} from '../../api/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList:[]
  },

  queryInfo:{
    goods_id:''
  },

  goodsObj:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryInfo.goods_id = options.goods_id*1
    
    this.getGoodsDetail()
  },

  async getGoodsDetail(){
    const result = await request({url: '/goods/detail', data:this.queryInfo})
    this.goodsObj = result
    
    this.setData({
      goodList:{
        goods_name:result.goods_name,
        goods_price:result.goods_price,
        pics:result.pics,
        goods_introduce:result.goods_introduce
      }
    })
  },

  // 显示轮播大图
  showPreview(e){
    const index = e.currentTarget.dataset.index
    const urls =  this.data.goodList.pics.map(item => item.pics_big_url)

    wx.previewImage({
      current: urls[index], // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  // 加入购物车
  addToCart(e){
    // 1 先绑定点击事件
    // 2 获取缓存中的购物车数据 数组格式 
    let cartList = wx.getStorageSync("cart") || []
    // 3 先判断 当前的商品是否已经存在于 购物车
    let index = cartList.findIndex(item => item.goods_id === this.goodsObj.goods_id)

    // 4 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
    if(index===-1){
      this.goodsObj.num = 1
      cartList.push(this.goodsObj)
      
    }else{// 5 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
      cartList[index].num++
    }

    // 6 重新把购物车数组 填充回缓存中
    wx.setStorageSync("cart", cartList)

    // 7 提示添加成功
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
    
  }
})