// QRCode.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    windowHeight:'',
    qrimg:'',
      qrShow:'',
      qrData:'',
      onLoaded: true,
  },

  onLoad: function (options) {
    let _this=this;
    let data={

    }
      esTools.fn.setEmpty().setSession().signData(data).setMethod('get').qrimgs(function (res) {
          if (app.globalData.debug === true) {
              console.log('QRCode.js get qrimgs res');
              console.log(res);
          }
          if(res.statusCode==1){
            _this.setData({
                qrimg:res.data.qrimg,
                qrShow:true,
                onLoaded: false
            })
          }else{
            _this.setData({
                qrShow:false,
                qrData:res.data,
                onLoaded: false
            })
          }
          // else{
          //   _this.setData({
          //       qrShow:false,
          //   })
          //   console.log('网络问题'+res.data)
          // }
      })
  },


  onShow: function () {
      app.getWindowInfo()
      this.setData({
          windowHeight:app.globalData.windowHeight
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:'我的二维码',
        desc:'快来关注我吧',
        path:'page/QRCode?id=123'
    }
  }
})