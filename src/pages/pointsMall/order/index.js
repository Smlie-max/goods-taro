import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'

import './index.less'
import GoodsItem from '../component/goodsItem';
import arrow from '../images/sanjiaoxing.png'
import { connect } from '@tarojs/redux'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Menu from '../../../components/menu';

class Order extends Component {
	config = {
		navigationBarTitleText: '提交订单'
	}

	constructor() {
		super(...arguments)
		this.state = {
			info: {},
			detailId: 0,
			total: 0.00
		}
	}

	componentWillMount() {
		this.setState({
			detailId: this.$router.params.id
		})
	}

	componentDidMount() {
		this.getOrderPreview()
	}

	getOrderPreview() {
		const that = this;
		let id = this.state.detailId;
		let addressid = '';
		if (parseInt(this.props.myChoice.address_id, 10) > 0) {
			addressid = this.props.myChoice.address_id
		}
		// 请求参数,客户参数
		Request.post(api.creditCreat, {
			id: id,
			num: 1,
			addressid: addressid
		}).then(
			res => {
				const info = res.data.data;
				that.setState({
					info: info
				})

				let total = parseFloat(info.money) + parseFloat(info.dispatch)
				total = total.toFixed(2);
				that.setState({
					total: total
				})
			}
		)
	}

	// 去选择地址
	goToSelect() {
		Taro.navigateTo({
			url: '/pages/address/index?status=order'
		})
	}

	// 跳转到结果页面
	jumpToRes() {
		Taro.navigateTo({
			url: '/pages/pointsMall/orderIntegral/index'
		})
	}

	goToPay() {
		const that = this;
		if (!this.state.info.address && myChoice.address_id.length <= 0) {
			// 如果没有选地址\
			Taro.showToast({
				title: '请选择地址',
				icon: 'none'
			});
			return
		} else {
			let addressid = ''
			if (parseInt(this.props.myChoice.address_id, 10) > 0) {
				addressid = this.props.myChoice.address_id
			} else {
				addressid = this.state.info.address.id;
			}
			if (process.env.TARO_ENV === 'weapp') {
				let id = this.state.detailId;
				return new Promise((resolve, reject) => {
					Request.post(api.creditShopDetailPay, {
						id: id,
						num: 1,
						pay_type: 1,
						type: 2,
						addressid: addressid
					}).then(
						res => {
							const result = res.data;
							const payData = result.data.pay_data;
							that.setState({
								logid: result.data.logid
							})
							if (result.code === 0) {
								if (payData) {
									Taro.requestPayment({
										'timeStamp': payData.timeStamp,
										'nonceStr': payData.nonceStr,
										'package': payData.package,
										'signType': 'MD5',
										'paySign': payData.paySign,
										'complete': function (res) {
											if (res.errMsg == 'requestPayment:ok') {
												Taro.showModal({
													title: '提示',
													content: '兑换成功,准备跳转到订单列表',
													showCancel: false,
													success: function (res) {
														if (res.confirm) {
															that.jumpToRes()
														}
													}
												});
												payStatus = 'ok'
												resolve(payStatus)
											}
											else {
												Taro.showToast({
													title: '支付失败',
													icon: 'none'
												});
											}
										}
									});
								} else {
									Taro.showModal({
										title: '提示',
										content: '兑换成功,准备跳转到订单列表',
										showCancel: false,
										success: function (res) {
											if (res.confirm) {
												that.jumpToRes()
											}
										}
									});
								}
							}
							else {
								Taro.showToast({
									title: result.msg,
									icon: 'none'
								})
							}

						}
					)
				})
			} else if (process.env.TARO_ENV === 'h5') {
				console.log('h5支付')
			}
		}

	}

	render() {
		const { info } = this.state;
		const { myChoice } = this.props
		return <View className='order'>
			<Menu></Menu>
			<View className='header-contant' onClick={this.goToSelect.bind(this)}>
				<View className='header-left'>
					<View className='name-contant'>
						<View>
							{!info.address && myChoice.realname.length <= 0 ? '请选择' : ''}
							{myChoice.realname.length > 0 ? myChoice.realname : ''}
							{info.address && myChoice.realname.length <= 0 ? info.address.realname : ''}
						</View>
						<View>
							{!info.address && myChoice.realname.length <= 0 ? '请选择' : ''}
							{myChoice.mobile.length > 0 ? myChoice.mobile : ''}
							{info.address && myChoice.mobile.length <= 0 ? info.address.mobile : ''}
						</View>
					</View>
					<View className='address-contant' >
						{!info.address && myChoice.realname.length <= 0 ? '请选择' : ''}
						{myChoice.address.length > 0 ? myChoice.address : ''}
						{info.address && myChoice.address.length <= 0 ? info.address.address : ''}
					</View>
				</View>
				<View className='header-right'>
					<Image src={arrow} className='img' mode='widthFix'></Image>
				</View>
			</View>
			<View className='goods-menu'>
				<View className='menu-header-contant'>
					<Image src={info.logo} className='img' mode='widthFix'></Image>
					<View className="title">积分商城兑换</View>
					<Image src={arrow} className='icon-img' mode='widthFix'></Image>
				</View>
				<View className='goods-menu-contant'>
					<GoodsItem imgSrc={info.thumb} title={info.title} money={info.money} credit={info.credit} num={info.num}></GoodsItem>
				</View>
				<View className='line'></View>
				<View className='total-contant'>
					<View className='title'>商品小计</View>
					<View className='tips'>合计</View>
					<View className='price'>￥{info.money}</View>
				</View>
				<View className='freigth-contant'>
					<View className='tips'>运费</View>
					<View className='price'>￥{info.dispatch}</View>
				</View>
			</View>
			<View className='distribution'>
				<View className='tips'>配送</View>
				<View className='value'>快递配送</View>
			</View>
			<View className='pay-contant'>
				<View className='tips'>实付款</View>
				<View className='money-contant'>
					<View className='price'>￥{total}</View>
					<View className='point'>{info.credit} 积分</View>
				</View>
				<View className='pay' onClick={this.goToPay.bind(this)}>立即付款</View>
			</View>
		</View>
	}
}

const mapStateToProps = (state) => {
	return {
		myChoice: state.address.myChoice
	}
}

export default connect(mapStateToProps)(Order)