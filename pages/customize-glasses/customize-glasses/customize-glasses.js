// 处方值选项
function presOptions(min, max, interval) {
	let options = []
	if (interval == '1') {
		for (let i = min; i <= max; i += 1) {
			options.push({ label: '' + i, value: '' + i })
		}
	} else {
		let num = parseFloat(interval)
		for (let i = min; i <= max; i += num) {
			i > 0 ? options.push({ label: '+' + i.toFixed(2), value: '' + i.toFixed(2) }) : options.push({ label: '' + i.toFixed(2), value: '' + i.toFixed(2) })
		}
	}
	return options
}
// 处方默认值
function defaultVal(arr, zero) {
	if (zero) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].value == '0' || arr[i].value == '0.00') {
				return {
					index: i,
					value: arr[i].value
				}
			} 
		}
	} else {
		return {
			index: -1,
			value: ''
		}
	}
}
// 设置处方值
function changeVal(arr, val) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].value == val) {
			return {
				index: i,
				value: arr[i].value
			}
		} 
	}
}

Page({
    data: {
		// 处方类型
		presType: [{
			value: 'Myopia',
			name: '近视'
		}, {
			value: 'Hyperopia',
			name: '远视'
		}, {
			value: 'Progressive',
			name: '渐进'
		}],
		// 选项
		sphOptions: [],
		cylOptions: [],
		axisOptions: [],
		addOptions: [],
		pdOptions: [],
		doublePdOptions: [],
		// 处方值
		presVal: {
			odSph: {index: 0, value: ''},
			odCyl: {index: 0, value: ''},
			odAxis: {index: 0, value: ''},
			odAdd: {index: 0, value: ''},
			osSph: {index: 0, value: ''},
			osCyl: {index: 0, value: ''},
			osAxis: {index: 0, value: ''},
			osAdd: {index: 0, value: ''},
			pd: {index: 0, value: ''},
			pdL: {index: 0, value: ''},
			pdR: {index: 0, value: ''},
		},
		prescriptionType: 'Myopia',
		prescriptionName: '',
		pdCheck: false,
		showActionsheet: false,
		editFlag: false,
		id: 0
    },
	onLoad(options) {
		// 设置选项值
		this.setData({
			sphOptions: presOptions(-20, 0, '0.25'),
			cylOptions: presOptions(-6, 0, '0.25'),
			axisOptions: presOptions(0, 180, '1'),
			addOptions: presOptions(0.75, 3.5, '0.25'),
			pdOptions: presOptions(54, 78, '1'),
			doublePdOptions: presOptions(25, 40, '0.5')
		})
		if (options.edit == '1') {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('edit', (data) => {
				// 设置处方值
				this.setVal(data.data)
				this.setData({
					editFlag: true,
					id: data.data.id
				})
			})
		} else {
			// 设置默认值
			this.initVal()
		}
	},
	// 初始化处方值
	initVal() {
		this.setData({
			presVal: {
				odSph: defaultVal(this.data.sphOptions, true),
				odCyl: defaultVal(this.data.cylOptions, true),
				odAxis: defaultVal(this.data.axisOptions),
				odAdd: defaultVal(this.data.addOptions),
				osSph: defaultVal(this.data.sphOptions, true),
				osCyl: defaultVal(this.data.cylOptions, true),
				osAxis: defaultVal(this.data.axisOptions),
				pd: defaultVal(this.data.pdOptions),
				pdL: defaultVal(this.data.doublePdOptions),
				pdR: defaultVal(this.data.doublePdOptions)
			}
		})
	},
	// 处方值填充
	setVal(obj) {
		this.presTypeOp(obj.type)
		setTimeout(() => {
			this.setData({
				presVal: {
					odSph: obj.od_sph && obj.od_sph != '0.00' ? changeVal(this.data.sphOptions, obj.od_sph) : defaultVal(this.data.sphOptions, true),
					odCyl: obj.od_cyl && obj.od_cyl != '0.00' ? changeVal(this.data.cylOptions, obj.od_cyl) : defaultVal(this.data.cylOptions, true),
					odAxis: obj.od_axis ? changeVal(this.data.axisOptions, obj.od_axis) : defaultVal(this.data.axisOptions),
					odAdd: obj.od_add ? changeVal(this.data.addOptions, obj.od_add) : defaultVal(this.data.addOptions),
					osSph: obj.os_sph && obj.os_sph != '0.00' ? changeVal(this.data.sphOptions, obj.os_sph) : defaultVal(this.data.sphOptions, true),
					osCyl: obj.os_cyl && obj.os_cyl != '0.00' ? changeVal(this.data.cylOptions, obj.os_cyl) : defaultVal(this.data.cylOptions, true),
					osAxis: obj.os_axis ? changeVal(this.data.axisOptions, obj.os_axis) : defaultVal(this.data.axisOptions),
					pd: obj.pd ? changeVal(this.data.pdOptions, obj.pd) : defaultVal(this.data.pdOptions),
					pdL: obj.pd_l ? changeVal(this.data.doublePdOptions, obj.pd_l) : defaultVal(this.data.doublePdOptions),
					pdR: obj.pd_r ? changeVal(this.data.doublePdOptions, obj.pd_r) : defaultVal(this.data.doublePdOptions)
				},
				pdCheck: obj.pdcheck == 'on' ? true : false,
				prescriptionName: obj.name
			})
		}, 0)
	},
	// 处方类型切换
	presTypeChange(e) {
		this.presTypeOp(e.currentTarget.dataset.value)
	},
	// 处方类型判断
	presTypeOp(type) {
		this.setData({
			prescriptionType: type
		})
		if (type == 'Myopia') {
			this.setData({
				sphOptions: presOptions(-20, 0, '0.25'),
				cylOptions: presOptions(-6, 0, '0.25'),
				['presVal.odAdd']: {
					index: -1,
					value: ''
				}
			})
		} else if (type == 'Hyperopia') {
			this.setData({
				sphOptions: presOptions(0, 12, '0.25'),
				cylOptions: presOptions(0, 6, '0.25'),
				['presVal.odAdd']: {
					index: -1,
					value: ''
				}
			})
		} else {
			this.setData({
				sphOptions: presOptions(-20, 12, '0.25'),
				cylOptions: presOptions(-6, 6, '0.25')
			})
		}
		this.setData({
			['presVal.odSph']: defaultVal(this.data.sphOptions, true),
			['presVal.osSph']: defaultVal(this.data.sphOptions, true),
			['presVal.odCyl']: defaultVal(this.data.cylOptions, true),
			['presVal.osCyl']: defaultVal(this.data.cylOptions, true)
		})
	},
	// 参数选择
	pickerSelect(e) {
		let key = `presVal.${e.currentTarget.dataset.type}`
		this.setData({
			[key]: {
				index: e.detail.value,
				value: this.data[e.currentTarget.dataset.option][e.detail.value].value
			}
		})
		// cyl判断
		if (this.data.presVal.odCyl.value == '0.00') {
			this.setData({
				['presVal.odAxis']: {
					index: -1,
					value: ''
				}
			})
		}
		if (this.data.presVal.osCyl.value == '0.00') {
			this.setData({
				['presVal.osAxis']: {
					index: -1,
					value: ''
				}
			})
		}
	},
	// 双pd
	doublePd(e) {
		this.setData({
			pdCheck: e.detail.value.length ? true : false,
			['presVal.pd']: defaultVal(this.data.pdOptions),
			['presVal.pdL']: defaultVal(this.data.doublePdOptions),
			['presVal.pdR']: defaultVal(this.data.doublePdOptions)
		})
	},
	openQuestion() {
		this.setData({
			showActionsheet: true
		})
	},
	inputChange(e) {
		this.setData({
			prescriptionName: e.detail.value
		})
	},
	confirm() {
		// PD判断
		if (this.data.pdCheck) {
			let pdPlus = Number((+this.data.presVal.pdL.value) + (+this.data.presVal.pdR.value))
			if (pdPlus < 54) {
				this.warningMsg('瞳距（PD）数值过小，请检查您的瞳距（PD）数值是否正确。')
				return
			} else if (pdPlus > 78) {
				this.warningMsg('瞳距（PD）数值过大，请检查您的瞳距（PD）数值是否正确。')
				return
			} else if (pdPlus == 0) {
				this.warningMsg('瞳距（PD）数值不能为空，请填写瞳距（PD）数值。如您不知道瞳距（PD）数值，请联系客服。')
				return
			}
		} else {
			if (this.data.presVal.pd.value == '') {
				this.warningMsg('瞳距（PD）数值不能为空，请填写瞳距（PD）数值。如您不知道瞳距（PD）数值，请联系客服。')
				return
			}
		}
		// Axis判断
		if (this.data.presVal.odCyl.value != '0.00' && this.data.presVal.odAxis.value == '') {
			this.warningMsg('请选择右眼-散光轴位，散光与散光轴位需都有数值，或者同时为0。')
			return
		} else if (this.data.presVal.osCyl.value != '0.00' && this.data.presVal.osAxis.value == '') {
			this.warningMsg('请选择左眼-散光轴位，散光与散光轴位需都有数值，或者同时为0。')
			return
		}
		// add判断
		if (this.data.prescriptionType == 'Progressive') {
			if (this.data.presVal.odAdd.value == '') {
				this.warningMsg('请选择下加光（ADD）数值。如您不知道下加光（ADD）数值，请联系客服。')
				return
			}
		}
		// 验光单名称判断
		if (this.data.prescriptionName == '') {
			this.warningMsg('请为验光单命名，保存后可重复使用。')
			return
		}
		let params = {
			name: this.data.prescriptionName,
			type: this.data.prescriptionType,
			od_sph: this.data.presVal.odSph.value,
			od_cyl:	this.data.presVal.odCyl.value,
			od_axis: this.data.presVal.odAxis.value,
			od_add: this.data.presVal.odAdd.value,
			os_sph: this.data.presVal.osSph.value,
			os_cyl: this.data.presVal.osCyl.value,
			os_axis: this.data.presVal.osAxis.value,
			pd_r: this.data.presVal.pdR.value,
			pd_l: this.data.presVal.pdL.value,
			pd: this.data.presVal.pd.value,
			pdcheck: this.data.pdCheck ? 'on' : ''
		}
		if (this.data.editFlag) {
			params = Object.assign(params, {
				id: this.data.id
			})
			wx.$api.updateRx(params).then(res => {
				if (!res.error) {
					wx.showToast({
						title: '保存成功',
						duration: 2000
					})
					setTimeout(() => {
						wx.navigateBack()
					}, 1000)
				}
			})
			
		} else {
			wx.$api.addRx(params).then(res => {
				if (!res.error) {
					wx.showToast({
						title: '保存成功',
						duration: 2000
					})
					setTimeout(() => {
						wx.navigateBack()
					}, 2000)
				}
			})
		}
	},
	warningMsg(msg) {
		wx.showToast({
			title: msg,
			icon: 'none',
			duration: 2000
		})
	}
})