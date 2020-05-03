// export const ajax = function (params) {
//   return new Promise((resolve,reject)=>{
//     const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
//     wx.request({
//       // 将属性从params中结构出来
//       ...params,
//       // 共同的基础路径，后续不需写请求的服务器地址
//       url: baseUrl + params.url,
//       // 错误的回调
//       fail: (err) => {
//         reject(err)
//       },
//       // 成功的回调
//       success: (res) => {
//         // 直接获取到请求后的data数据
//         resolve(res.data)
//       },
//     })
//   })
// }

const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
export function getRequest(api, params, loading = true) {
  return new Promise((resolve, reject) => {
    // 请求开始，显示loading
    if (loading) {
      wx.showLoading({
        title: '加载中'
      })
    }
    // 请求
    wx.request({
      url: baseUrl + api,
      data: params,
      method: 'get',
      dataType: 'json',
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data.message) // 接收res并传到then的参数中去
          wx.hideLoading() // 结束加载
        } else {
          wx.hideLoading()
          reject()
        }
      },
      error: function(err) {
        reject(err)
      }
    })
  })
}

export function postRequest(api, data, loading = true) {
  return new Promise((resolve, reject) => {
    // 请求开始，显示loading
    if (loading) {
      wx.showLoading({
        title: '加载中'
      })
    }
    // 请求
    wx.request({
      url: baseUrl + api,
      data: data,
      method: 'post',
      dataType: 'json',
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data.message) // 接收res并传到then的参数中去
          wx.hideLoading() // 结束加载
        } else {
          wx.hideLoading()
          reject()
        }
      },
      error: function(err) {
        reject(err)
      }
    })
  })
}