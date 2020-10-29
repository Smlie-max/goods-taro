import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import orderPay from '../../../utils/orderPay';
import Loading from '../../../components/loading';
import Clipboard from 'clipboard'

import status0 from '../../../images/order-status1.png'
import status1 from '../../../images/order-status2.png'
import status2 from '../../../images/order-status3.png'
import status3 from '../../../images/order-status4.png'
import mobileIcon from '../../../images/mobile-icon.png'
import addressIcon from '../../../images/address-icon.png'
import './index.less'

class GroupsOrderDeatil extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      address: {}, //地址
      merch: [],//店铺数据
      order: {}, //订单数据
      id: '', //订单id
      info: [],
      order: {},
      loadingShow: true, //loading
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    }, () => {
      this.getGoodsDetail(); //id订单ID
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getGoodsDetail() {
    // Taro.showLoading({
    //   title: '加载中'
    // })
    Request.post(api.orderDetail, {
      id: this.state.id
    }).then(
      res => {
        // Taro.hideLoading()
        this.setState({
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          this.setState({
            address: result.data.address,
            info: result.data.merch_array,
            // merch: result.data.merch_array,
            order: result.data.order,
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
  //   async pay() {
  //     const res = await orderPay(this.state.id)
  //     if (res == 'ok') {
  //       //支付成功
  //       this.getGoodsDetail()
  //     }
  //   }
  // }
  async pay() {
    const res = await orderPay(this.state.order.id)
    if (res == 'ok') {
      //支付成功
      Taro.showToast({
        title: '支付成功',
        icon: 'none'
      });
      setTimeout(() => {
        this.getGoodsDetail()
      }, 1500)
    }
  }
  //取消订单
  cancelPay() {
    Taro.showModal({
      title: '提示',
      content: '确定取消订单？',
    }).then(res => {
      if (res.confirm) {
        Taro.showLoading({
          title: '正在取消'
        })
        Request.post(api.groupsOrderCancel, {
          id: this.state.id
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
            if (result.code === 0) {
              setTimeout(() => {
                this.getGoodsDetail()
              }, 1500)
            }
          }
        )
      }
    })
  }
  //收货
  finish() {
    Taro.showModal({
      title: '提示',
      content: '确定收货吗？',
    }).then(res => {
      if (res.confirm) {
        Taro.showLoading({
          title: '正在收货'
        })
        Request.post(api.groupsOrderFinish, {
          id: this.state.id
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
            if (result.code === 0) {
              setTimeout(() => {
                this.getGoodsDetail()
              }, 1500)
            }
          }
        )
      }
    })
  }
  //跳转评价
  orderComment() {
    // Taro.navigateTo({
    //   url: `/pages/evaluate/index?id=${this.state.id}`
    // })
  }
  //跳转物流
  logistics() {
    Taro.navigateTo({
      url: `/pages/groups/logistics/index?id=${this.state.id}`
    })
  }
  //复制单号
  copyNum(num) {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.setClipboardData({
        data: num,
      })
    } else if (process.env.TARO_ENV === 'h5') {
      var clipboard = new Clipboard('#copyBtn');
      clipboard.on('success', function (e) {
        Taro.showToast({
          title: '内容已复制'
        })
        e.clearSelection();
      })
    }
  }
  render() {
    const { address, info, order } = this.state
    return (
      <View className='GroupsOrderDeatil'>
        <Loading show={this.state.loadingShow} title='加载中' />
        <Navbar />
        <Menu />
        <View className='order-status'>
          {/* -1--已取消 0--待付款 1--待发货 2-待收货 3--已完成 */}
          {order.status === '-1' && <Text>已取消</Text>}
          {order.status === '0' && <Text>待付款</Text>}
          {order.status === '1' && <Text>待发货</Text>}
          {order.status === '2' && <Text>待收货</Text>}
          {/* {order.status === '3' && <Text>待评价</Text>} */}
          {order.status === '3' && <Text>已完成</Text>}
          {order.status === '-1' && <Image src={status3} className='status-pic' />}
          {order.status === '0' && <Image src={status0} className='status-pic' />}
          {order.status === '1' && <Image src={status1} className='status-pic' />}
          {order.status === '2' && <Image src={status2} className='status-pic' />}
          {order.status === '3' && <Image src={status3} className='status-pic' />}
        </View>
        {
          order.status === '0' &&
          <View className='pay-tips'>
            <View>您需支付</View>
            <View className='time'>请在30分钟内完成付款，逾期订单将自动取消</View>
            <View className='total'>
              <Text>￥{order.price}</Text>
              {/* <View className='pay-btn' onClick={this.pay}>立即付款</View> */}
            </View>
          </View>
        }
        {
          address &&
          <View className='address-block'>
            <View className='address-title'>配送地址</View>
            <View className='info-view'>
              <Image src={mobileIcon} className='icon' />
              <Text>{address.realname} {address.mobile}</Text>
            </View>
            <View className='info-view'>
              <Image src={addressIcon} className='icon' />
              <Text>{address.province}{address.city}{address.area}{address.address}</Text>
            </View>
          </View>
        }
        <View className='order-block'>
          {
            info.map((item) => {
              return (
                <View>
                  {
                    item.goods.map((row) => {
                      return (
                        <View className='goods'>
                          <Image src={row.thumb} className='goods-pic'></Image>
                          <View className='goods-info'>
                            <View className='goods-desc'>
                              <View className='goods-title'>{row.title}</View>
                              <Text>￥{row.price}</Text>
                            </View>
                            <View className='goods-options'>
                              <Text className='options'>{row.optiontitle}</Text>
                              {/*<Text className='sui'>税费：￥10.00</Text>*/}
                              <Text className='count'>x {row.total}</Text>
                            </View>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              )
            })
          }
          <View className='total-view'>
            <View>共 {order.total} 件商品</View>
            <View className='total-price'>
              <Text>合计</Text>
              <Text className='price'>￥{order.price}</Text>
            </View>
          </View>
        </View>
        <View className='sum-block'>
          <View className='time-view'>
            <View className='t-left'>
              <View className='time'>{order.createtime}</View>
              {
                process.env.TARO_ENV === 'weapp'
                  ? <Input className='order-number' id='copyId' value={order.ordersn} disabled />
                  : ('')
              }
              {
                process.env.TARO_ENV === 'h5'
                  ? <Input className='order-number' id='copyId' value={order.ordersn} readonly />
                  : ('')
              }
            </View>
            <Button className='copy' onClick={this.copyNum.bind(this, order.ordersn)} data-clipboard-action="copy" data-clipboard-target="#copyId" id='copyBtn'>复制单号</Button>
          </View>
          {/*<View className='sum-item'>
            <Text>plus会员卡抵扣金额</Text>
            <Text className='number'>{info.plus_discount_price}</Text>
          </View>*/}
          <View className='sum-item'>
            <Text>商品金额</Text>
            <Text className='number'>￥{order.price}</Text>
          </View>
          {/* <View className='sum-item'>
            <Text>优惠券</Text>
            <Text className='number'>-￥{order.couponprice}</Text>
          </View>
          {
            order.back_price &&
            <View className='sum-item'>
              <Text>立减</Text>
              <Text className='number'>- ¥ {order.back_price}</Text>
            </View>
          }
          {
            order.enough_price &&
            <View className='sum-item'>
              <Text>满减</Text>
              <Text className='number'>- ¥ {order.enough_price}</Text>
            </View>
          } */}
          <View className='sum-item'>
            <Text>运费</Text>
            <Text className='number'>￥{order.dispatchprice}</Text>
          </View>
          {/* <View className='sum-item'>
            <Text>税费</Text>
            <Text className='number'>￥{order.tax_price}</Text>
          </View> */}
        </View>
        {
          order.status !== '-1' &&
          <View className='bottom-bar'>
            {
              order.status === '0' &&
              <View>
                <View className='bar left' onClick={this.pay.bind(this)}>立即付款</View>
                <View className='bar right' onClick={this.cancelPay.bind(this)}>取消订单</View>
              </View>
            }
            {
              order.status === '2' &&
              <View>
                <View className='bar left' onClick={this.logistics.bind(this)}>查看物流</View>
                <View className='bar right' onClick={this.finish.bind(this)}>确认收货</View>
              </View>
            }
            {/* {
              order.status === '3' && order.iscomment === '0' &&
              <View>
                <View className='bar left' onClick={this.orderComment}>评价商品</View>
              </View>
            } */}
          </View>
        }
      </View>
    )
  }
}


export default GroupsOrderDeatil; 
