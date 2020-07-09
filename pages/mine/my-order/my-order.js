Page({
	data: {
		orderType: '0',
		allOrderTypeList: [
			{ name: '全部', value: '0' },
			{ name: '待付款', value: '1' },
			{ name: '待发货', value: '2' },
			{ name: '待收货', value: '3' },
			{ name: '待评价', value: '4' },
		],
		orderList: [],
		page: 1,
		pageCount: 1
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			orderType: options.type
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.setData({
			page: 1
		})
		this.getOrderList()
	},
	getOrderList() {
		wx.$api.getOrderList({
			page: this.data.page,
			status: this.data.orderType
		}, true).then(res => {
			this.setData({
				pageCount: res.count_page,
				orderList: this.data.page == 1 ? res.list : this.data.orderList.concat(res.list)
			})
		})
	},
	onSelectOrderType(ev) {
		if(this.data.orderType == ev.currentTarget.dataset.value) return
		this.setData({
			orderType: ev.currentTarget.dataset.value
		})
		this.onShow()
	},
	onPayOrder(ev) {
		var _orderId = ev.currentTarget.dataset.id
		wx.$api.pay({
			orderid: _orderId
		}).then(data => {
			wx.requestPayment({
				timeStamp: data.payinfo.timeStamp,
				nonceStr: data.payinfo.nonceStr,
				package: data.payinfo.package,
				signType: data.payinfo.signType,
				paySign: data.payinfo.paySign,
				success: res => {
					wx.$api.paymentSuccessCallback({
						orderid: _orderId
					})
					wx.redirectTo({
						url: '/pages/cart/order/payment-success/payment-success?orderId=' + _orderId
					})
				},
				fail: err => {
					wx.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					})
				}
			})
		}).catch(data => {
			wx.showToast({
				title: data.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	onConfirmOrder(ev) {
		wx.$api.orderConfirm({
			orderid: ev.currentTarget.dataset.id
		}, true).then(res => {
			this.onShow()
		})
	},
	onCancelOrder(ev) {
		wx.showModal({
			title: '提示',
			content: '确认取消订单',
			success: (res) => {
				res.confirm && wx.$api.orderCancel({
					orderid: ev.currentTarget.dataset.id
				}, true).then(res => {
					this.onShow()
				})
			}
		})
	},
	onReviewsOrder(ev) {
		wx.navigateTo({
			url: '/pages/mine/write-review/write-review',
			success: res => {
				res.eventChannel.emit('acceptOrderInfo', {
					id: this.data.orderList[ev.currentTarget.dataset.index].id,
					comments: this.data.orderList[ev.currentTarget.dataset.index].goods.map(item => {
						return {
							id: item.id,
							title: item.title,
							thumb: item.thumb
						}
					})
				})
			}
		})
	},
	onCheckExpress(ev) {
		wx.navigateTo({
			url: '/pages/mine/track-order/track-order?id=' + ev.currentTarget.dataset.id
		})
	},
	onClickOrder(ev) {
		wx.navigateTo({
			url: '/pages/mine/my-order-detail/my-order-detail?id=' + ev.currentTarget.dataset.id
		})
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		if(this.data.page < this.data.pageCount) {
			this.setData({
				page: this.data.page + 1
			})
			this.getOrderList()
		}
	}
})