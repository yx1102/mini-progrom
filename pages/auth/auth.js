import { login } from '../../utils/asyncwx'
import { request } from '../../api/request'
Page({
  async handelGetUserInfo(e) {
    try {
      const { errMsg, rawData, signature, encryptedData } = e.detail
      // 发送请求获取登录码
      const result = await login()
      const { code } = result

      const loginObj = { errMsg, rawData, signature, encryptedData, code }

      // 发送请求获取授权信息
      const res = await request({ url: '/users/wxlogin', data: loginObj, method: 'post' })
      const token_key = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'

      // 将token存储到本地存储中
      wx.setStorageSync("token", token_key)

      // 获取完成后跳回上一个页面
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      console.log('授权' + error)
    }
  }
})