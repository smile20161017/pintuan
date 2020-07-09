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
		list: [],
		// 总价
		totalPrice: 0,
		// 全选状态
		selectedNum: 0,
		selectAllStatus: false, 
		// 编辑
		editFlag: false,
		// 侧滑按钮
		slideButtons: [{
			text: '移入收藏夹',
			src: '/page/weui/cell/icon_love.svg',
		}, {
			type: 'warn',
			text: '删除',
			extClass: 'test',
			src: '/page/weui/cell/icon_del.svg',
		}],
		noData: false,
		loginShow: false
	},
	onShow() {
		if (!wx.getStorageSync('ruufooOpenId') || !wx.getStorageSync('ruufooChecked')) {
			this.setData({
				loginShow: true
			})
			return
		}
		this.getData()
	},
	// 侧滑button
	slideButtonTap(e) {
		if (e.detail.index == 1) {
			this.del(e)
		} else {
			this.collect(e)
		}
	},
	// 编辑购物车
	edit() {
		this.setData({
			editFlag: !this.data.editFlag
		})
	},
	// 删除
	del(e) {
		this.delFn(e.currentTarget.dataset.id)
	},
	// 批量删除
	batchDel() {
		let id = this.data.list.reduce((total, item) => {
			item.selected && (total += `,${item.id}`)
			return total
		}, '')
		if (id == '') {
			wx.showToast({
				title: '您还没有选择宝贝哦',
				icon: 'none',
				duration: 2000
			})
			return
		}
		this.delFn(id.substr(1))
	},
	delFn(id) {
		wx.showModal({
			title: '提示',
			content: '确认删除吗',
			success: response => {
				if (response.confirm) {
					wx.$api.deleteCart({
						ids: id
					}).then(res => {
						this.getData()
					})
				}
			}
		})
	},
	// 移至收藏夹
	collect(e) {
		this.collectFn(e.currentTarget.dataset.id)
	},
	// 批量收藏
	batchCollect() {
		let id = this.data.list.reduce((total, item) => {
			item.selected && (total += `,${item.id}`)
			return total
		}, '')
		if (id == '') {
			wx.showToast({
				title: '您还没有选择宝贝哦',
				icon: 'none',
				duration: 2000
			})
			return
		}
		this.collectFn(id.substr(1))
	},
	collectFn(id) {
		wx.$api.moveToWishList({
			ids: id
		}).then(res => {
			this.getData()
		})
	},
	// 数量+
	add(e) {
		let index = e.currentTarget.dataset.index,
			list = this.data.list,
			num = list[index].total
		num = num + 1
		list[index].total = num
		this.setData({
			list: list
		})
		this.qtyChange(list[index].id, num)
	},
	// 数量-
	minus(e) {
		let index = e.currentTarget.dataset.index,
			list = this.data.list,
			num = list[index].total
		if (num <= 1) {
			return false
		}
		num = num - 1
		list[index].total = num
		this.setData({
			list: list
		})
		this.qtyChange(list[index].id, num)
	},
	// 商品数量改变
	qtyChange(id, num) {
		this.priceCount()
		wx.$api.updateCart({
			item_id: id,
			total: num
		}).then(res => {
			if (res.error) {
				wx.showToast({
					title: res.message,					icon: 'none',					duration: 2000				})				this.getData()
			}
		})
	},
	// 选择商品
	itemSelected(e) {
		let index = e.currentTarget.dataset.index,
			list = this.data.list,
			selectAllStatus = true,
			selectedNum = 0
		list[index].selected = !list[index].selected
		list.map((item) => {
			item.selected ? (selectedNum ++) : (selectAllStatus = false)
			return item
		})
		this.setData({
			list: list,
			selectedNum: selectedNum,
			selectAllStatus: selectAllStatus
		})
		this.priceCount()
	},
	// 全选
	selectAll(e) {
		let selectAllStatus = !this.data.selectAllStatus,
			list = this.data.list,
			selectedNum = 0
		list.map((item) => {
			item.status && (item.selected = selectAllStatus)
			item.selected && (selectedNum ++)
			return item
		})
		this.setData({
			list: list,
			selectedNum: selectedNum,
			selectAllStatus: selectAllStatus
		})
		this.priceCount()
	},
	// 总价
	priceCount() {
		let list = this.data.list,
			total = list.reduce((total, item) => {
				item.selected && (total = add(total, accMul(item.total, item.price)))
				return total
			}, 0)
		this.setData({
			totalPrice: total.toFixed(2)
		})
	},
	// 去结算
	settle() {
		let submitData = this.data.list.filter((item) => item.selected)
		if (submitData.length) {
			app.globalData.orderData = submitData
			wx.navigateTo({
				url: '/pages/cart/order/confirm-order/confirm-order'
			})
		} else {
			wx.showToast({
				title: '您还没有选择宝贝哦',
				icon: 'none',
				duration: 2000
			})
		}
	},
	// 去逛逛
	go() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	getData() {
		wx.$api.cartInfor().then(res => {
			res.list.map((item) => item.selected = false)
			this.setData({
				list: res.list,
				noData: res.list.length ? false : true,
				selectedNum: 0,
				selectAllStatus: false
			})
			this.priceCount()
		}).catch((res) => {})
	},
	bindGetUserInfo(e) {
		let pages = getCurrentPages()
		let currPage = null
		if (pages.length) {
		  currPage = pages[pages.length - 1]
		}
		app.globalData.tempRoute = currPage.route
		if (e.detail.userInfo) {
			app.globalData.userInfo = e.detail.userInfo
			wx.navigateTo({
				url: '/pages/guide/guide/guide'
			})
		}
	},
	later() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	}
})
