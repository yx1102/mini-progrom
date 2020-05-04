// 同时请求多个接口的次数
let ajaxTimes = 0
export const requset = function (params) {
  return new Promise((resolve,reject)=>{
    // 显示loading
    wx.showLoading({
      title: "加载中",
      mask: true
    })
 
    ajaxTimes ++

    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
    wx.request({
      // 将属性从params中结构出来
      ...params,
      // 共同的基础路径，后续不需写请求的服务器地址
      url: baseUrl + params.url,
      // 错误的回调
      fail: (err) => {
        reject(err)
      },
      // 成功的回调
      success: (res) => {
        // 直接获取到请求后的data数据
        if (res.statusCode === 200) {
          resolve(res.data.message) // 接收res并传到then的参数中去
          wx.hideLoading() // 结束加载
        } else {
          wx.hideLoading()
          reject()
        }
      },

      // 无论成功还是失败的回调都关闭loading
      complete:()=>{
        ajaxTimes --
        if(ajaxTimes===0){
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    })
  })
}