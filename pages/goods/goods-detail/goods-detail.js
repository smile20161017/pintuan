const app = getApp()

Page({
	data: {
		paramShow: false,
		couponShow: false,
		safeguardShow: false,
		buyNowShow: false,
		detail: null,
		relationList: [],
		colorList: [],
		collectFlag: 0,
		thumbsCurrent: 0,
		color: {},
		lens: null,
		cartFlag: 0,
		couponList: [],
		reviewData: null,
		reviewTotal: 0,
		loginShow: false,
		backFlag: true
	},
	onLoad(options) {
		this.getData(options.id)
		this.getReviewData(options.id)
		let pages = getCurrentPages()
		if (pages.length == 1) {
			this.setData({
				backFlag: false
			})
		}
	},
	swiperChange(e) {
		this.setData({
			thumbsCurrent: e.detail.current
		})
	},
	imgShow(e) {
		wx.previewImage({
			current: e.currentTarget.dataset.src,
			urls: this.data.detail.goods.thumbs,
		})
	},
	collect() {
		if (!wx.getStorageSync('ruufooOpenId') || !wx.getStorageSync('ruufooChecked')) {
			this.setData({
				loginShow: true
			})
			return
		}
		let flag = this.data.collectFlag
		wx.$api.collect({
			id: this.data.detail.goods.id,
			remove: flag
		}).then(res => {
			this.setData({
				collectFlag: flag ? 0 : 1
			})
		})
	},
	// 优惠券
	couponShowFn() {
		if (!wx.getStorageSync('ruufooOpenId') || !wx.getStorageSync('ruufooChecked')) {
			this.setData({
				loginShow: true
			})
			return
		}
		this.setData({
			couponShow: true
		})
	},
	// 领取优惠券
	getCoupon(e) {
		if (!e.currentTarget.dataset.item.receive) {
			wx.$api.getCoupon({
				id: e.currentTarget.dataset.item.id
			}).then(res => {
				wx.showToast({
					title: '领取成功',
					duration: 2000
				})
				let list = this.data.couponList
				list[e.currentTarget.dataset.index].receive = 1
				this.setData({
					couponList: list
				})
			})
		}
	},
	// 参数
	paramShowFn() {
		this.setData({
			paramShow: true
		})
	},
	// 保障
	safeguardShowFn() {
		this.setData({
			safeguardShow: true
		})
	},
	// 去首页
	goHome() {
		wx.reLaunch({
			url: '/pages/index/index'
		})
	},
	// 去购物车
	goToCart() {
		if (!wx.getStorageSync('ruufooOpenId') || !wx.getStorageSync('ruufooChecked')) {
			this.setData({
				loginShow: true
			})
			return
		}
		wx.reLaunch({
			url: '/pages/cart/cart/cart'
		})
	},
	// 加入购物车
	addToCart(e) {
		if (!wx.getStorageSync('ruufooOpenId') || !wx.getStorageSync('ruufooChecked')) {
			this.setData({
				loginShow: true
			})
			return
		}
		if (!this.data.detail.goods.status) return
		this.setData({
			cartFlag: e.currentTarget.dataset.type,
			buyNowShow: true
		})
	},
	// 切换颜色
	colorChange(e) {
		e.currentTarget.dataset.id != this.data.detail.goods.id ? this.getData(e.currentTarget.dataset.id) : ''
	},
	// 切换镜片
	lensChange(e) {
		if (!e.currentTarget.dataset.item.stock) return
		this.setData({
			lens: e.currentTarget.dataset.item
		})
	},
	// 立即购买按钮
	buyNow() {
		if (!this.data.lens) return
		let data = {
			goodsid: this.data.detail.goods.id,
			id: 0,
			lens_id: '',
			lens_type: '',
			optionid: this.data.lens.id,
			price: this.data.lens.marketprice,
			reason: '',
			spec_title: this.data.lens.title,
			spec_img: this.data.lens.spec_img,
			status: 1,
			thumb: this.data.detail.goods.thumbs[0],
			title: this.data.detail.goods.title,
			total: 1
		}
		if (this.data.lens.goodssn == '1') {
			wx.navigateTo({
				url: '/pages/customize-glasses/prescription-list/prescription-list?id=' + this.data.detail.goods.id + '&option_id=' + this.data.lens.id + '&cart=' + this.data.cartFlag + '&total=' + this.data.lens.marketprice,
				success: (res) => {
					res.eventChannel.emit('buyNow', {data: data})
				}
			})
		} else {
			if (this.data.cartFlag) {
				wx.$api.addToCart({
					id: this.data.detail.goods.id,
					optionid: this.data.lens.id,
					lens_id: ''
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
				app.globalData.orderData = [data]
				wx.navigateTo({
					url: '/pages/cart/order/confirm-order/confirm-order'
				})
			}
		}
	},
	// 客服回调
	handleContact(e) {
	},
	getData(id) {
		wx.$api.goodsDetail({
			id: id
		}).then(res => {
			let content = res.goods.content
			content = content.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
							 .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
							 .replace(/<p>/ig, '<p class="detail-p">')
							 .replace(/<span([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span')
							 .replace(/<span([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<span')
							 .replace(/<span>/ig, '<span class="detail-span">')
			res.goods.content = content
			this.setData({
				detail: res,
				couponList: res.coupon_list,
				collectFlag: res.goods.collect,
				color: res.color_list.filter((item) => item.id == id)[0],
				thumbsCurrent: 0,
				lens: res.option_list.filter((item) => item.stock)[0] ? res.option_list.filter((item) => item.stock)[0] : null,
				relationList: this.data.relationList.length ? this.data.relationList : res.relation_list,
				colorList: this.data.colorList.length ? this.data.colorList : res.color_list
			})
		})
	},
	getReviewData(id) {
		wx.$api.reviewList({
			id: id,
			page: 1
		}).then(res => {
			this.setData({
				reviewData: res.list[0] ? res.list[0] : null,
				reviewTotal: res.total
			})
		})
	},
	onShareAppMessage() {
		return {
			title: this.data.detail.goods.title,
			path: '/pages/goods/goods-detail/goods-detail?id=' + this.data.detail.goods.id
		}
	},
	bindGetUserInfo(e) {
		let pages = getCurrentPages()
		let currPage = null
		if (pages.length) {
		  currPage = pages[pages.length - 1]
		}
		app.globalData.tempRoute = currPage.route + '?id=' + this.data.detail.goods.id
		if (e.detail.userInfo) {
			app.globalData.userInfo = e.detail.userInfo
			wx.navigateTo({
				url: '/pages/guide/guide/guide'
			})
		}
	},
	later() {
		this.setData({
			loginShow: false
		})
	}
})
