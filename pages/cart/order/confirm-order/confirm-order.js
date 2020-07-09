const app = getApp()

function add(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	return (arg1 * m + arg2 * m) / m
}
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//乘法
function accMul(arg1, arg2) {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {}
	try {
		m += s2.split(".")[1].length
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

Page({
    data: {
		couponSheet: false,
		address: null,
		list: [],
		totalPrice: 0,
		grandTotal: 0,
		totalNum: 0,
		postage: 0,
		couponList: [],
		coupon: {},
		remark: ''
    },
	onLoad(options) {
		this.setData({
			list: app.globalData.orderData
		})
		this.getPrice().then(price => {
			wx.$api.getAddressList().then(res => {
				if (res.list.length) {
					let address
					for (let i = 0; i < res.list.length; i++) {
						if (res.list[i].isdefault == '1') {
							address = res.list[i]
						}
					}
					this.setData({
						address: address
					})
					this.getInfor(address.id, price)
				}
			})
		})
	},
	// 获取邮费和可用优惠券
	getInfor(id, price) {
		wx.$api.confirmOrder({
			addressid: id,
			goods_cost: price
		}).then(res => {
			this.setData({
				postage: res.freight,
				couponList: res.coupon_list,
				grandTotal: add(this.data.grandTotal, parseFloat(res.freight))
			})
		})
	},
	// 计算价格
	getPrice() {
		return new Promise((resolve, reject) => {
			let price = 0, num = 0, grand = 0,
				list = this.data.list
			for (let i = 0; i < list.length; i++) {
				price = add(price, accMul(list[i].price, list[i].total))
				num += list[i].total
			}
			grand = this.data.coupon.id ? accSub(price, this.data.coupon.cost) : price
			this.setData({
				totalPrice: price,
				grandTotal: grand,
				totalNum: num
			})
			resolve(price)
		})
	},
	// 打开优惠券
	useCoupon() {
		if (this.data.address) {
			this.setData({
				couponSheet: true
			})
		} else {
			wx.showToast({
				title: '请选择收货地址',
				icon: 'none',
				duration: 2000
			})
		}
	},
	// 选择优惠券
    couponSelected(e) {
		let coupon = e.currentTarget.dataset.item ? e.currentTarget.dataset.item : {id: 0}
		this.setData({
			coupon: coupon
		})
		this.getPrice()
	},
	// 切换地址
	changeAddress() {
		wx.navigateTo({
			url: '/pages/mine/my-address/my-address?fromOrder=1',
			events: {
				acceptDataFromOpenedPage: (data) => {
					this.setData({
						address: data.data
					})
					this.getInfor(data.data.id, this.data.totalPrice)
				}
			}
		})
	},
	inputChange(e) {
		this.setData({
			remark: e.detail.value
		})
	},
	// 结算
	settle() {
		let goods = [], list = this.data.list
		for (let i = 0; i < list.length; i++) {
			goods.push({
				goodsid: list[i].goodsid,
				optionid: list[i].optionid,
				total: list[i].total,
				cartid: list[i].id,
				lens_id: list[i].lens_id
			})
		}
		if (this.data.address) {
			wx.$api.submitOrder({
				addressid: this.data.address.id,
				couponid: this.data.coupon.id ? this.data.coupon.id : 0,
				freight: this.data.postage ? this.data.postage : 0,
				goods_cost: this.data.totalPrice,
				pay_cost: this.data.grandTotal,
				remark: this.data.remark,
				goods: JSON.stringify(goods)
			}).then(res => {
				wx.$api.pay({
					orderid: res.orderid
				}).then(data => {
					wx.requestPayment({
						timeStamp: data.payinfo.timeStamp,
						nonceStr: data.payinfo.nonceStr,
						package: data.payinfo.package,
						signType: data.payinfo.signType,
						paySign: data.payinfo.paySign,
						success: (response) => {
							wx.$api.paymentSuccessCallback({
								orderid: res.orderid
							})
							wx.redirectTo({
								url: '/pages/cart/order/payment-success/payment-success?orderId=' + res.orderid
							})
						},
						fail: (response) => {
							wx.redirectTo({
								url: '/pages/cart/order/payment-failed/payment-failed?orderId=' + res.orderid
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
			}).catch(res => {
				wx.showToast({
					title: res.message,
					icon: 'none',
					duration: 2000
				})
			})
		} else {
			wx.showToast({
				title: '请选择收货地址',
				icon: 'none',
				duration: 2000
			})
		}
	}
})