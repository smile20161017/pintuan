Page({
    data: {
        // create 新建地址 edit 编辑地址
        type: '',
        // addressId
        id: "",
        addressInfo: {
            realname: '',
            mobile: '',
            region: '',
            address: '',
            isdefault: 0
        },
        rules: [{
            name: 'realname',
            rules: {required: true, message: '请输入收货人姓名'},
        }, {
            name: 'mobile',
            rules: {required: true, message: '请输入收货人手机号'},
        }, {
            name: 'region',
            rules: {required: true, message: '请选择地区'},
        }, {
            name: 'address',
            rules: {required: true, message: '请输入详细地址'}
        }]
    },
    onNameInput(ev) { 
        this.setData({
            "addressInfo.realname": ev.detail.value
        })
    },
    onTelInput(ev) { 
        this.setData({
            "addressInfo.mobile": ev.detail.value
        })
    },
    // 修改地区
    onRegionChange(ev) {
        this.setData({
            "addressInfo.region": ev.detail.value.join('/')
        })
    },
    onPlaceInput(ev) { 
        this.setData({
            "addressInfo.address": ev.detail.value
        })
    },
    onSwitchChange(ev) {
        this.setData({
            "addressInfo.isdefault": ev.detail.value ? 1 : 0
        })
    },
    onGetUserAddress() {
        var _that = this;
        wx.chooseAddress({
            success (res) {
                var _map = {
                    userName: "realname",
                    telNumber: "mobile",
                    detailInfo: "address"
                }
                _that.setData(Object.keys(_map).reduce((total, item) => {
                    total[`addressInfo.${_map[item]}`] = res[item]
                    return total
                }, {"addressInfo.region": `${res.provinceName}/${res.cityName}/${res.countyName}`}))
            }
        })
    },
    onSubmitAddress() {
        this.selectComponent('#add-form').validate((valid, errors) => {
            if(valid){
                var _area = this.data.addressInfo.region.split('/');
                wx.$api.updateAddress(Object.assign(this.data.type === 'create' ? {} : {
                    id: this.data.id
                }, {
                    realname: this.data.addressInfo.realname,
                    mobile: this.data.addressInfo.mobile,
                    province: _area[0],
                    city: _area[1],
                    area: _area[2],
                    address: this.data.addressInfo.address,
                    isdefault: this.data.addressInfo.isdefault
                }), true).then(res => {
                    wx.showToast({
                        title: `${this.data.type === 'create' ? '创建' : '编辑'}成功`
                    })
                    wx.navigateBack()
                })
            }else{
                wx.showToast({
                    title: errors[0].message,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    onDeleteAddress() {
        wx.$api.delAddress({id: this.data.id}, true).then(res => {
            wx.showToast({title: "删除成功"})
            wx.navigateBack()
        })
    },	
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData(options)
        if(this.data.type === 'edit'){
            wx.$api.getAddress({id: this.data.id}, true).then(res => {
                res.info.region = `${res.info.province}/${res.info.city}/${res.info.area}`
                this.setData({
                    addressInfo: res.info
                })
            })
        }
    }
})