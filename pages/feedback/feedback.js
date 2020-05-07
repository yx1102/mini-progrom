import { showToast } from '../../utils/asyncwx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        title: '体验问题',
        isActive: true
      },
      {
        id: 1,
        title: '商品、商家投诉',
        isActive: false
      }
    ],
    // 图片显示的路径
    tempFilePaths: [],
    // 输入框的值
    textValue: ""
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击切换内容
  handelItemTap(e) {
    const { index } = e.detail
    const { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  },

  // 上传图片
  handelUploadImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths

        this.setData({
          tempFilePaths: [...this.data.tempFilePaths, ...tempFilePaths]
        })
      }
    })
  },

  // 移除图片
  handelRemoveImg(e) {
    let { tempFilePaths } = this.data
    const { index } = e.currentTarget.dataset

    tempFilePaths.splice(index, 1)

    this.setData({
      tempFilePaths
    })
  },

  // 输入框的值
  handelInputText(e) {
    this.setData({
      textValue: e.detail.value
    })

  },

  // 点击提交内容
  handleFormSubmit(e) {
    const { textValue, tempFilePaths } = this.data
    // 判断输入内容是否合法
    if (!textValue.trim()) {
      showToast({ title: '请输入内容' })
      return
    }

    // 3 准备上传图片 到专门的图片服务器 
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 判断有没有需要上传的图片数组

    if (tempFilePaths.length != 0) {
      tempFilePaths.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            // 所有的图片都上传完毕了才触发  
            if (i === tempFilePaths.length - 1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              //  提交都成功了
              // 重置页面
              this.setData({
                textVal: "",
                tempFilePaths: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });

            }
          }
        });
      })
    } else {
      wx.hideLoading();

      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });

    }


  }
})