Page({
    data: {
		list: [],
    },
    onLoad(options) {
		
    },
	onShow() {
		this.getData()
	},
	del(e) {
		wx.showModal({
			title: '提示',
			content: '确认删除吗',
			success: response => {
				if (response.confirm) {
					wx.$api.deleteRx({
						id: e.currentTarget.dataset.id
					}).then(res => {
						this.getData()
					})
				}
			}
		})
	},
	edit(e) {
		wx.navigateTo({
			url: '/pages/customize-glasses/customize-glasses/customize-glasses?edit=1',
			success: (res) => {
				res.eventChannel.emit('edit', { data: e.currentTarget.dataset.item })
			}
		})
	},
	getData() {
		wx.$api.rxList().then(res => {
			this.setData({
				list: res.list
			})
		})
	}
})