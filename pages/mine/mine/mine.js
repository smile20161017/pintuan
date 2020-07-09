const app = getApp()

Page({
	data: {
		infor: null
	},
	onShow() {
		wx.$api.mine().then(res => {
			this.setData({
				infor: res
			})
		}).catch(res => {})
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
	}
})
