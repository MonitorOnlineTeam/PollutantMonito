// pages/realTimeData/home/home.js
const moment = require('../../../utils/moment.min.js');
const app = getApp();
const comApi = app.api;
const common = app.common;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRow: '-',
    pageBackgroundColor: 'white',
    identificationName: '', //异常详情
    identificationCode: '', //标识
    overMultiple: '', //超标倍数
    standValue: '',
    pointInfo: null,
    isShowContent: false,
    isShowInfo: false,
    DGIMN: '',
    dataInfo: null,
    imageSrc: null,
    isAuthor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      DGIMN: common.getStorage('DGIMN'),
      isAuthor: app.isAuthor()
    });
    console.log(this.data.isAuthor);
    this.data.isAuthor && this.onPullDownRefresh();


  },
  goLogin: function() {
    app.goLogin();
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
    this.data.isAuthor && app.isLogin();
    this.setData({
      isAuthor: app.isAuthor()
    });
    if (this.data.DGIMN !== common.getStorage('DGIMN')) {
      common.setStorage('selectedPollutants', "");
      common.setStorage('selectedDate', moment().format('YYYY-MM-DD HH:mm'));
      this.setData({
        DGIMN: common.getStorage('DGIMN')
      });


      this.onPullDownRefresh();

    }
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
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.getData();
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
    return {
      path: `/pages/realTimeData/home/home?DGIMN=${common.getStorage("DGIMN")}` // 路径，传递参数到指定页面。
    }
  },
  //点击页面横屏
  horizontalScreen: function() {

    let _this = this;
    const sdlMN = app.globalData.sdlMN.filter(m => m === this.data.DGIMN);
    if (sdlMN.length > 0) {
      app.getUserLocation(function(r) {
        if (r) {
          wx.navigateTo({
            url: '../flowChart/flowChart'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../flowChart/flowChart'
      })
    }


  },
  //获取数据
  getData: function() {
    var resultData = {
      dataitem: [],
      pointInfo: {},

    };
    let _this = this;
    const sdlMN = app.globalData.sdlMN.filter(m => m === this.data.DGIMN);
    if (sdlMN.length > 0) {
      app.getUserLocation(function(r) {
        if (r) {
          comApi.getProcessFlowChartStatus().then(res => {
            if (res && res.IsSuccess && res.Data) {
              console.log(res.Data.paramsInfo)

              var pointType = res.Data.dataInfo ? res.Data.dataInfo.equipmentType : 1;
              var imageSrc = "/images/point.png";
              if (pointType == 1) {
                imageSrc = "/images/point.png";

              } else if (pointType == 2) {
                imageSrc = "/images/vocpoint.png";
              } else if (pointType == 3) {
                imageSrc = "/images/hgpoint.png";
              }
              _this.setData({
                dataInfo: res.Data.paramsInfo,
                imageSrc: imageSrc,
              })
            }
          })

          comApi.getRealTimeDataForPoint().then(res => {
            if (res && res.IsSuccess) {
              if (res.Data) {
                let data = res.Data;
                resultData.dataitem = data.dataitem || [];
                resultData.pointInfo = data.pointInfo;
              }
            }
            _this.setData({
              dataitem: resultData.dataitem,
              pointInfo: resultData.pointInfo,
            })
            let pointName = resultData.pointInfo && resultData.pointInfo.pointName;
            pointName && wx.setNavigationBarTitle({
              title: pointName,
            });
            common.setStorage("PointName", pointName);
            pointName && wx.setNavigationBarTitle({
              title: pointName,
            });

            wx.hideNavigationBarLoading();
          })
        } else {

          wx.hideNavigationBarLoading();
        }
      })
    } else {
      comApi.getProcessFlowChartStatus().then(res => {
        if (res && res.IsSuccess && res.Data) {
          console.log(res.Data.paramsInfo)

          var pointType = res.Data.dataInfo ? res.Data.dataInfo.equipmentType : 1;
          var imageSrc = "/images/point.png";
          if (pointType == 1) {
            imageSrc = "/images/point.png";

          } else if (pointType == 2) {
            imageSrc = "/images/vocpoint.png";
          } else if (pointType == 3) {
            imageSrc = "/images/hgpoint.png";
          }
          _this.setData({
            dataInfo: res.Data.paramsInfo,
            imageSrc: imageSrc,
          })
        }
      })

      comApi.getRealTimeDataForPoint().then(res => {
        if (res && res.IsSuccess) {
          if (res.Data) {
            let data = res.Data;
            resultData.dataitem = data.dataitem || [];
            resultData.pointInfo = data.pointInfo;
          }
        }
        _this.setData({
          dataitem: resultData.dataitem,
          pointInfo: resultData.pointInfo,
        })
        let pointName = resultData.pointInfo && resultData.pointInfo.pointName;
        pointName && wx.setNavigationBarTitle({
          title: pointName,
        });
        common.setStorage("PointName", pointName);
        pointName && wx.setNavigationBarTitle({
          title: pointName,
        });

        wx.hideNavigationBarLoading();
      })
    }

  },
  //超标异常时弹出窗口
  showModal(e) {
    //debugger
    let {
      pollutantCode,
      pollutantName,
      overMultiple,
      identificationName,
      identificationCode,
      standValue
    } = e.currentTarget.dataset.obj;
    if (identificationCode == "1") {
      this.setData({
        identificationCode: identificationCode,
        overMultiple: overMultiple,
        modalName: e.currentTarget.dataset.target,
        selectedRow: pollutantName,
        standValue: standValue
      })
    } else if (identificationCode == "-1") {
      this.setData({
        identificationCode: identificationCode,
        identificationName: identificationName,
        modalName: e.currentTarget.dataset.target,
        selectedRow: pollutantName
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      selectedRow: '-'
    })
  }
})