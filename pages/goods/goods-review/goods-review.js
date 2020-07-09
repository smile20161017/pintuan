Page({
	data: {
		image: 0,
		reviews: [],
		page: 1,
		noMore: false,
		id: '',
		pageCount: 0
	},
	onLoad(options) {
		this.setData({
			id: options.id
		})
		this.getReviewData()
	},
	imgShow(e) {
		wx.previewImage({
			current: e.currentTarget.dataset.src,
			urls: e.currentTarget.dataset.list
		})
	},
	getAll() {
		this.setData({
			image: 0,
			reviews: []
		})
		this.getReviewData()
	},
	getImg() {
		this.setData({
			image: 1,
			reviews: []
		})
		this.getReviewData()
	},
	// 加载更多
	loadMore() {
		if (this.data.page < this.data.pageCount) {
			let page = this.data.page
			page ++
			this.setData({
				page: page
			})
			this.getReviewData()
		}
	},
	getReviewData() {
		let reviews = this.data.reviews
		wx.$api.reviewList({
			id: this.data.id,
			page: this.data.page,
			image: this.data.image
		}).then(res => {
			reviews = reviews.concat(res.list)
			if (res.count_page == this.data.page || !res.count_page) {
				this.setData({
					noMore: true
				})
			}
			this.setData({
				reviews: reviews,
				pageCount: res.count_page
			})
		})
	}
})
