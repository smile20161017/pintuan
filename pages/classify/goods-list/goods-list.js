Page({
    data: {
		list: [],
		page: 1,
		pageCount: 1,
		keywords: '',
		cate: '',
		order: 'displayorder',
		by: 'desc',
		filter: [],
		filterShow: false,
		filterResult: {},
		filterParams: [],
		noMore: false,
		backFlag: true
    },
    onLoad(options) {
		this.setData({
			cate: options.id ? options.id : '',
			keywords: options.keywords ? options.keywords : ''
		})
		this.getListData()
		this.getFilterData()
		let pages = getCurrentPages()
		if (pages.length == 1) {
			this.setData({
				backFlag: false
			})
		}
    },
	// 排序
	sort(e) {
		let by = 'desc'
		if (e.currentTarget.dataset.type == 'marketprice' && this.data.by == 'desc') {
			by = 'asc'
		}
		this.setData({
			order: e.currentTarget.dataset.type,
			by: by,
			list: [],
			page: 1
		})
		this.getListData()
	},
	// 打开筛选窗
	openFilter() {
		this.setData({
			filterShow: true 
		})
	},
	// 关闭筛选窗
	closeFilter() {
		this.setData({
			filterShow: false 
		})
	},
	// 筛选项展开折叠
	filterToggle(e) {
		let filter = this.data.filter
		filter[e.currentTarget.dataset.index].toggle = !filter[e.currentTarget.dataset.index].toggle
		this.setData({
			filter: filter
		})
	},
	// 筛选项选中
	optionChange(e) {
		let checked = e.detail.value,
			index = e.currentTarget.dataset.index,
			filter = this.data.filter,
			result = this.data.filterResult
		for (let i = 0; i < filter[index].children.length; i++) {
			if (checked.indexOf('' + filter[index].children[i].id) != -1) {
				filter[index].children[i].checked = true
			} else {
				filter[index].children[i].checked = false
			}
		}
		result[filter[index].type] = checked
		this.setData({
			filter: filter,
			filterResult: result
		})
	},
	// 重置筛选
	resetOptions() {
		this.getFilterData().then(res => {
			this.getListData()
		})
	},
	// 确认筛选
	confirmOptions() {
		let result = this.data.filterResult,
			params = []
		for (let i in result) {
			if (result[i].length) {
				params.push({
					type: i,
					id: result[i]
				})
			}
		}	
		this.setData({
			list: [],
			page: 1,
			order: 'displayorder',
			by: 'desc',
			filterParams: params
		})
		this.getListData().then(() => {
			this.setData({
				filterShow: false 
			})
		})
	},
	// 加载更多
	loadMore() {
		if (this.data.page < this.data.pageCount) {
			let page = this.data.page
			page ++
			this.setData({
				page: page
			})
			this.getListData()
		}
	},
	// 获取列表
	getListData() {
		return new Promise((resolve, reject) => {
			let list = this.data.list
			wx.$api.goodsList({
				page: this.data.page,
				keywords: this.data.keywords,
				cate: this.data.cate,
				order: this.data.order,
				by: this.data.by,
				params: JSON.stringify(this.data.filterParams)
			}).then(res => {
				list = list.concat(res.list)
				if (res.count_page == this.data.page || !res.count_page) {
					this.setData({
						noMore: true
					})
				}
				this.setData({
					list: list,
					pageCount: res.count_page
				})
				resolve(res)
			})
		})
	},
	// 获取筛选项
	getFilterData() {
		return new Promise((resolve, reject) => {
			wx.$api.filter().then(res => {
				let result = {}
				for (let i = 0; i < res.screen_list.length; i++) {
					res.screen_list[i].toggle = true
					result[res.screen_list[i].type] = []
					for (let j = 0; j < res.screen_list[i].children.length; j++) {
						res.screen_list[i].children[j].checked = false
					}
				}
				this.setData({
					filter: res.screen_list,
					filterResult: result,
					filterParams: []
				})
				resolve(res)
			})
		})
	},
	// 去首页
	goHome() {
		wx.reLaunch({
			url: '/pages/index/index'
		})
	},
	onShareAppMessage() {
		return {
			path: '/pages/classify/goods-list/goods-list?id=' + this.data.cate
		}
	}
})