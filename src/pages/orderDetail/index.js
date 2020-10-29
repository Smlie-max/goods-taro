import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import orderPay from '../../utils/orderPay';
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import withShare from '../../utils/withShare'
import shareConfig from '../../utils/share'
import Loading from '../../components/loading';
import Clipboard from 'clipboard'
import status0 from '../../images/order-status1.png'
import status1 from '../../images/order-status2.png'
import status2 from '../../images/order-status3.png'
import status3 from '../../images/order-status4.png'
import mobileIcon from '../../images/mobile-icon.png'
import addressIcon from '../../images/address-icon.png'
import packet from '../../images/packet.png'
import fpIcon from '../../images/fp.png'
import backIcon from '../../images/back.png'
import './index.less'

@withShare()

class OrderDeatil extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      address: {}, //地址
      merch: [],//店铺数据
      order: {}, //订单数据
      rpid: '', //红包id
      id: '', //订单ID
      shareMessage: {}, //分享数据
      hour: 0,
      minute: 0,
      second: 0,
      loadingShow: true, //loading
    }
  }

  componentDidShow() {
    this.setState({
      id: this.$router.params.id //id订单ID
    }, () => {
      this.getGoodsDetail()
    })
  }

  getGoodsDetail() {
    Request.post(api.orderDetail, {
      id: this.state.id
    }).then(
      res => {
        this.setState({
          loadingShow: false
        })
        const result = res.data
        if (result.code == 0) {
          this.setState({
            address: result.data.address,
            merch: result.data.merch_array,
            order: result.data.order,
            rpid: result.data.rpid,
            shareMessage: result.data.rp_share,
            hour: result.data.order.hour,
            minute: result.data.order.minute,
            second: result.data.order.second
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.icon}`
            this.$setSharePath = () => `/pages/orderRedPacket/index?rpid=${this.state.rpid}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.icon}`,
              path: `/pages/orderRedPacket/index?rpid=${this.state.rpid}`,
              desc: `${this.state.shareMessage.desc}`
            })
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }
  async pay() {
    const res = await orderPay(this.state.id)
    if (res == 'ok') {
      //支付成功
      this.getGoodsDetail()
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
        Request.post(api.cancelPay, {
          id: this.state.id
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
            if (result.code == 0) {
              this.getGoodsDetail()
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
        Request.post(api.finishOrder, {
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
                Taro.redirectTo({
                  url: `/pages/evaluate/index?id=${this.state.id}`
                })
              }, 1400)
            }
          }
        )
      }
    })
  }
  //跳转评价
  orderComment() {
    Taro.navigateTo({
      url: `/pages/evaluate/index?id=${this.state.id}`
    })
  }

  //跳转物流
  logistics() {
    Taro.navigateTo({
      url: `/pages/logistics/index?id=${this.state.id}`
    })
  }
  //申请发票
  invoice() {
    if (this.state.order.invoice == 0) {
      Taro.navigateTo({
        url: `/pages/invoice/index?id=${this.state.id}`
      })
    } else {
      Taro.showToast({
        title: '该订单已开过发票了',
        icon: 'none',
        mask: true
      })
    }
  }
  //复制单号
  copyNum(num) {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.setClipboardData({
        data: num,
      })
    } else if (process.env.TARO_ENV === 'h5') {
      let clipboard = new Clipboard('#copyBtn');
      clipboard.on('success', function (e) {
        Taro.showToast({
          title: '内容已复制'
        })
        e.clearSelection();
      })
    }
  }
  //分享提示
  shareBtnClick() {
    if (process.env.TARO_ENV === 'h5') {
      Taro.showToast({
        title: '请点击右上角分享哦',
        icon: 'none',
        duration: 2000
      })
    }
  }
  //申请售后
  refund() {
    if (this.state.order.is_refund == 0) {
      Taro.showToast({
        title: `${this.state.order.refund_msg}`,
        icon: 'none',
        duration: 2000
      })
    } else {
      Taro.navigateTo({
        url: `/pages/afterSale/chooseGoods/index?id=${this.state.id}`
      })
    }
  }
  // $setSharePath = () => `/pages/orderRedPacket/index?rpid=${this.state.rpid}`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.icon}`

  render() {
    const { address, merch, order, hour, minute, second } = this.state
    return (
      <View className='orderDetail'>
        <Loading show={this.state.loadingShow} title='加载中' />
        <Navbar />
        <Menu />
        <View className='order-status'>
          {/*0--待付款 1--待发货 2-待收货 3--待评价 4--退款 -1--已取消*/}
          {order.status === '0' && <Text>待付款</Text>}
          {order.status === '1' && <Text>待发货</Text>}
          {order.status === '2' && <Text>待收货</Text>}
          {(order.status === '3' && order.iscomment === '0') && <Text>待评价</Text>}
          {(order.status === '3' && order.iscomment === '1') && <Text>已评价</Text>}
          {order.status === '4' && <Text>退款</Text>}
          {order.status === '5' && <Text>已完成</Text>}
          {order.status === '-1' && <Text>已取消</Text>}
          {order.status === '0' && <Image src={status0} className='status-pic' />}
          {order.status === '1' && <Image src={status1} className='status-pic' />}
          {order.status === '2' && <Image src={status2} className='status-pic' />}
          {order.status === '3' && <Image src={status3} className='status-pic' />}
          {order.status === '-1' && <Image src={status3} className='status-pic' />}
        </View>
        {
          order.status === '0' &&
          <View className='pay-tips'>
            <View>您需支付</View>
            <View className='time'>
              <Text>请在</Text>
              <AtCountdown
                format={{ hours: '时', minutes: '分', seconds: '秒' }}
                hours={hour}
                minutes={minute}
                seconds={second}
              />
              <Text>完成付款，逾期订单将自动取消</Text>
            </View>
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
        {
          merch.map((item) => {
            return (
              <View className='order-block' key={item.merchid}>
                <View className='store-name'>
                  <Image src={item.logo} className='logo'></Image>
                  <Text>{item.merch_name}</Text>
                </View>
                {
                  item.goods.map((list) => {
                    return (
                      <View key={list.id}>
                        <View className='goods'>
                          <Image src={list.thumb} className='goods-pic'></Image>
                          <View className='goods-info'>
                            <View className='goods-desc'>
                              <View className='goods-title'>{list.title}</View>
                              <Text>￥{list.price}</Text>
                            </View>
                            <View className='goods-options'>
                              <Text className='options'>{list.optiontitle}</Text>
                              {/*<Text className='sui'>税费：￥10.00</Text>*/}
                              <Text className='count'>x {list.total}</Text>
                            </View>
                              {list.rstate == 1 && <View className='refund'>{list.rstate_str}</View>}
                          </View>
                        </View>
                      </View>
                    )
                  })
                }
                <View className='total-view'>
                  <View>共 {item.goods.length} 件商品</View>
                  <View className='total-price'>
                    <Text>合计</Text>
                    <Text className='price'>￥{item.total_price}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }
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
            <Text className='number'>￥{order.goodsprice}</Text>
          </View>
          <View className='sum-item'>
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
          }
          <View className='sum-item'>
            <Text>运费</Text>
            <Text className='number'>￥{order.dispatchprice}</Text>
          </View>
          <View className='sum-item'>
            <Text>税费</Text>
            <Text className='number'>￥{order.tax_price}</Text>
          </View>
        </View>
        {
          (order.status === '1' || order.status === '3') &&
          <View className='afterSale'>
            <View className='btn' onClick={this.invoice.bind(this)}>
              <Image src={fpIcon} className='btn-img' />
              <Text>申请发票</Text>
            </View>
            <View className='btn' onClick={this.refund.bind(this)}>
              <Image src={backIcon} className='btn-img' />
              <Text>申请售后</Text>
            </View>
          </View>
        }
        {
          //-1=已取消
          order.status !== '-1'
            ? <View className='bottom-bar'>
              {
                (order.status === '1' || order.status === '2' || order.status === '3') &&
                <Button className='share-btn' open-type='share' onClick={this.shareBtnClick.bind(this)}>
                  <Image src={packet} className='packet' mode='widthFix' />
                  <View className='txt'>发红包</View>
                </Button>
              }
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
              {
                order.status === '3' && order.iscomment === '0' &&
                <View>
                  <View className='bar left' onClick={this.logistics.bind(this)}>查看物流</View>
                  <View className='bar right' onClick={this.orderComment.bind(this)}>评价商品</View>
                </View>
              }
              {
                order.status === '5' &&
                <View>
                  <View className='bar right' onClick={this.logistics.bind(this)}>查看物流</View>
                </View>
              }
            </View>
            : ('')
        }
      </View>
    )
  }
}


export default OrderDeatil; 
