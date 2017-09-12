/**
 * 孙秀明
 * 2017.8.14
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    defaultAddress: {},  //默认地址
    orderGoods: [],      //订单商品列表
    memberDiscount: {},  //订单消费明细
    addressLists: [],    //地址列表
    dispatches: [],      //配送方式列表
    dispatche: '',        //配送方式
    dispatcheId: '',     //配送ID
    addressId: '',       //收货地址ID
    dispatcheMoney: '',  //运费
    screenWidth: 0,
    screenHeight: 0,
    onLoaded: true             //是否请求完毕
  },
  godeliveryList(e) {
    app.globalData.dispatcheCont=e.currentTarget.dataset.dispatche;
    wx.redirectTo({ url: `/pages/deliveryList/deliveryList` });
  },
  addressList(e) {
    //当前地址列表是否为空，首次为空去设置新地址，否则去地址列表
    let _this = this;
    let addressLists = _this.data.addressLists;
    if (addressLists.length > 0) {
      app.globalData.addindex=e.currentTarget.dataset.addindex;
      wx.navigateTo({ url: `/pages/addressList/addressList`});
    } else {
      let delShow = false;
      wx.navigateTo({ url: `/pages/editAddress/editAddress?delShow=${delShow}&state=1`});
    }
  },
  gopay() {
    //确认订单和支付
    let _this = this;
    let cartids = app.globalData.orderData.cartids;
    let dispatchid = _this.data.dispatcheId;
    let addressid = _this.data.addressId;
    let remark = '';
    let goods = '';
    let orderGoods = _this.data.orderGoods;

    if (!addressid) {
      wx.showToast({
        title: "请选择收货地址",
        mask: true,
        image: '../../public/images/errorss.png',
        duration: 1500
      })
      return
    }
    if (orderGoods.length == 1) {
      goods = orderGoods[0].goodsid + ',' + orderGoods[0].optionid + ',' + orderGoods[0].total;
    } else if (orderGoods.length > 1) {
      for (let i = 0; i < orderGoods.length; i++) {
        goods += orderGoods[i].goodsid + ',' + orderGoods[i].optionid + ',' + orderGoods[i].total + '|';
      }
      let goodsLen = goods.length;
      goods = goods.slice(0, goodsLen - 1);
    }

    let signData = {
      cartids,
      dispatchid,
      addressid,
      remark,
      goods
    }
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('post').setExtraUrl('confirm').orders(function (res) {
      if (app.globalData.debug === true) {
        console.log('orderConfirm.js gopay confirm res');
        console.log(res);
      }
      if (res.statusCode === 1) {
          wx.showToast({
              title: '确认订单成功',
              icon: 'success',
              duration: 1500,
              mask:true
          })
          setTimeout(()=>{
              wx.redirectTo({url:'/pages/orderStatus/orderStatus'});
          },1500)

        // let that = _this;
        // let signData = {
        //   ordersn: res.data.ordersn,
        //   type: 1
        // }
        // esTools.fn.setEmpty().setSession().signData(signData).setMethod('post').setExtraUrl('payment').orders(function (res) {
        //   if (app.globalData.debug === true) {
        //     console.log('orderConfirm.js gopay payment res');
        //     console.log(res);
        //   }
        //   if (res.statusCode === 1) {
        //     console.log(res);
        //   }
        // })
      }
    })

  },
  onShow() {
    //默认地址、订单商品列表、配送方式、订单消费明细、配送ID、收货地址ID
    let _this = this;
    let signData = app.globalData.orderData;
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('get').setExtraUrl('confirm').orders(function (res) {
      if (app.globalData.debug === true) {
        console.log('orderConfirm.js onLoad confirm res');
        console.log(res);
      }
      if (res.statusCode == 1) {
        let addressLists = res.data.addressLists; //地址列表
        let defaultAddress = res.data.defaultAddress; //默认地址  默认数组第一个
        let orderGoods = res.data.orderGoods; //商品列表
        let memberDiscount = res.data.memberDiscount;  //订单消费明细
        let dispatches = res.data.dispatches;  //配送方式列表
        let dispatche = res.data.dispatches[0];  //当前配送方式 默认数组第一个
        let addressId = res.data.defaultAddress.id;  //当前选择地址id  默认是默认地址  后面是选择的地址
        let dispatcheId = res.data.dispatches[0].id;  //当前配送方式id  默认是默认配送方式  后面是选择的配送方式
        let dispatcheMoney = _this.data.dispatcheMoney; //运费

        //默认收货地址和地址ID
        if (addressLists.length > 0) {
          defaultAddress = addressLists[0];
          addressId = addressLists[0].id;
        }

        //修改默认地址和地址ID
        if (app.globalData.addressData.address != undefined) {
          defaultAddress = app.globalData.addressData;
          addressId = app.globalData.addressData.id;
        }

        //默认配送方式和配送id和运费
        if (dispatches.length > 0) {
          dispatche = dispatches[0].dispatchname;
          dispatcheId = dispatches[0].id;
          dispatcheMoney = dispatches[0].price;
        }

        //修改默认配送方式和配送ID
        if (app.globalData.dispatche != '') {
          dispatche = app.globalData.dispatche.dispatchname;
          dispatcheId = app.globalData.dispatche.id;
        }

        //默认地址、订单商品列表、配送方式、订单消费明细、配送ID、收货地址ID
        _this.setData({
          defaultAddress,
          orderGoods,
          memberDiscount,
          dispatches,
          dispatche,
          addressLists,
          addressId,
          dispatcheId,
          dispatcheMoney,
          onLoaded: false
        })

        //获取运费
        let that = _this;
        let signData2 = app.globalData.orderData;
        signData2.dispatchid = _this.data.dispatcheId || '';
        signData2.addressid = _this.data.addressId || '';
        signData2.remark = '';
        esTools.fn.setEmpty().setSession().signData(signData).setMethod('get').setExtraUrl('dispatchMoney').orders(function (res) {
          if (app.globalData.debug === true) {
            console.log('orderConfirm.js onLoad dispatchMoney res');
            console.log(res);
          }
          if (res.statusCode === 1) {
            that.setData({
              dispatcheMoney: res.data.dispatches.price
            })
          }
        })
      } else {
        console.log('orderConfirm.js onLoad res 接口请求失败');
        console.log(res);
      }
    })
  }
})