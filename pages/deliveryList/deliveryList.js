/**
 * 孙秀明
 * 2017.8.15
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        dispatches: [],
        isSelected:''
    },
    goOrderConfirm(e) {
        console.log(e)
        app.globalData.dispatche= e.currentTarget.dataset.dispatches;
        wx.redirectTo({ url: `/pages/orderConfirm/orderConfirm` });
    },
    onLoad(options) {
        let _this = this;
        let dispatcheCont=app.globalData.dispatcheCont;
        let signData = app.globalData.orderData;

        esTools.fn.setEmpty().setSession().signData(signData).setMethod('get').setExtraUrl('confirm').orders(function (res) {
            if (res.statusCode === 1) {
                if (app.globalData.debug === true) {
                    console.log('deliveryList.js onLoad addresses res');
                    console.log(res);
                }
                let dispatches = res.data.dispatches;
                for(let i=0;i<dispatches.length;i++){
                    dispatches[i].isSelected=false;
                    if(dispatches[i].dispatchname==dispatcheCont){
                        dispatches[i].isSelected=true;
                        console.log(dispatches[i]);
                    }
                }
                console.log(dispatches);
                _this.setData({
                    dispatches
                })
            }
        })
    }
})