import {request} from '../../api/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList:[],
    // 当前商品是否被选中
    isCollect:true
  },

  queryInfo:{
    goods_id:''
  },

  goodsObj:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryInfo.goods_id = options.goods_id
  },

  onShow(){
    this.getGoodsDetail()
  },

  async getGoodsDetail(){
    const result = await request({url: '/goods/detail', data:this.queryInfo})
    this.goodsObj = result
    

    // 加载缓存中的商品收藏的数据
    const collectList = wx.getStorageSync("collectList") || []

    // 判断缓存中是否有该商品
    let isCollect = collectList.some(item => item.goods_id === this.goodsObj.goods_id)
    
    this.setData({
      goodList:{
        goods_name:result.goods_name,
        goods_price:result.goods_price,
        pics:result.pics,
        goods_introduce:result.goods_introduce
      },
      isCollect
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
      this.goodsObj.checked = true
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
    
  },

  // 商品收藏
  handelCollect(){
    let isCollect = false;

    // 1 判断该商品是否存在于缓存数组中
    const collect = wx.getStorageSync("collectList") || [];
    
    const index = collect.findIndex(item => item.goods_id === this.goodsObj.goods_id)
    
    // 2 已经存在 把该商品删除
    if(index !== -1){
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '商品取消收藏',
        icon: 'sucess',
        mask: true
      })
    }else{
      // 3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
      collect.push(this.goodsObj)
      isCollect = true
      wx.showToast({
        title: '商品收藏成功',
        icon: 'sucess',
        mask: true
      })
    }

    // 4. 将值存入缓存中
    wx.setStorageSync("collectList", collect)

    // 5. 修改data的属性
    this.setData({
      isCollect
    })
  }
})