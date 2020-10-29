import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import orderPay from '../../../utils/orderPay';

import { View, Text, Image, Input, Form } from '@tarojs/components'
import Menu from '../../../components/menu'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Delivery from '../../../components/delivery'
import ChooseCoupon from '../../../components/chooseCoupon'

import line from '../../../images/line.png'
import rightIcon from '../../../images/right.png'
import default1 from '../../../images/default1.png'
import default2 from '../../../images/default2.png'
import './index.less'

class DiscountOrderPreview extends Component {

  config = {
    navigationBarTitleText: '确认订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      info: '',
      showDeliveryMask: false,
      showCouponMask: false,
      deliveryWay: '',
      is_cart: '', //是否购物车结算 0 -- 否 1 -- 是
      is_gift: '', //是否为心享礼订单 0--否 1--是
      id: '', //立即购买的商品ID
      total: '', //商品数量
      optionid: '', //规格ID
      couponType: '', //选择优惠券类型
      couponTypePrice: '', //选择优惠券类型对应的价格
      coupon_id: '',//优惠券ID
      dispatch_coupon_id: '',//运费券ID
      tax_coupon_id: '',//税费券ID
      is_credit: 0, //是否使用积分抵扣 0--否 1--是
      is_money: 0, //是否使用余额抵扣 0--否 1--是
      merchs: [], //门店数组
      form_id: '', //formId
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.setState({
      id: this.$router.params.id,
      optionid: this.$router.params.optionid,
      total: this.$router.params.total,
    }, () => {
      this.getOrderInfo(0)
    })
  }

  showDeliveryMask = () => {
    this.setState({
      showDeliveryMask: !this.state.showDeliveryMask
    })
  }

