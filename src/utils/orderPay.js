import Taro from '@tarojs/taro'
import Request from './request';
import { api } from './api';
//支付环境 type 1--公众号 2--小程序 id--订单ID
let payStatus = null;
const pay = async function (id) {
	if (process.env.TARO_ENV === 'weapp') {
		return new Promise((resolve, reject) => {
			Request.post(api.orderPay, {
				id: id,
				type: 2
			}).then(
				res => {
					const result = res.data
					const payData = result.data.pay_data
					if (result.code == 0) {
						Taro.requestPayment({
							'timeStamp': payData.timeStamp,
							'nonceStr': payData.nonceStr,
							'package': payData.package,
							'signType': 'MD5',
							'paySign': payData.paySign,
							'complete': function (res) {
								if (res.errMsg == 'requestPayment:ok') {
									// Taro.showModal({
									// 	title: '提示',
									// 	content: '支付成功',
									// 	showCancel: false,
									// 	success: function (res) {
									// 		if (res.confirm) {
									// 			// Taro.navigateBack()
									// 		}
									// 	}
									// });
									Taro.showToast({
										title: '支付成功',
										icon: 'none',
										mask: true
									});
									payStatus = 'ok'
									resolve(payStatus)
								}
								else {
									Taro.showToast({
										title: '支付失败',
										icon: 'none',
										mask: true
									});
									payStatus = 'fail'
									resolve(payStatus)
								}
							}
						});
					} else {
						Taro.showToast({
							title: result.msg,
							icon: 'none',
							mask: true
						})
						reject('error')
					}
				}
			)
		})
	} else if (process.env.TARO_ENV === 'h5') {
		var wx = require('m-commonjs-jweixin');
		return new Promise((resolve, reject) => {
			Request.post(api.orderPay, {
				id: id,
				type: 1
			}).then(
				res => {
					const result = res.data
					const pay_data = result.data.pay_data
					if (result.code === 0) {
						wx.chooseWXPay({
							timestamp: pay_data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							nonceStr: pay_data.nonceStr, // 支付签名随机串，不长于 32 位
							package: pay_data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
							signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							paySign: pay_data.paySign, // 支付签名
							success: function (res) {
								if (res.errMsg == "chooseWXPay:ok") {
									//支付成功
									Taro.showModal({
										title: '提示',
										content: '支付成功',
										showCancel: false,
										success: function (res) {
											if (res.confirm) {
												// Taro.navigateBack()
											}
										}
									});
									payStatus = 'ok'
									resolve(payStatus)
								} else {
									Taro.showToast({
										title: '支付失败',
										icon: 'none',
										mask: true
									});
									payStatus = 'fail'
									resolve(payStatus)
								}
							},
							cancel: function (res) {
								//支付取消
								Taro.showToast({
									title: '支付取消',
									icon: 'none',
									mask: true
								});
								payStatus = 'fail'
								resolve(payStatus)
							}
						});
						// WeixinJSBridge.invoke(
						// 	'getBrandWCPayRequest', {
						// 		"appId": pay_data.appId,     //公众号名称，由商户传入     
						// 		"timeStamp": pay_data.timeStamp,         //时间戳，自1970年以来的秒数     
						// 		"nonceStr": pay_data.nonceStr, //随机串     
						// 		"package": pay_data.package,
						// 		"signType": "MD5",         //微信签名方式：     
						// 		"paySign": pay_data.paySign //微信签名 
						// 	},
						// 	function (res) {
						// 		if (res.err_msg == "get_brand_wcpay_request:ok") {
						// 			// 使用以上方式判断前端返回,微信团队郑重提示：
						// 			//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						// 			Taro.showModal({
						// 				title: '提示',
						// 				content: '支付成功',
						// 				showCancel: false,
						// 				success: function (res) {
						// 					if (res.confirm) {
						// 						// Taro.navigateBack()
						// 					}
						// 				}
						// 			});
						// 			payStatus = 'ok'
						// 			resolve(payStatus)
						// 		} else {
						// 			Taro.showToast({
						// 				title: '支付失败',
						// 				icon: 'none',
						// 				mask: true
						// 			});
						// 			payStatus = 'fail'
						// 			resolve(payStatus)
						// 		}
						// 	});
					} else {
						Taro.showToast({
							title: result.msg,
							icon: 'none',
							mask: true
						})
						reject('error')
					}
				}
			)
		})
	}
}
export default pay