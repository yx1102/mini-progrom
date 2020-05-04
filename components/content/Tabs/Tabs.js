// components/content/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 当前选中项
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 传方法给父组件修改
    handelItemTap(e){
      const {index} =e.currentTarget.dataset
      this.triggerEvent("handelItemTap", {index})
    }
  }
})
