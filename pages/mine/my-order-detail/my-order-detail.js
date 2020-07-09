Page({
    data: {
        orderId: '',
        orderInfo: {},
        lensTypeList: {
            Myopia: "近视",
            Hyperopia: "远视",
            Progressive: "渐进",
        },
        orderStateIcon: {
            '待付款': 'iconicon1 iconfont',
            '待发货': 'iconicon2 iconfont',
            '待收货': 'iconicon3 iconfont',
            '已完成': ''
        }
    },
	onLoad(options) {
        this.setData({
            orderId: options.id
        })
        this.getOrderInfo()
    },
    getOrderInfo() {
        wx.$api.getOrderInfo({
            orderid: this.data.orderId
        }, true).then(res => {
            this.setData({
                orderInfo: res.order
            })
        })
    },
    onPrescriptionClick(ev) {
        let product = this.data.orderInfo.goods[ev.currentTarget.dataset.index]
        product.lens_info && wx.navigateTo({
            url: '/pages/mine/my-prescription-detail/my-prescription-detail',
            success: function(res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', { prescriptionInfo: product.lens_info })
            }
        })
    },
    onExpressClick() {
        wx.navigateTo({
            url: '/pages/mine/track-order/track-order?id=' + this.data.orderId
        })
    },
    onCopyOrderSN() {
		wx.setClipboardData({
			data: this.data.orderInfo.ordersn
		})
    },
    onProdClick(ev) {
		wx.navigateTo({
			url: '/pages/goods/goods-detail/goods-detail?id=' + ev.currentTarget.dataset.id
		})
    }
})