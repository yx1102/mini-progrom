import {getRequest} from '../../api/ajax'
import {reqCateData} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenu: [],
    rightMenu: [],
    // 左侧菜单栏样式
    currentIndex: 0,
    // 右侧内容距离顶部的距离
    scrollTop: 0
  },
  cateList: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const getStorageData = wx.getStorageSync("cates")
    if(!getStorageData){
      // 如果没有缓存数据那就重新发送请求
      this.getCateData()
    }else{
      if(Date.now() - getStorageData.time > 1000 * 60 * 5){
        // 超时发送请求
        wx.removeStorageSync('cates')
        this.getCateData()
      }else{
        // 从内存中读取数据
        this.cateList = getStorageData.data,
        // 获取数据后保存然后渲染到页面中
        this.setData({
          leftMenu: this.cateList.map(item => item.cat_name),
          rightMenu: this.cateList[0].children
        })
      }
    }
  },

  async getCateData(){
    const result = await getRequest(reqCateData)
    this.cateList = result
    // 将数据存储到内存中
    wx.setStorageSync('cates', {time:Date.now(), data:result})
    
    this.setData({
      leftMenu: this.cateList.map(item => item.cat_name),
      rightMenu: this.cateList[0].children,
    })
  },

  handelItemTap(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      // 1. 更新当前选中项 currentIndex
      currentIndex: index,
      // 2. 右侧的数据也要发生改变
      rightMenu: this.cateList[index].children,
      scrollTop: 0
    })
  }
})