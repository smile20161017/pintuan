Page({
	data: {
		home: {},
		triggered: true
	},
	onLoad() {
		this.getData()
	},
	search() {
		wx.navigateTo({
			url: '/pages/classify/search/search'
		})
	},
	go(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.link
		})
	},
	getData() {
		return new Promise((resolve) => {
			wx.$api.homePage().then(res => {
				this.setData({
					home: res
				})
				resolve()
			})
		})
	},
	refresh() {
		this.getData().then(() => {
			this.setData({
				triggered: false
			})
		})
	},
	onShareAppMessage() {
		return {
			path: '/pages/index/index'
		}
	}
})
