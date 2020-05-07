import {request} from '../../api/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:'',
    searchList:[]
  },
  timer: -1,

  async getSearchList(){
    const {query} = this.data
    const result = await request({url:'/goods/qsearch', data:{query}})
    this.setData({
      searchList: result
    })
  },

  // 获取输入框内的值
  inputTyping(e){
    const query = e.detail.value
    if(!query.trim()){
      this.setData({
        query: '',
        searchList: []
      })
      return
    }
    this.setData({
      query
    })

    
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.getSearchList()
    }, 1000)
  },

  // 重置页面
  removeSearchList(){
    this.setData({
      query: '',
      searchList: []
    })
  }

})