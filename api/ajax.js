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