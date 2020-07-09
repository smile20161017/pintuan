Page({
    data: {
		orderId: 0
    },
	onLoad(options) {
		this.setData({
			orderId: options.orderId
		}) 
    },
	// 继续支付
	pay() {
		wx.$api.pay({
			orderid: this.data.orderId
		}).then(data => {
			wx.requestPayment({
				timeStamp: data.payinfo.timeStamp,
				nonceStr: data.payinfo.nonceStr,
				package: data.payinfo.package,
				signType: data.payinfo.signType,
				paySign: data.payinfo.paySign,
				success: (response) => {
					wx.redirectTo({
						url: '/pages/cart/order/payment-success/payment-success?orderId=' + res.orderid
					})
				},
				fail: (response) => {
					
				}
			})
		})
	}
})