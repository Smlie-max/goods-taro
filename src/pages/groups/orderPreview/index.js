import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Image, Form } from '@tarojs/components'

import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import orderPay from '../../../utils/orderPay';
import rightIcon from '../../../images/right.png'
import './index.less'

class GroupsOrderPreview extends Component {
  config = {
    navigationBarTitleText: '订单确定'
  }
  constructor() {
    super(...arguments)
    this.state = {
      info: {},
      id: '',
      type: '',
      heads: '',
      teamid: '',
      form_id: '', //formId
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentDidShow() {
    /*
    id: 团购商品ID
    // type: 1--团购 2--单独购买
    is_order: 0--预览 1--下单
    aid: 地址ID
    // heads: 0--参团 1--开团
  */
    this.setState({
      id: this.$router.params.id,
      type: this.$router.params.type,
      heads: this.$router.params.heads,
      teamid: this.$router.params.teamid
    }, () => {
      this.getDetail()
    })
  }

  getDetail() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.orderSubmit, {
      address_id: this.props.myChoice.address_id || '',
      ggid: this.$router.params.id,
      is_group: 1, //拼团订单
      is_order: 0,
      teamid: this.$router.params.teamid
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            info: result.data
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
  }

  //选择地址
  choiceAddress() {
    Taro.navigateTo({
      url: '/pages/address/index?status=order'
    })
  }

  submitOrder(e) {
    let address_id = 0;
    const that = this;
    if (!this.state.info.address) {
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
    /*
      id: 团购商品ID
      // type: 1--团购 2--单独购买
      is_order: 0--预览 1--下单
      aid: 地址ID
      // heads: 0--参团 1--开团
    */

    Taro.showLoading({
      title: '正在提交订单',
      mask: true
    })
    Request.post(api.orderSubmit, {
      ggid: this.state.id,
      is_group: 1, //拼团订单
      is_order: 1,
      address_id: address_id,
      teamid: this.state.teamid,
      form_id: e.detail.formId || ''
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          //0元支付
          if (result.data.status === 1) {
            //获取团teamid
            that.getTeamId(result.data.order_id)
          } else {
            that.pay(result.data.order_id)
          }
        } else if (result.code === 1) {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
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
  async pay(order_id) {
    const res = await orderPay(order_id)
    if (res == 'ok') {
      //支付成功
      this.getTeamId(order_id)
    } else if (res == 'fail') {
      Taro.redirectTo({
        url: `/pages/orderDetail/index?id=${order_id}`
      })
    }
  }
  getTeamId(order_id) {
    Taro.showLoading({
      title: '请稍后'
    })
    Request.post(api.getTeamId, {
      orderid: order_id
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code == 0) {
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/groups/goodsDetail/index?teamid=${result.data.teamid}`
            })
          }, 1500)
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
  render() {
    const { myChoice } = this.props
    const { info } = this.state
    return (
      <block>
        {
          info &&
          <View className='GroupsOrderPreview'>
            {
              !info.address && myChoice.address === '' &&
              <View className='no-address' onClick={this.choiceAddress.bind(this)}>
                <Text>请选择地址</Text>
                <Image src={rightIcon} className='rightIcon' />
              </View>
            }
            {
              info.address && myChoice.address === '' &&
              <View className='address-view' onClick={this.choiceAddress.bind(this)}>
                <View>
                  <View className='user'>{info.address.realname} {info.address.mobile}</View>
                  <View className='address'>{info.address.province}{info.address.city}{info.address.area}{info.address.address}</View>
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
            <View className='order-block'>
              {
                info.goods_list &&
                info.goods_list.map((item) => {
                  return (
                    <View className='goods' key={item.id}>
                      <Image src={item.thumb} className='goods-pic' />
                      <View className='goods-info'>
                        <View className='goods-desc'>
                          <View className='goods-title'>{item.title}</View>
                          <Text>￥{info.goods_price}</Text>
                        </View>
                        <View className='goods-options'>
                          <Text>税费</Text>
                          <Text>{item.taxes}</Text>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
              <View className='get-way'>
                <Text>配送</Text>
                <View className='select-way'>
                  <Text>快递配送</Text>
                </View>
              </View>
            </View>
            <View className='sum-view'>
              {
                info.headsmoney
                  ? <View className='sum-item yun'>
                    <Text>团长优惠</Text>
                    <Text className='number'>-￥{info.headsmoney}</Text>
                  </View>
                  : ('')
              }
              <View className='sum-item yun'>
                <Text>运费</Text>
                <Text className='number'>￥{info.dispatch_price}</Text>
              </View>
              <View className='sum-item yun'>
                <Text>税费</Text>
                <Text className='number'>￥{info.tax_price}</Text>
              </View>
            </View>
            <View className='bottom-bar'>
              <View className='total'>实付款：¥{info.total_price}</View>
              <Form onSubmit={this.submitOrder.bind(this)} reportSubmit={true} >
                <View className='submit' onClick={this.submitOrder.bind(this)}>提交订单</View>
              </Form>
            </View>
          </View>
        }
      </block>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    myChoice: state.address.myChoice,
  }
}

export default connect(mapStateToProps)(GroupsOrderPreview); 