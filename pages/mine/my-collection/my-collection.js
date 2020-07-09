Page({
    data: {
        collectionList: [],
        isManageModel: false,
        selAll: false
    },
    onShow() {
        this.getCollectionList();
    },
    getCollectionList() {
        wx.$api.myCollection({}, true).then(res => {
            res && res.list && this.setData({
                collectionList: res.list.map(item => {
                    item.sel = false
                    return item
                })
            })
        })
    },
    // 用户点击管理或完成
    onManageClick() {
        this.setData({
            isManageModel: !this.data.isManageModel
        });
    },
    onProdSel(ev) {
        let _index = ev.currentTarget.dataset.index
        let _str = `collectionList[${_index}].sel`
        this.setData({
            [_str]: !this.data.collectionList[_index].sel
        })
        wx.nextTick(() => {
            this.setData({
                selAll: this.data.collectionList.filter(item => {
                    return item.sel
                }).length === this.data.collectionList.length
            })
        })
    },
    onProdClick(ev) {
		wx.navigateTo({
			url: '/pages/goods/goods-detail/goods-detail?id=' + ev.currentTarget.dataset.id
		})
    },
    // 点击全选
    onSelectAll() {
        this.data.collectionList.length && this.setData(this.data.collectionList.reduce((total, item, index) => {
            if(item.sel == this.data.selAll){
                total[`collectionList[${index}].sel`] = !this.data.selAll
            }
            return total
        }, {selAll: !this.data.selAll}))
    },
    onDelCollection() {
        if (this.data.collectionList.filter(item => {
            return item.sel
        }).length === 0) return
        wx.$api.delCollection({
            ids: this.data.collectionList.reduce((total, item) => {
                item.sel && (total += `,${item.id}`)
                return total
            }, '').substr(1)
        }, true).then(res => {
            this.setData({
                collectionList: this.data.collectionList.filter(item => {
                    return !item.sel
                })
            })
            this.onManageClick()
        })
    }
})