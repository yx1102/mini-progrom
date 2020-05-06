// pages/login/login.js
Page({
  handelGetUserInfo(e){
    const {userInfo} = e.detail
    console.log(userInfo);
    

    // 将信息存到内容中
    wx.setStorageSync("userInfo", userInfo)

    // 跳转页面
    wx.navigateBack({
      delta: 1
    })
  }
})