import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import Loading from '../../components/loading'
import withShare from '../../utils/withShare'
import withToken from '../../utils/withToken'
import bindParent from '../../utils/bindParent'
import shareConfig from '../../utils/share'
import { getLoginAndLabel } from '../../utils/common'

import banner from './images/order-redpacket.png'
import couponBg from './images/red-coupon.png'
import redpacket from './images/redpacket.png'
import homeIcon from './images/home.png'
import btn1 from './images/use-btn1.png'
import './index.less'
@withToken()
@withShare()

class OrderRedPacket extends Component {
  config = {
    navigationBarTitleText: '订单红包'
  }
  constructor() {
    super(...arguments)
    this.state = {
      showMain: false,
      coupon: '',
      explain: '',
      log_list: '',
      other_coupon: '',
      rpid: '', //红包id
      shareMessage: {}, //分享信息
      loadingShow: true
    }
  }

  componentDidShow() {
    bindParent(this.$router.params.shareFromUser) //绑定
    getLoginAndLabel(false).then((res) => {
      if (!res) return
      this.setState({
        rpid: this.$router.params.rpid
      }, () => {
        this.getRedPackets(this.state.rpid)
      })
    })
  }

  getRedPackets(rpid) {
    Request.post(api.getRedPackets, {
      rpid: rpid
    }).then(
      res => {
        this.setState({
          showMain: true,
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          this.setState({
            coupon: result.data.coupon,
            explain: result.data.explain,
            log_list: result.data.log_list,
            other_coupon: result.data.other_coupon,
            shareMessage: result.data.share
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.logo}`
            this.$setSharePath = () => `/pages/orderRedPacket/index?rpid=${this.state.rpid}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.logo}`,
              path: `/pages/orderRedPacket/index?rpid=${this.state.rpid}`,
              desc: `${this.state.shareMessage.desc}`
            })
          })
        } else {
          Taro.showToast({
            title: result.msg,
            mask: true,
            icon: 'none'
          });
        }
      }
    )
  }
  goHome() {
    Taro.redirectTo({
      url: `/pages/index/index`
    })
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
  // $setSharePath = () => `/pages/orderRedPacket/index?id=${this.state.rpid}`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.logo}`

  render() {
    const { showMain, coupon, explain, log_list, other_coupon, rpid } = this.state
    return (
      <View>
        {showMain
          ? <View className='OrderRedPacket'>
            <Navbar bgColor='#1E3468' />
            <Image src={homeIcon} className='homeIcon' onClick={this.goHome.bind(this)} />
            <Image src={banner} className='banner' mode='widthFix' />
            <View className='main'>
              <View className='title'>FDG送你手气大红包，福利已放入您的卡包</View>
              {!coupon
                ? <View className='packet-view'>
                  <Image src={redpacket} className='redpacket' />
                  <View className='coupon-empty'>你来晚啦，红包已被抢光啦</View>
                </View>
                : <View className='packet-view'>
                  <Image src={redpacket} className='redpacket' />
                  <View className='packet-left'>
                    <View className='info'>
                      <View className='info-left'>
                        <View>{coupon.couponname}</View>
                        <View className='man'>{coupon.enough}</View>
                      </View>
                      <View className='money'>￥{coupon.deduct}</View>
                    </View>
                    <View className='time'>{coupon.time}</View>
                  </View>
                  <View className='packet-right'>
                    <Image src={btn1} className='btn' onClick={this.goHome.bind(this)} />
                  </View>
                </View>
              }
              <View className='block-title'>
                <Text className='txt'>其他福利</Text>
              </View>
              {
                other_coupon.map((item) => {
                  return (
                    <View className='coupon-view' key={item}>
                      <Image src={couponBg} className='couponBg' />
                      <View className='coupon-info'>
                        <View className='coupon-left'>
                          <View className='coupon-type'>{item.couponname}</View>
                          <View className='coupon-man'>{item.enough}</View>
                        </View>
                        <View className='coupon-money'>￥{item.deduct}</View>
                      </View>
                      <View className='coupon-time'>{item.time}</View>
                    </View>
                  )
                })
              }
            </View>
            <View className='receive-list'>
              <View className='block-title'>
                <Text className='txt'>看看大家的手气</Text>
              </View>
              {
                log_list.map((item) => {
                  return (
                    <View className='list' key={item}>
                      <Image src={item.avatar} className='thumb' />
                      <View className='receive-info'>
                        <View className='user'>
                          <Text className='item-left'>{item.nickname}</Text>
                          <Text className='item-right'>￥{item.price}</Text>
                        </View>
                        <View className='time-view'>
                          <Text className='time'>{item.get_time}</Text>
                          {
                            item.is_big == 1 &&
                            <Text className='best'>手气最佳</Text>
                          }
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
            <View className='rule-view'>
              <View className='block-title'>
                <Text className='txt'>活动规则</Text>
              </View>
              {
                explain.map((item) => {
                  return (
                    <View className='txt' key={item}>{item}</View>
                  )
                })
              }
            </View>
            {
              rpid && <Button className='share' open-type="share" onClick={this.shareBtnClick.bind(this)}>分享给好友</Button>
            }
          </View>
          : <Loading show={this.state.loadingShow}  title='加载中' />
        }
      </View>
    )
  }
}

export default OrderRedPacket;
