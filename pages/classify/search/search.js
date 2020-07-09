Page({
    data: {
		searchValue: '',
		focus: false,
		searchStorage: [],
		realTime: [],
		find: []
    },
	onLoad(options) {
		this.getHistory()
		wx.$api.searchPage().then(res => {
			this.setData({
				realTime: res.search_list,
				find: res.find_list
			})
		})
	},
	// 历史记录
	getHistory() {
		wx.getStorage({
			key: 'searchStorage',
			success: (res) => {
				this.setData({
					searchStorage: JSON.parse(res.data)
				}) 
			},
			fail: (res) => {
				this.setData({
					searchStorage: []
				})
			}
		})
	},
	setHistory() {
		let arr = this.data.searchStorage
		if (!arr.includes(this.data.searchValue)) {
			arr.unshift(this.data.searchValue)
			wx.setStorage({
				key: "searchStorage",
				data: JSON.stringify(arr),
				success: () => {
					this.setData({
						searchStorage: arr
					})
				}
			})
		}
	},
	clearHistory() {
		wx.removeStorage({
			key: 'searchStorage',
			success: () => {
				this.getHistory()
			}
		})
	},
	// 搜索框
	inputFocus() {
		this.setData({
			focus: true
		})
	},
	inputBlur() {
		this.setData({
			focus: false
		})
	},
	inputChange(e) {
		this.setData({
			searchValue: e.detail.value
		})
	},
	clearInput() {
		this.setData({
			searchValue: ''
		})
	},
	// 搜索
    search() {
		if (this.data.searchValue != '') {
			wx.navigateTo({
				url: '/pages/classify/goods-list/goods-list?keywords=' + this.data.searchValue,
				success: () => {
					this.setHistory()
				}
			})
		}
	},
	// 点击历史搜索
	historySearch(e) {
		wx.navigateTo({
			url: '/pages/classify/goods-list/goods-list?keywords=' + e.currentTarget.dataset.item
		})
	}
})