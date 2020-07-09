Page({
    data: {
		orderId: '',
		orderInfo: {},
		reviewsImgLenMax: 6
    },
    onLoad(options) {
		const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptOrderInfo', data => {
            this.setData({
				orderId: data.id,
				orderInfo: data.comments.map(item => {
					item.files = []
					item.content = ""
					return item
				})
            })
        })
	},
	onReviewsInput(ev) {
		let index = ev.currentTarget.dataset.index
		let obj = {}
		obj[`orderInfo[${index}].content`] = ev.detail.value
		this.setData(obj)
	},
	onAddImg(ev) {
		let goodsIndex = ev.currentTarget.dataset.goodsIndex
		let localImg = this.data.orderInfo[goodsIndex].files
		if (localImg.length === this.data.reviewsImgLenMax) return 
		wx.chooseImage({
		    success: res => {
				let tempFilePaths = res.tempFilePaths
				if ((localImg.length + tempFilePaths.length) > this.data.reviewsImgLenMax) {
					wx.showToast({title: "图片数量超过上限"})
					return
				}
				let obj = {}
				obj[`orderInfo[${goodsIndex}].files`] = localImg.concat(tempFilePaths)
		        this.setData(obj)
		    }
		})	
	},
	onDelImg(ev) {
		let goodsIndex = ev.currentTarget.dataset.goodsIndex
		let localImg = this.data.orderInfo[goodsIndex].files
		localImg.splice(ev.currentTarget.dataset.imgIndex, 1)
		let obj = {}
		obj[`orderInfo[${goodsIndex}].files`] = localImg
		this.setData(obj)
	},
	onSubmit() {
		Promise.all(this.data.orderInfo.map(item => {
			return wx.$api.uploadFile(item.files)
		})).then(res => {
			return wx.$api.submitReviews({
				orderid: this.data.orderId,
				comments: JSON.stringify(this.data.orderInfo.map((item, index) => {
					return {
						level: 5,
						goodsid: item.id,
						images: res[index],
						content: item.content
					}
				}))
			}, true)
		}).then(res => {
			wx.showToast({title: "评论成功"})
			wx.navigateBack()
		})
	}
})