// pages/login/login.js
const app = getApp()
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneCode: '18601364063'
  },
  phone(val) {
    this.setData({
      phoneCode: val.detail.value
    });
  },
  btnLogin: function() {
    console.log(this.data.phoneCode)
    if (this.data.phoneCode.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success(res) {}
      })
      return false;
    }
    this.login();
  },
  login: function() {
    const phone = this.data.phoneCode;
    if (phone && phone.length == 11) {
      comApi.verifyPhone(phone).then(res => {
        if (res && res.IsSuccess) {
          if (res.Data) {
            common.setStorage("OpenId", res.Data);
            app.getUserInfo();
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.Message,
            showCancel: false,
            success(res) {}
          })
        }
      }).catch(res => {
        wx.showModal({
          title: '提示',
          content: res.Message,
          showCancel: false,
          success(res) {}
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})