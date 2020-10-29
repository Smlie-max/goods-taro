import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import * as actionCreators from './store/actionCreators';
import orderPay from '../../utils/orderPay';
import Loading from '../../components/loading';

import { View, Text, Image, Input, Form } from '@tarojs/components'
import Menu from '../../components/menu'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Delivery from '../../components/delivery'
import ChooseCoupon from '../../components/chooseCoupon'

import line from '../../images/line.png'
import rightIcon from '../../images/right.png'
import default1 from '../../images/default1.png'
import default2 from '../../images/default2.png'
import './index.less'
import shangjin from '../../images/shangjin.png'

class orderPreview extends Component {

  config = {
    navigationBarTitleText: '确认订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loadingShow: true,
      info: '',
      showDeliveryMask: false,
      showCouponMask: false,
      deliveryWay: '快速配送',
      is_cart: 0, //是否购物车结算 0 -- 否 1 -- 是
      is_gift: 0, //是否为心享礼订单 0--否 1--是
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
      redemption_goods: {}, //超值换购商品
      redemption_goodsid: 0, //超值换购商品id
      goods_list: [],//全部商品列表
      skill: '0',
      form_id: '', //formID
      original: 0,
      is_plus: '',
      is_overseas: '',
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this.setState({
      is_cart: this.$router.params.is_cart || 0,
      is_gift: this.$router.params.is_gift || 0,
      skill: this.$router.params.skill || '0',
      id: this.$router.params.id,
      optionid: this.$router.params.optionid,
      total: this.$router.params.total,
      original: this.$router.params.original,
      bpid: this.$router.params.bpid
    }, () => {
      this.getOrderInfo(0)
    })
    this.huiyuan();
  }

  componentDidHide() { }

