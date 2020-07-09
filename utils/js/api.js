import { request, uploadFile } from 'http.js'

function mergeParam(data) {
	return Object.assign(data || {}, {
		openid: wx.getStorageSync('ruufooOpenId')
	})
}

const api = {
	// 首页
	homePage(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=shop.get_new_index&comefrom=wxapp', data, true)
	},
	// 分类页
	classify(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=shop.get_new_category&comefrom=wxapp', data)
	},
	getOpenId(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.verification&comefrom=wxapp', data, true)
	},
	// 发送验证码
	sendCode(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.send_sms&comefrom=wxapp', data, true)
	},
	// 登录
	login(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.login&comefrom=wxapp', data, true)
	},
	// 快捷登录
	quickLogin(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.fast_login&comefrom=wxapp', data, true)
	},
	// 搜索页热词
	searchPage(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.get_search&comefrom=wxapp', data)
	},
	// 商品列表
	goodsList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.get_new_list&comefrom=wxapp', data, true)
	},
	// 商品筛选项
	filter(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.get_screen&comefrom=wxapp', data)
	},
	// 商品详情
	goodsDetail(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.get_new_detail&comefrom=wxapp', mergeParam(data), true)
	},
	// 领取优惠券
	getCoupon(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.receive_coupon&comefrom=wxapp', mergeParam(data), true)
	},
	// 收藏
	collect(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.collection&comefrom=wxapp', mergeParam(data), true)
	},
	// 评论列表
	reviewList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.get_new_comments&comefrom=wxapp', data, true)
	},
	// 加购
	addToCart(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.new_add&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 购物车列表
	cartInfor(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.get_new_cart&comefrom=wxapp', mergeParam(data), true)
	},
	// 更新购物车
	updateCart(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.new_update&comefrom=wxapp', mergeParam(data))
	},
	// 删除购物车条目
	deleteCart(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.new_remove&comefrom=wxapp', mergeParam(data), true)
	},
	// 个人中心首页
	mine(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.account&comefrom=wxapp', mergeParam(data))
	},
	// 获取个人信息
	getUserInfo(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.info.new_main&comefrom=wxapp', mergeParam(data), true)
	},
	// 编辑个人信息
	editUserInfo(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.info.new_submit&comefrom=wxapp', mergeParam(data), true)
	},
	// 验光单列表
	rxList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_list&comefrom=wxapp', mergeParam(data), true)
	},
	// 新增验光单
	addRx(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_add&comefrom=wxapp', mergeParam(data), true)
	},
	// 更新验光单
	updateRx(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_update&comefrom=wxapp', mergeParam(data), true)
	},
	// 删除验光单
	deleteRx(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_remove&comefrom=wxapp', mergeParam(data), true)
	},
	// 收藏列表
	myCollection(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.favorite.get_new_list&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 删除收藏
	delCollection(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.favorite.new_remove&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 移入收藏夹
	moveToWishList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.collection&comefrom=wxapp', mergeParam(data), true)
	},
	// 确认订单页面
	confirmOrder(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.create.new_caculate&comefrom=wxapp', mergeParam(data))
	},	
	// 提交订单
	submitOrder(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.create.new_submit&comefrom=wxapp', mergeParam(data), false, showError)
	},
	// 发起支付
	pay(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.pay.transfer&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 支付成功回调
	paymentSuccessCallback(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.pay.new_complete&comefrom=wxapp', mergeParam(data))
	},
	// 获取地址列表
	getAddressList(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.address.get_list&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 获取地址信息
	getAddress(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.address.get_detail&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 新增或编辑地址
	updateAddress(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.address.submit&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 删除地址
	delAddress(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.address.remove&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 我的优惠券
	myCoupon(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=sale.coupon.my.get_new_list&comefrom=wxapp', mergeParam(data, true), true)
	},
	// 获取订单列表
	getOrderList(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.index.get_new_list&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 获取订单详情
	getOrderInfo(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.index.new_detail&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 订单状态-确认收货
	orderConfirm(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.op.new_finish&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 订单状态-取消订单
	orderCancel(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.op.new_cancel&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 获取物流信息
	getExpressInfo(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.index.new_express&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 提交评论
	submitReviews(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.comment.new_submit&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 上传文件
	uploadFile(filePath) {
		return uploadFile('/app/ewei_shopv2_api.php?i=1&r=util.uploader.new_upload&comefrom=wxapp', filePath)
	}
}

export default api