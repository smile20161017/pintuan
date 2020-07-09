Page({
    data: {
        info: {},
        lensTypeList: {
            Myopia: "近视",
            Hyperopia: "远视",
            Progressive: "渐进",
        },
    },
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', data => {
            this.setData({
                info: data.prescriptionInfo
            })
        })
    }
})