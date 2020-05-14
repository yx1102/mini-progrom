import {reqSwiper, reqNavData, reqHomeFloor} from '../../api/index.js'
import {getRequest} from '../../api/ajax'
//获取应用实例
//Page Object
Page({
  data: {
    swiperData: [],
    navData: [],
    floorData: [],
    queryArr:[]
  },
  //options(Object)
  onShow: function(options){
    this.getSwiperData()
    this.getNavData()
    this.getFloorData()
  },

  // 请求轮播图数据
  async getSwiperData(){
    const result = await getRequest(reqSwiper)
    this.setData({
      swiperData: result
    })
  },

  // 请求导航数据
  async getNavData(){
    const result = await getRequest(reqNavData)
    this.setData({
      navData: result
    })
  },

  // 请求楼层数据
  async getFloorData(){
    const result = await getRequest(reqHomeFloor)
    result.forEach(item => {
      let smallArr = []
      let bigArr = []
      item.product_list.forEach(v => {
        const index = v.navigator_url.indexOf('?')
        let queryStr = v.navigator_url.slice(index)
        smallArr.push(queryStr)
      })
      console.log(smallArr);
      
      this.setData({
        queryArr:smallArr
      })
      
    })
    
    this.setData({
      floorData: result
    })
    console.log(this.data.queryArr);
    
  }
});
