Page({
	data: {
		addressList: [],
		orderFlag: false
	},
	onLoad(options) {
		// 判断是否从确认订单页进入
		if (options.fromOrder) {
			this.setData({
				orderFlag: true
			})
		}
	},
	// 获取用户收货地址列表
	getAddressList() {
		wx.$api.getAddressList({openid: wx.getStorageSync('ruufooOpenId')}, true).then(res => {
			this.setData({
				addressList: res.list
			})
		})
	},
	// 获取用户微信收货地址
	onGetUserAddress() {
        wx.chooseAddress({
            success (res) {
				wx.$api.updateAddress({
                    realname: res.userName,
                    mobile: res.telNumber,
                    province: res.provinceName,
                    city: res.cityName,
                    area: res.countyName,
                    address: res.detailInfo,
                    isdefault: 0
                }, true).then(res => {})
            }
        })
	},
	onEditAddress(ev) {
		wx.navigateTo({url: `/pages/mine/my-add-address/my-add-address?type=edit&id=${ev.currentTarget.dataset.id}`})
	},
	// 向确认订单页传参
	changeOrderAddress(e) {
		if (this.data.orderFlag) {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.emit('acceptDataFromOpenedPage', {data: e.currentTarget.dataset.item})
			wx.navigateBack()
		}
	},
	onShow() {
		this.getAddressList()
	}
})