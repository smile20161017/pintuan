Page({
	data: {
		classify: [],
		list: [],
		navIndex: 0,
	},
	onShow() {
		this.getData()
	},
	getData() {
		wx.$api.classify().then(res => {
			this.setData({
				classify: res.cate_list,
				list: res.cate_list[this.data.navIndex]
			})
		})
	},
	// 切换选项
	listChange(e) {
		this.setData({
			navIndex: e.currentTarget.dataset.index,
			list: this.data.classify[e.currentTarget.dataset.index]
		})
	},
	onShareAppMessage() {
		return {
			path: '/pages/classify/classify/classify'
		}
	}
})
