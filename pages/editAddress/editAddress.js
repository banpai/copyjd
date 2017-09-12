/**
 * 孙秀明
 * 2017.8.15
 */
let app = getApp();
let tcity = require("../../utils/citys.js");
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        windowHeight: 0,  //显示屏高度
        windowWidth: 0,  //显示屏宽度
        province: "",  //省
        city: "",  //市
        county: '',  //区
        provinces: [],  //省数组
        citys: [],   //市数组
        countys: [],  //区数组
        value: [0, 0, 0],
        values: [0, 0, 0],
        userName: '',  //收件人姓名
        userTel: '',  //收件人电话
        userAddress: '',  //收件人地址
        userMoreAddress: '',  //收件人详细地址
        addressMenuIsShow: false,  //是否显示三级联动弹窗
        animationData: {},  //动画
        onLoaded: true,  //是否请求完毕
        delShow: true, //删除地址按钮 是否显示
        addressid: '', //地址id
        state: ''  //1是增加  2是编辑
    },
    getUserName(e) {
        //获得收件人姓名
        let _this = this;
        let userName = e.detail.value;
        _this.setData({
            userName: userName
        })
    },
    getUserTel(e) {
        //获得收件人电话
        let _this = this;
        let userTel = e.detail.value;
        _this.setData({
            userTel: userTel
        })
    },
    getUserMoreAddress(e) {
        //获得收件人详细地址
        let _this = this;
        let userMoreAddress = e.detail.value;
        _this.setData({
            userMoreAddress: userMoreAddress
        })
    },
    postAddress() {
        //保存地址
        let _this = this;
        let realname = _this.data.userName; //姓名
        let mobile = _this.data.userTel; //电话
        let userAddress = _this.data.userAddress; //拼接的地址
        let province = _this.data.province; //省
        let city = _this.data.city;  //市
        let area = _this.data.county;  //区
        let address = _this.data.userMoreAddress; //详细地址
        let warn = '';
        let state = _this.data.state;  //当前状态 1是增加  2是编辑
        let addressid = _this.data.addressid;  //addressid
        if (realname == '') {
            warn = '请填写收货人姓名!';
        } else if (realname.length < 2 || realname.length > 10) {
            warn = '姓名长度不正确!';
        } else if (mobile == '') {
            warn = '请填写收货人手机号!';
        } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
            warn = '手机号码格式不正确!';
        } else if (userAddress == '') {
            warn = '请选择收货地址!';
        } else if (address == '') {
            warn = '请填写详细收货地址!';
        }
        if (warn) {
            wx.showToast({
                title: warn,
                mask: true,
                image: '../../public/images/errorss.png',
                duration: 1500
            })
        } else {
            if (state == 1) {
                let signData = {
                    realname,
                    mobile,
                    province,
                    city,
                    area,
                    address
                }
                esTools.fn.setEmpty().setSession().signData(signData).setMethod('post').addresses(function (res) {
                    if (res.statusCode === 1) {
                        signData.id = res.data;
                        app.globalData.addindex= res.data;
                        app.globalData.addressData = signData;
                        console.log(res.data);
                        wx.showToast({
                            title: '新增成功',
                            icon: 'success',
                            duration: 1500
                        })
                        wx.navigateBack();
                    }else{
                        wx.showToast({
                            title: '新增失败',
                            image: '../../public/images/errorss.png',
                            duration: 1500
                        })
                    }
                })
            } else if (state == 2) {
                let signData = {
                    realname,
                    mobile,
                    province,
                    city,
                    area,
                    address,
                    addressid
                }
                esTools.fn.setEmpty().setSession().signData(signData).setMethod('put').addresses(function (res) {
                    if (res.statusCode === 1) {
                        signData.id = addressid;
                        app.globalData.addindex= addressid;
                        app.globalData.addressData = signData;
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            duration: 1500
                        })
                        wx.navigateBack();
                    }else{
                        wx.showToast({
                            title: '已添加该地址',
                            image: '../../public/images/errorss.png',
                            duration: 1500
                        })
                    }
                })
            }
        }
    },
    delAddress() {
        let _this = this;
        let addressid = _this.data.addressid;
        wx.showModal({
            title: '确认要删除该地址吗？',
            confirmColor: '#19AC15',
            success: function (res) {
                if (res.confirm) {
                    let signData = {
                        addressid: addressid
                    };
                    esTools.fn.setEmpty().setSession().signData(signData).setMethod('delete').addresses(function (res) {
                        if (res.statusCode === 1) {
                            if (app.globalData.debug === true) {
                                console.log('editAddress.js delAddress addresses res');
                            }
                            app.globalData.addressData = {};
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1500
                            })
                            wx.navigateBack();
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },
    bindChange(e) {
        let _this = this;
        let provinces = _this.data.province;
        let citys = _this.data.city;
        let countys = _this.data.county;
        let val = e.detail.value;
        let t = _this.data.values;
        let cityData = _this.data.cityData;

        if (val[0] != t[0]) {
            const citys = [];
            const countys = [];
            for (let i = 0; i < cityData[val[0]].sub.length; i++) {//循环当前'省'下的所有市
                citys.push(cityData[val[0]].sub[i].name);
            }
            for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {//循环当前'市'下的所有区
                countys.push(cityData[val[0]].sub[0].sub[i].name);
            }
            _this.setData({
                province: _this.data.provinces[val[0]],
                city: cityData[val[0]].sub[0].name,
                county: cityData[val[0]].sub[0].sub[0].name,
                citys: citys,
                countys: countys,
                values: val,
                value: [val[0], 0, 0]
            })
            return;
        }
        if (val[1] != t[1]) {
            const countys = [];
            for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
            }
            _this.setData({
                city: _this.data.citys[val[1]],
                county: cityData[val[0]].sub[val[1]].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0]
            })
            return;
        }
        if (val[2] != t[2]) {
            _this.setData({
                county: _this.data.countys[val[2]],
                values: val
            })
            return;
        }
    },
    selectDistrict() {
        // 如果当前已经显示，再次点击时隐藏
        let _this = this
        if (_this.data.addressMenuIsShow) {
            _this.startAddressAnimation(false);
        } else {
            _this.startAddressAnimation(true);
        }
    },
    startAddressAnimation(isShow) {
        // 执行动画
        let _this = this;
        if (isShow) {
            _this.animation.translateY(0 + 'vh').step();
        } else {
            _this.animation.translateY(50 + 'vh').step();
        }
        _this.setData({
            animationData: _this.animation.export(),
            addressMenuIsShow: isShow,
        })
    },
    cityCancel(e) {
        // 点击地区选择取消按钮
        let _this = this;
        _this.startAddressAnimation(false);
    },
    citySure(e) {
        // 点击地区选择确定按钮
        let _this = this;
        let province = _this.data.province;
        let city = _this.data.city;
        let county = _this.data.county;
        let userAddress = _this.data.userAddress;
        userAddress = `${province} ${city} ${county}`;
        _this.setData({
            userAddress: userAddress
        })
        _this.startAddressAnimation(false);

    },
    onLoad(options) {
        let _this = this;
        tcity.init(_this);
        let cityData = _this.data.cityData;
        const provinces = [];
        const citys = [];
        const countys = [];
        for (let i = 0; i < cityData.length; i++) {//初始化第一个省份
            provinces.push(cityData[i].name);
        }
        for (let i = 0; i < cityData[0].sub.length; i++) {//初始化第一个市
            citys.push(cityData[0].sub[i].name);
        }
        for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {//初始化第一个区
            countys.push(cityData[0].sub[0].sub[i].name);
        }

        if (options.itemads != undefined) {
            console.log(options);
            console.log(options.itemads);
            let userName = JSON.parse(options.itemads).realname;
            let userTel = JSON.parse(options.itemads).mobile;
            let userMoreAddress = JSON.parse(options.itemads).address;
            let addressid = JSON.parse(options.itemads).id;
            let userAddress = `${JSON.parse(options.itemads).province} ${JSON.parse(options.itemads).city} ${JSON.parse(options.itemads).area}`;
            _this.setData({
                userName: userName,
                userTel: userTel,
                userAddress: userAddress,
                userMoreAddress: userMoreAddress,
                addressid: addressid
            })
        }
        if (options.state) {
            _this.setData({
                state: options.state
            })
        }

        let lastDelShow = options.delShow === "false" ? false : true;
        _this.setData({
            provinces: provinces,
            citys: citys,
            countys: countys,
            province: cityData[0].name,
            city: cityData[0].sub[0].name,
            county: cityData[0].sub[0].sub[0].name,
            onLoaded: false,
            delShow: lastDelShow
        })
    },
    onShow() {
        let _this = this;
        // 获取显示屏宽高
        wx.getSystemInfo({
            success: function (res) {
                let height = `height:${res.windowHeight}px;`;
                let width = `width:${res.windowWidth}px;`
                _this.setData({
                    windowHeight: height,
                    windowWidth: width
                })
            }
        });
        // 初始化动画变量
        let animation = wx.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%",
            timingFunction: 'ease',
        })
        _this.animation = animation;

    }
})