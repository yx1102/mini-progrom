import {request} from '../../api/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        title: '综合',
        isActive: true
      },
      {
        id:1,
        title: '销量',
        isActive: false
      },
      {
        id:2,
        title: '价格',
        isActive: false
      }
    ],
    // 商品列表的数据
    goosList:[],
  },

  // 查询的相关信息
  queryInfo:{
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPage: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryInfo.cid = options.cid
    
    this.getSearchGoodsList()
  },

  // 点击tab标签页
  handelItemTap(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail
    
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 获取商品详情数据
  async getSearchGoodsList(){
    const result = await request({url: '/goods/search', data:this.queryInfo})
    
    // 总页数
    this.totalPage = Math.ceil(result.total / this.queryInfo.pagesize)
    
    this.setData({
      // 拼接数据
      goosList: [...this.data.goosList, ...result.goods]
    })
    wx.stopPullDownRefresh()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重置数据
    this.setData({
      goosList: []
    })
    // 页码值重置为1
    this.queryInfo.pagenum = 1
    // 重新发送请求
    this.getSearchGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.queryInfo.pagenum < this.totalPage){
      // 加载下一页的数据
      this.queryInfo.pagenum ++
      // 发送请求获取数据
      this.getSearchGoodsList()
      
    }else{
      // 没有更多数据可加载
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
})