  choiceAddress() {
    Taro.navigateTo({
      url: '/pages/address/index?status=order'
    })
  }
  getOrderInfo(is_order, address_id) { // is_order 是否提交订单 0--否(预览) 1--是
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.orderSubmit, {
      address_id: address_id,
      is_cart: 0,
      id: this.state.id,
      total: this.state.total,
      optionid: this.state.optionid,
      coupon_id: this.state.coupon_id,
      merchs: JSON.stringify(this.state.merchs),
      is_gift: 0,
      is_credit: this.state.is_credit,
      is_money: this.state.is_money,
      dispatch_coupon_id: this.state.dispatch_coupon_id,
      tax_coupon_id: this.state.tax_coupon_id,
      is_bargain: 0,
      bpid: 0,
      is_seckill: 1,
      is_order: is_order,
      form_id: this.state.form_id, //formId
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          if (is_order === 1) {
            this.pay(result.data.order_id);
            return;
          }
          let merchs = []
          if (result.data.merch_list) {
            result.data.merch_list.map((item) => {
              const obj = {}
              obj.remark = '';
              obj.merchid = item.merchid;
              obj.is_salf = 0;
              merchs.push(obj)
            })
          }
          this.setState({
            info: result.data,
            merchs: merchs
          })
        } else {
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false
          })
        }
      }
    )
  }
  //提交订单
  submitOrder(is_order, e) {
    this.setState({
      form_id: e.detail.formId || ''
    })
    let address_id = 0;
    const that = this;
    if (!this.state.info.address.id) {
      address_id = this.props.myChoice.address_id
    } else if (this.state.info.address.id && this.props.myChoice.address_id === 0) {
      address_id = this.state.info.address.id
    } else {
      address_id = this.props.myChoice.address_id
    }
    if (address_id === 0) {
      Taro.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return;
    }
    // console.log('地址id：' + address_id)
    // console.log('是否购物车结算：' + this.state.is_cart)
    // console.log('立即购买的商品ID：' + this.state.id)
    // console.log('商品数量：' + this.state.total)
    // console.log('规格ID：' + this.state.optionid)
    // console.log('优惠券ID：' + this.state.coupon_id)
    // console.log('门店数组：' + JSON.stringify(this.state.merchs))
    // console.log('是否为心享礼订单：' + this.state.is_gift)
    // console.log('是否使用积分抵扣：' + this.state.is_credit)
    // console.log('是否使用余额抵扣' + this.state.is_money)
    // console.log('运费券ID：' + this.state.dispatch_coupon_id)
    // console.log('税费券ID：' + this.state.tax_coupon_id)
    // console.log('是否砍价订单：' + this.state.is_bargain)
    // console.log('砍价ID：' + this.state.bpid)
    // console.log('是否秒杀订单：' + this.state.is_seckill)
    // console.log('是否提交订单:' + is_order)
    this.getOrderInfo(is_order, address_id)
  }
  //选择优惠券弹窗显示
  onShowCouponMask(type, price) {
    this.setState({
      couponType: type,
      couponTypePrice: price
    }, () => {
      this.setState({
        showCouponMask: !this.state.showCouponMask
      })
    })
  }
  //选择优惠券的ID
  onChooseCouponId(couponId) {
    if (this.state.couponType === 0) {
      this.setState({
        coupon_id: couponId
      }, () => {
        this.getOrderInfo(0)
      })
    }
    if (this.state.couponType === 3) {
      this.setState({
        dispatch_coupon_id: couponId
      }, () => {
        this.getOrderInfo(0)
      })
    }
    if (this.state.couponType === 4) {
      this.setState({
        tax_coupon_id: couponId
      }, () => {
        this.getOrderInfo(0)
      })
    }
  }
  //选择积分、余额抵扣
  selectDeduction(type) {
    if (type === 'credit') {
      this.setState({
        is_credit: this.state.is_credit === 0 ? 1 : 0
      }, () => {
        this.getOrderInfo(0)
      })
    }
    if (type === 'money') {
      this.setState({
        is_money: this.state.is_money === 0 ? 1 : 0
      }, () => {
        this.getOrderInfo(0)
      })
    }
  }
  //店铺留言
  wordsInput(merchid, e) {
    const merchs = this.state.merchs
    merchs.map((item) => {
      if (item.merchid === merchid) {
        item.remark = e.detail.value
      }
    })
    this.setState({
      merchs: merchs
    }, () => {
    })
  }
  async pay(order_id) {
    const res = await orderPay(order_id)
    if (res == 'ok') {
      //支付成功
      Taro.navigateBack()
    }
  }
  agreement() {
    Taro.navigateTo({
      url: `/pages/article/index?type=10`
    })
  }
  render() {
    const { info, showDeliveryMask, showCouponMask, couponType, couponTypePrice, is_credit, is_money } = this.state
    const { myChoice } = this.props
    return (
      <View className='DiscountOrderPreview'>
        <Menu />
        {
          !info.address && myChoice.address == '' &&
          <View className='no-address' onClick={this.choiceAddress.bind(this)}>
            <Text>请选择地址</Text>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        {
          info.address.id && myChoice.address == '' &&
          <View className='address-view' onClick={this.choiceAddress.bind(this)}>
            <View>
              <View className='user'>{info.address.realname} {info.address.mobile}</View>
              <View className='address'>{info.address.address}</View>
            </View>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        {
          myChoice.address != '' &&
          <View className='address-view' onClick={this.choiceAddress.bind(this)}>
            <View>
              <View className='user'>{myChoice.realname} {myChoice.mobile}</View>
              <View className='address'>{myChoice.address}</View>
            </View>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        {
          info.merch_list.map((item) => {
            return (
              <View className='order-block' key={item.id}>
                <View className='store-name'>
                  <Image src={item.logo} className='logo'></Image>
                  <Text>{item.merch_name}</Text>
                </View>
                {
                  item.goods_list.map((list, index) => {
                    return (
                      <View key={list.id}>
                        <View className='goods'>
                          <Image src={list.thumb} className='goods-pic'></Image>
                          <View className='goods-info'>
                            <View className='goods-desc'>
                              <View className='goods-title'>{list.title}</View>
                              <Text>￥{list.marketprice}</Text>
                            </View>
                            <View className='goods-options'>
                              <Text className='options'>{list.optiontitle}</Text>
                              {/*<Text className='sui'>税费：￥10.00</Text>*/}
                              <Text className='count'>x {list.total}</Text>
                            </View>
                          </View>
                        </View>
                        {
                          (index == info.merch.length - 1) &&
                          <Image src={line} className='line' mode='widthFix'></Image>
                        }
                      </View>
                    )
                  })
                }
                <View className='get-way' onClick={this.showDeliveryMask}>
                  <Text>配送</Text>
                  <View className='select-way'>
                    <Text>{this.state.deliveryWay}</Text>
                    <Image src={rightIcon} className='rightIcon'></Image>
                  </View>
                </View>
                <View className='words-view'>
                  <Text className='title'>买家留言</Text>
                  <Input placeholder='50字以内（选填）' className='words' maxLength='50' value={item.value} onInput={this.wordsInput.bind(this, item.merchid)} />
                </View>
                {/* <View className='invoice-view'>
                  <Text>发票</Text>
                  <Text>不支持开发票</Text>
                </View> */}
              </View>
            )
          })
        }
        {/* 使用积分、优惠券 */}

        <View className='sum-view'>
          <View className='sum-item' onClick={this.onShowCouponMask.bind(this, 0, info.goods_price)}>
            <Text>优惠券</Text>
            <View className='sum-right'>
              <Text>-￥{info.coupon_price}</Text>
              <Image src={rightIcon} className='rightIcon'></Image>
            </View>
          </View>
          <View className='sum-item' onClick={this.onShowCouponMask.bind(this, 3, info.dispatch_price)}>
            <Text>运费券</Text>
            <View className='sum-right'>
              <Text>-￥{info.dispatch_coupon_price}</Text>
              <Image src={rightIcon} className='rightIcon'></Image>
            </View>
          </View>
          <View className='sum-item' onClick={this.onShowCouponMask.bind(this, 4, info.tax_price)}>
            <Text>税费券</Text>
            <View className='sum-right'>
              <Text>-￥{info.tax_coupon_price}</Text>
              <Image src={rightIcon} className='rightIcon'></Image>
            </View>
          </View>
          <View className='sum-item'>
            <Text>积分抵扣</Text>
            <View className='sum-right'>
              <Text>使用 {info.credit} 积分抵扣 ¥{info.credit_price} </Text>
              {
                is_credit === 1
                  ? <Image src={default2} className='defaultIcon' onClick={this.selectDeduction.bind(this, 'credit')} />
                  : <Image src={default1} className='defaultIcon' onClick={this.selectDeduction.bind(this, 'credit')} />
              }
            </View>
          </View>
          <View className='sum-item'>
            <Text>余额抵扣</Text>
            <View className='sum-right'>
              <Text>使用 {info.money} 余额抵扣 ¥{info.money_price} </Text>
              {
                is_money === 1
                  ? <Image src={default2} className='defaultIcon' onClick={this.selectDeduction.bind(this, 'money')} />
                  : <Image src={default1} className='defaultIcon' onClick={this.selectDeduction.bind(this, 'money')} />
              }
            </View>
          </View>
        </View>
        <View className='sum-view'>
          <View className='sum-item'>
            <Text>税费</Text>
            <Text className='number'>¥{info.tax_price}</Text>
          </View>
          <View className='sum-item'>
            <Text>运费</Text>
            <Text className='number'>¥ {info.dispatch_price}</Text>
          </View>
        </View>
        <View className='agreement' onClick={this.agreement.bind(this)}>提交订单则表示你同意《用户购买协议》</View>
        <View className='bottom-bar'>
          <View className='total'>实付款：¥{info.total_price}</View>
          <Form onSubmit={this.submitOrder.bind(this)} reportSubmit={true} >
            <View className='submit' onClick={this.submitOrder.bind(this, 1)}>提交订单</View>
          </Form>
        </View>
        <Delivery
          showDeliveryMask={showDeliveryMask}
          onShowDeliveryMask={this.showDeliveryMask.bind(this)}
        />
        {/* 优惠券弹窗 */}
        {
          showCouponMask &&
          <ChooseCoupon
            onShowCouponMask={this.onShowCouponMask}
            showCouponyMask={true}
            onChooseCouponId={this.onChooseCouponId}
            couponType={couponType}
            couponTypePrice={couponTypePrice}
          />
        }
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    myChoice: state.address.myChoice
  }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(DiscountOrderPreview);
