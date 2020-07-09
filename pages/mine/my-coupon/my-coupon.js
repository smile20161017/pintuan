Page({
	data: {
		couponList: []
	},
	onLoad(options) {
		wx.$api.myCoupon().then(res => {
			this.setData({
				couponList: res.list
			})
		})
	},
	goToUse(e) {
		if (e.currentTarget.dataset.effective == '1') {
			wx.switchTab({
				url: '/pages/index/index'
			})
		}
	}
})
