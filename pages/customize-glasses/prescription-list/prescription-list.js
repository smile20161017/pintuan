const app = getApp()

Page({
    data: {
		list: [],
		selectedId: null,
		selectedType: null,
		cartFlag: 0,
		goodsId: 0,
		optionId: 0,
		total: '',
		goodsData: null
    },
    onLoad(options) {
		this.setData({
			cartFlag: parseFloat(options.cart),
			goodsId: options.id,
			optionId: options.option_id,
			total: options.total
		})
		if (!parseFloat(options.cart)) {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('buyNow', (data) => {
				// 设置处方值
				this.setData({
					goodsData: data.data
				})
			})
		}
    },
	onShow() {
		this.getData()
	},
	// 选择商品
	itemSelected(e) {
		this.setData({
			selectedId: e.currentTarget.dataset.item.id,
			selectedType: e.currentTarget.dataset.item.type
		})
	},
	buy() {
		if (this.data.selectedId) {
			if (this.data.cartFlag) {
				wx.$api.addToCart({
					id: this.data.goodsId,
					optionid: this.data.optionId,
					lens_id: this.data.selectedId
				}).then(res => {
					wx.switchTab({
						url: '/pages/cart/cart/cart'
					})
				}).catch(res => {
					wx.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
				})
			} else {
				let arr = []
				arr.push(Object.assign(this.data.goodsData, {
					lens_id: this.data.selectedId,
					lens_type: this.data.selectedType
				}))
				app.globalData.orderData = arr
				wx.navigateTo({
					url: '/pages/cart/order/confirm-order/confirm-order'
				})
			}
		} else {
			wx.showToast({
				title: '请选择验光单',
				icon: 'none',
				duration: 2000
			})
		}
	},
	getData() {
		wx.$api.rxList().then(res => {
			this.setData({
				list: res.list
			})
		})
	}
})