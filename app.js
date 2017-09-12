//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs);
    },
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb === "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                    that.globalData.userInfo = res
                    typeof cb === "function" && cb(that.globalData.userInfo)
                },
                fail : function(res){
                    console.log('app.js getUserInfo fail.');
                    // that.globalData.userInfo = res
                    typeof cb === "function" && cb(res)
                }
            })
        }
    },
    authorize : function(type, cb){
        let that = this;
        // $scopeLists = ['scope.userInfo', 'scope.address', 'scope.userLocation'];

        wx.getSetting({
            success: (res) => {
                if(res.authSetting[type] === false){

                    wx.authorize({
                        scope: type,
                        success() {
                            that.callback({statusCode : 1, data: true}, cb)
                        },
                        fail(){
                            that.callback({statusCode : 0, data: false}, cb)
                        }
                    });

                }else{
                    that.callback({statusCode : 1, data: true}, cb)
                }
            }
        })

    },
    callback : function(res, cb){
        if (typeof cb === "object" || typeof cb === "function") {
            if (typeof cb === "function") {
                cb(res);
                return true;
            }

            if (res.statusCode === 1) {
                if (typeof cb.success === "function") {
                    cb.success(res);
                }
            } else {
                if (typeof cb.fail === "function") {
                    cb.fail(res);
                }
            }

            if (typeof cb.complete === 'function') {
                cb.complete(res);
            }
        }

        return res;
    },
    getWindowInfo:function () {
        var that=this;
        wx.getSystemInfo({
            success:(res)=>{
                let height="height:"+res.windowHeight+"px";
                that.globalData.windowHeight=height
            }
        })
    },
    globalData: {
        userInfo: null,
        debug : true,
        windowHeight:'',
        orderData:{
            goodsid:'',
            optionid:'',
            cartids:'',
            total:''
        },
        addressData:{},
        dispatche:'',
        addindex:'',
        dispatcheCont:''
    }
})
