Page({
    data: {
		orderId: 0
    },
    onLoad(options) {
		this.setData({
			orderId: options.orderId
		}) 
    },
	// 返回首页
	backToIndex() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	// 查看订单
	checkOrder() {
		wx.redirectTo({
			url: '/pages/mine/my-order-detail/my-order-detail?id=' + this.data.orderId
		})
	}
})