Page({
    data: {
		orderId: '',
		info: {},
		sn: ''
    },
    onLoad(options) {
		this.setData({
			orderId: options.id
		})
	},
    onShow() {
        this.getExpressInfo()
    },
	getExpressInfo() {
		wx.$api.getExpressInfo({orderid: this.data.orderId}, true).then(res => {
			this.setData({
				info: res,
				sn: res.sn
			})
		})
	},
	copy() {
		wx.setClipboardData({
			data: this.data.sn
		})
	}
})