  showDeliveryMask = () => {
    this.setState({
      showDeliveryMask: !this.state.showDeliveryMask
    })
  }
  confirmSelect = (way) => {
    this.setState({
      deliveryWay: way
    })
  }
  //是否是会员
  huiyuan() {
    var that = this;
    Request.post(api.memberIndex, {
    }).then(
      res => {
        that.setState({
          is_plus: res.data.data.member.is_plus
        })
      }
    )
  }
  choiceAddress() {
    Taro.navigateTo({
      url: '/pages/address/index?status=order'
    })
  }
  //去开通会员
  kaitong() {
    Taro.navigateTo({
      url: "../member/index?id=1"
    })
  }
  getOrderInfo(is_order) {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.orderSubmit, {
      address_id: this.props.myChoice.address_id || '',
      is_cart: this.state.is_cart,
      id: this.state.id,
      total: this.state.total,
      optionid: this.state.optionid,
      coupon_id: this.state.coupon_id,
      merchs: JSON.stringify(this.state.merchs),
      is_gift: this.state.is_gift,
      is_credit: this.state.is_credit,
      is_money: this.state.is_money,
      dispatch_coupon_id: this.state.dispatch_coupon_id,
      tax_coupon_id: this.state.tax_coupon_id,
      is_bargain: this.state.is_bargain,
      bpid: this.state.bpid,
      is_seckill: this.state.is_seckill,
      is_order: is_order,
      redemption_goodsid: this.state.redemption_goodsid, //换购商品id
      goods_list: JSON.stringify(this.state.goods_list),
      form_id: this.state.form_id, //formID
    }).then(
      res => {
        Taro.hideLoading()
        this.setState({
          loadingShow: false,
          is_overseas: res.data.data.is_overseas,
        })
        const result = res.data
        const _this = this
        if (result.code === 0) {
          if (result.data.status === 1) {
            Taro.showModal({
              title: '提示',
              content: '支付成功！',
              showCancel: false
            })
              .then(res => {
                if (res.confirm) {
                  if (Number(_this.state.is_gift) === 1) {
                    Taro.redirectTo({
                      url: `/pages/gift/giftDetail/index?id=${result.data.order_id}`
                    })
                  } else if (Number(_this.state.is_gift) === 0) {
                    Taro.redirectTo({
                      url: `/pages/orderDetail/index?id=${result.data.order_id}`
                    })
                  }
                }
              })
            return
          }
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
            merchs: merchs,
            redemption_goods: result.data.redemption_goods, //超值换购商品
            goods_list: result.data.goods_list
          })
        } else if (result.code === 1) {
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false
          }).then(res => {
            if (res.confirm) {
              Taro.navigateBack()
            }
          })
        } else if (result.code === 2) {  //海外商品地址提示
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false
          }).then(res => {
            if (res.confirm) {
              Taro.navigateTo({
                url: `/pages/editAddress/index?id=${result.data.address_id}`
              })
            }
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
    console.info(that.state.is_overseas)
    if (that.state.is_overseas === 1) {
      Taro.showModal({
        title: '提示',
        content: '海外商品不能退换哦',
      }).then(function (res) {
        if (res.confirm == true) {
          that.getOrderInfo(is_order)
        } else {
          return;
        }
      })
    } else {
      this.getOrderInfo(is_order)
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
    // this.getOrderInfo(is_order)
  }
  //选择优惠券弹窗显示
  onShowCouponMask(type, price) {
    this.setState({
      couponType: type,
      couponTypePrice: price,
    }, () => {
      this.setState({
        showCouponMask: !this.state.showCouponMask
      })
    })
  }
  //选择优惠券的ID
  /* 
    couponType:优惠券类型 0--优惠券 3--运费券 4--税费券 5--运费&税费全免券
    couponId：ID
  */
  onChooseCouponId(couponId) {
    //优惠券
    if (this.state.couponType === 0) {
      this.setState({
        coupon_id: couponId
      }, () => {
        this.getOrderInfo(0)
      })
    }
    //运费券
    if (this.state.couponType === 3) {
      this.setState({
        dispatch_coupon_id: couponId
      }, () => {
        this.getOrderInfo(0)
      })
    }
    //税费券
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
    })
  }
  async pay(order_id) {
    const res = await orderPay(order_id)
    if (res) {
      //支付成功
      if (Number(this.state.is_gift) === 1 && res === 'ok') {
        Taro.redirectTo({
          url: `/pages/gift/giftDetail/index?id=${order_id}`
        })
      } else if (Number(this.state.is_gift) === 0 && res === 'ok') {
        Taro.redirectTo({
          url: `/pages/orderDetail/index?id=${order_id}`
        })
      } else if (res === 'fail') {
        Taro.redirectTo({
          url: `/pages/orderDetail/index?id=${order_id}`
        })
      }
    }
  }
  //查看协议
  agreement() {
    Taro.navigateTo({
      url: `/pages/article/index?type=10`
    })
  }
  //换购
  superBuy(redemption_goodsid) {
    this.setState({
      redemption_goodsid: Number(redemption_goodsid)
    }, () => {
      this.getOrderInfo(0)
    })
  }
  render() {
    const { info, skill, original, goods_list, redemption_goods, redemption_goodsid,
      showDeliveryMask, showCouponMask, couponType, couponTypePrice, is_credit, is_money, is_plus } = this.state
    const { myChoice } = this.props
    return (
      <View className='orderPreview-wrap'>
        <Loading show={this.state.loadingShow} title='加载中' />
        <Menu />
        {
          !info.address && myChoice.address == '' &&
          <View className='no-address' onClick={this.choiceAddress.bind(this)}>
            <Text>请选择地址</Text>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        {
          info.address && myChoice.address == '' &&
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
          info.merch_list &&
          info.merch_list.map((item) => {
            return (
              <View className='order-block' key={item.id}>

                {
                  item.goods_list.map((list, index) => {
                    return (
                      <View key={list.id}>
                        <View className='goods'>
                          <View className={index == 0 ? 'goodsxdfast' : 'goodsxd'} >
                            <Image src={list.thumb} className='goods-pic'></Image>
                            <View className='goods-info'>
                              <View className='goods-desc'>
                                <View className='goods-title'>{list.title}</View>
                                <Text>￥{list.marketprice}</Text>
                              </View>
                              <View className='goods-options'>
                                <View className='options'>{list.optiontitle}</View>
                              </View>
                              <View className='count_sui'>
                                <View className='sui'>税费:￥{list.taxes}</View>
                                <View className='count'>x {list.total}</View>
                              </View>
                            </View>
                          </View>
                        </View>
                        {
                          info.merch &&
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
        {/* 超值换购 */}
        {
          redemption_goods.id &&
          <View className='super-view'>
            <View className='super-title'>
              <Text className='big-title' style='font-weight:bold'>超值换购</Text>
              {/* <Text className='little-title'>{redemption_goodssubtitle}?</Text> */}
            </View>
            <View className='super-goods'>
              <Image src={redemption_goods.thumb} className='goods-pic' />
              <View className='super-right'>
                <View className='goods-title'>{redemption_goods.title}</View>
                <View className='goods-bottom'>
                  <Text className='xian'>¥{redemption_goods.redemption_price}</Text>
                  <Text className='yuan'>¥{redemption_goods.marketprice} </Text>
                  {
                    redemption_goodsid === 0 &&
                    <View className='btn' onClick={this.superBuy.bind(this, redemption_goods.id)}>换购</View>
                  }
                  {
                    redemption_goodsid !== 0 &&
                    <View className='btn' onClick={this.superBuy.bind(this, 0)}>已换购</View>
                  }
                </View>
              </View>
            </View>
          </View>
        }
        {/* 使用积分、优惠券 */}
        {
          (skill === '0' || original == 1)
            ? <View className='sum-view'>
              <View className='sum-item' onClick={this.onShowCouponMask.bind(this, 0, info.goods_real_price, goods_list)}>
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
            : <View />
        }
        <View className='sum-view'>
          {
            info.back_price
              ? <View className='sum-item'>
                <Text>立减</Text>
                <Text className='number'>- ¥ {info.back_price}</Text>
              </View>
              : ('')
          }
          {
            info.enough_price
              ? <View className='sum-item'>
                <Text>满减</Text>
                <Text className='number'>- ¥ {info.enough_price}</Text>
              </View>
              : ('')
          }
          <View className='sum-item'>
            <Text>税费</Text>
            <Text className='number'>+ ¥{info.tax_price}</Text>
          </View>
          <View className='sum-item'>
            <Text>运费</Text>
            <Text className='number'>+ ¥{info.dispatch_price}</Text>
          </View>
        </View>
        <View className='dispatchprice'>
          <View className='sf'>
            <View className="sj">
              <Image src={shangjin} className="shangjin"></Image>
            </View>
            {
              is_plus == 0 ?
                <View>
                  <View className="sjtitle">
                    开通赏金卡会员，可免邮免税
                </View>
                  <View className="guding">
                    <View className="ktsj" onClick={this.kaitong.bind(this)}>立即开通</View>
                    <View className="jiantou">></View>
                  </View>
                </View>
                : <View>
                  <View className="menberclass">
                    会员专属特权，下单确认收货后可获得赏金
                   </View>
                </View>
            }
          </View>
        </View>
        <View className='agreement'>
          <Text>提交订单则表示你同意</Text>
          <Text onClick={this.agreement.bind(this)}>《用户购买协议》</Text>
        </View>
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
            onShowCouponMask={this.onShowCouponMask.bind(this)}
            showCouponyMask={true}
            goods_list={goods_list}
            onChooseCouponId={this.onChooseCouponId.bind(this)}
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
  getInfo() {
    dispatch(actionCreators.getMemberInfo());
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(orderPreview);
