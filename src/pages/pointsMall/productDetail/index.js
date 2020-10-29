import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'

import './index.less'
import Navbar from './../../../components/navbar/index';
import OptionLayout from '../../../components/optionLayout';
import product from '../images/product.png'
import Loading from '../../../components/loading';
import orderPay from './orderPay';

import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import ParseComponent from './../../../components/wxParse/index';
import Menu from './../../../components/menu/index';

class ProductDetail extends Component {
	config = {
		navigationBarTitleText: '积分商城',
		navigationBarBackgroundColor: '#253C6D',
		navigationBarTextStyle: 'white',
	}

	constructor() {
		super(...arguments)
		this.state = {
			detailId: '',
			info: {},
			goodstype: 0, //商品类型 0--商品 1--优惠券
			showLayout: false,
			goodsSpecs: [],//规格数组
			goodsOptions: [],//后台返回的所有可选的规格的组合（数组）
			stock: '0', //库存
			optionReady: false,
			count: 1, //数量
			optionid: '', //选择的规格id
			stock: '0', //库存
			loadingShow: true,
		}
	}

	componentWillMount() {
		const that = this;
		that.setState({
			detailId: this.$router.params.id
		})
	}

	componentDidMount(){
		this.getGoodsDetail()
	}
	
	// 获取商品详情
	getGoodsDetail() {
		Request.post(api.creditShopDetail, {
			id: this.$router.params.id
		}).then(
			res => {
				this.setState({
					loadingShow: false
				})
				if (res.data.code == 0) {
					const info = res.data.data;
					this.setState({
						info: info
					})
					this.getGoodsOption()
				} else {
					Taro.showToast({
						title: res.data.msg,
						icon: 'none',
						mask: true
					})
				}
			}
		)
	}
	// 获取商品规格
	getGoodsOption() {
		Request.post(api.creditGoodsOption, {
			id: this.$router.params.id
		}).then(
			res => {
				this.setState({
					loadingShow: false
				})
				const result = res.data
				if (result.code === 0) {
					if (result.data.specs) {
						this.setState({
							stock: this.state.info.total,
							goodsOptions: result.data.options,
							goodsSpecs: result.data.specs,
							optionReady: true
						})
					} else {
						this.setState({
							stock: this.state.info.total,
							finlPrice: this.state.info.marketprice,
							optionReady: true
						})
					} 
				}
			}
		)
	}
	//关闭选择规格弹窗
	closeLayout() {
		this.setState({
			showLayout: false
		})
	}
	onShowLayout() {
		if (this.state.info.canbuy == 0) {
			return
		}
		this.setState({
			showLayout: true
		})
	}
	//更新选择规格信息
	updateSelect(selectedOption) {
		this.setState({
			optionid: selectedOption.optionid,
			count: selectedOption.count,
			stock: selectedOption.stock
		})
	}
	//购买
	addCart() {
		let { optionid, goodsSpecs, count, info, detailId } = this.state
		let stock = null
		if (goodsSpecs.length !== 0) {
			stock = this.state.stock
			if (optionid === '') {
				Taro.showToast({
					title: '请选择规格！',
					icon: 'none'
				})
				return
			}
		} else {
			stock = info.total
		}
		if (Number(count) > Number(stock)) {
			Taro.showToast({
				title: '库存不足！',
				icon: 'none',
				mask: true
			})
			return
		}
		/*
		* goodstype:商品类型 0--商品 1--优惠券
		*/
		if (info.goodstype == 0) {
			//查询
			Request.post(api.orderSubmit, {
				cgid: detailId,
				total: count,
				optionid: optionid,
				is_creditshop: 1,//是否积分商城订单 0--否 1--是
				is_order: 0
			}).then(
				res => {
					const result = res.data
					if (result.code === 0) {
						Taro.navigateTo({
							url: `/pages/pointsMall/orderPreview/index?cgid=${detailId}&optionid=${optionid}&num=${count}`
						})
					} else {
						Taro.showToast({
							title: result.msg,
							icon: 'none',
							mask: true
						})
					}
				}
			)
		} else if (info.goodstype == 1) {
			const that = this
			let totalMoney = Number(info.money) * Number(count)
			let totalCredit = Number(info.credit) * Number(count)
			let total = ''
			if (totalMoney == 0 && totalCredit != 0) {
				total = `${totalCredit}积分`
			} else if (totalMoney != 0 && totalCredit == 0) {
				total = `￥${totalMoney}`
			} else if (totalMoney != 0 && totalCredit != 0) {
				total = `￥${totalMoney} + ${totalCredit}积分`
			}
			Taro.showModal({
				title: '提示',
				content: `该商品为优惠券，将消耗${total},是否兑换?`
			}).then(res => {
				if (res.confirm) {
					Taro.showLoading({
						title: `请求中`
					})
					Request.post(api.creditCreat, {
						id: detailId,
						total: count,
						is_order: 1
					}).then(
						res => {
							Taro.hideLoading()
							const result = res.data
							if (result.code === 0) {
								Taro.hideLoading()
								const result = res.data
								if (result.code === 0) {
									//0元支付
									if (result.data.status === 1) {
										Taro.showModal({
											title: '提示',
											content: '兑换成功！',
											showCancel: false
										})
											.then(res => {
												if (res.confirm) {
													that.getGoodsDetail()
													that.closeLayout()
												}
											})
										return
									}
									that.pay(result.data.logid)
								} else if (result.code === 1) {
									Taro.showToast({
										title: result.msg,
										icon: 'none',
										mask: true
									})
								}
							} else {
								Taro.showToast({
									title: result.msg,
									icon: 'none',
									mask: true
								})
							}
						}
					)
				}
			})
		}
	}
	async pay(logid) {
		const res = await orderPay(logid)
		if (res == 'ok') {
			//支付成功
			Taro.showModal({
				title: '提示',
				content: '兑换成功！',
				showCancel: false
			}).then(res => {
				if (res.confirm) {
					this.getGoodsDetail()
					this.closeLayout()
				}
			})
		}
	}
	render() {
		const { goodsOptions, info, showLayout, goodsSpecs } = this.state
		return <View className="productDetail">
			<Loading show={this.state.loadingShow} title='加载中' />
			<Navbar bgColor='#253C6D' />
			<Menu></Menu>
			<View className='gradient-bgc'></View>
			<View className='main-contant'>
				<View className='goods-contant'>
					<Image className='image' src={info.thumb} mode='widthFix'></Image>
					<View className='goods-name'>{info.title}</View>
					<View className='name-des'>{info.subtitle}</View>
					<View className='money-contant'>
						<View className='point-contant'>{info.marketprice}</View>
						<View className='old-price'>{info.price}</View>
					</View>
					<View className='exchange-contant'>
						<View className='exchange' onClick={this.onShowLayout.bind(this)}>{info.buymsg}</View>
					</View>
				</View>
				{
					info.detail &&
					<View className='product-card'>
						<Image className='img' src={product} mode='widthFix'></Image>
					</View>
				}
				<View style='margin-top:20px'>
					{
						(process.env.TARO_ENV === 'weapp' && info.detail)
							? <ParseComponent parseData={info.detail} />
							: ('')
					}
					{
						(process.env.TARO_ENV === 'h5' && info.detail !== '')
							? <View className='h5Parse'>
								<View dangerouslySetInnerHTML={{ __html: info.detail }} />
							</View>
							: ('')
					}
				</View>
			</View>
			{
				this.state.optionReady &&
				<OptionLayout
					isOpened={showLayout}
					onClose={this.closeLayout.bind(this)}
					specsData={goodsSpecs}
					optionsData={goodsOptions}
					goodsInfo={info}
					buyNow={true}
					onUpdateSelect={this.updateSelect.bind(this)}
					selectOptionsBtn={false} 
					onAddCart={this.addCart.bind(this)}
				/>
			}
		</View>
	}
}

export default ProductDetail;