import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import { getLoginStatus } from '../../utils/common'

import s1 from '../../images/service1-icon.png';
import s2 from '../../images/service2-icon.png';
import s3 from '../../images/service3-icon.png';
import s4 from '../../images/service4-icon.png';
import s5 from '../../images/service5-icon.png';
import s6 from '../../images/service6-icon.png';
import s7 from '../../images/service7-icon.png';
import s8 from '../../images/service8-icon.png';
import s9 from '../../images/service9-icon.png';
import s10 from '../../images/service10-icon.png';
import s11 from '../../images/service11-icon.png';
import s12 from '../../images/service12-icon.png';
import userBg from '../../images/user-bg.png';
import settingIcon from '../../images/setting-icon.png';
import messageIcon from '../../images/message-icon.png';
import memberCard from '../../images/member-center.png';
import thumb from '../../images/thumb.png';
import order1 from '../../images/order1.png';
import order2 from '../../images/order2.png';
import order3 from '../../images/order3.png';
import order4 from '../../images/order4.png';
import order5 from '../../images/order5.png';
import discover from '../../images/discover.jpg';
import './index.less'
import { prototype } from 'events';

class User extends Component {

  config = {
    navigationBarTitleText: '我的'
  }
  constructor() {
    super(...arguments)
    this.state = {
      is_login: false,
      memberInfo: {},
      orderInfo: {},
      serviceList: [
        {
          id: 1,
          value: '优惠券',
          icon: s1,
          type: 'coupon'
        },
        {
          id: 2,
          value: '每日签到',
          icon: s2,
          type: 'signIn/index'
        },
        {
          id: 3,
          value: '我的拼团',
          icon: s3,
          type: 'groups/groups'
        },
        {
          id: 4,
          value: '心享礼',
          icon: s4,
          type: 'gift/giftList'
        },
        {
          id: 5,
          value: '限时闪购',
          icon: s5,
          type: 'discount/discount'
        },
        {
          id: 6,
          value: '砍价活动',
          icon: s6,
          type: 'bargain/bargain'
        },
        {
          id: 7,
          value: '我的关注',
          icon: s7,
          type: 'follow'
        },
        {
          id: 8,
          value: '我的足迹',
          icon: s8,
          type: 'record'
        },
        {
          id: 9,
          value: '积分商城',
          icon: s3,
          type: 'pointsMall/pointsMall'
        },
        {
          id: 10,
          value: '领券中心',
          icon: s10,
          type: 'couponCenter'
        }
      ],
    }
  }
  componentWillMount() {
    // 微信加上客服按钮，h5不加
    if (process.env.TARO_ENV === 'weapp') {
      this.setState({
        serviceList: this.state.serviceList.concat({
          id: 11,
          value: '联系客服',
          icon: s12,
          type: 'customerService'
        })
      })
    }
  }

  componentDidMount() { }

  componentDidShow() {
    this.getMemberInfo()
    const is_login = getLoginStatus()
    this.setState({
      is_login: is_login
    })
  }

  getMemberInfo() {
    Request.post(api.memberIndex, {}).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          this.setState({
            memberInfo: result.data.member,
            orderInfo: result.data.statics
          })
        }
      }
    )
  }

  linkRouter(url, status) {
    if (this.state.is_login) {
      if (url === 'member') {
        Taro.navigateTo({
          url: `/pages/member/index?id=${this.state.memberInfo.plus_id}`
        })
      } else if (url === 'order') {
        Taro.navigateTo({
          url: '/pages/' + url + '/index?status=' + status
        })
      } else if (url === 'customerService') {
        return
      } else {
        Taro.navigateTo({
          url: `/pages/${url}/index`
        })
      }
    } else {
      Taro.navigateTo({
        url: `/pages/login/index`
      })
    }
  }

  render() {
    const { serviceList, memberInfo, orderInfo, is_login } = this.state
    return (
      <View className='UserIndex'>
        <Navbar />
        <Menu />
        <View className='user-info'>
          <Image src={userBg} className='user-bg' />
          <Image src={memberCard} className='member-card' onClick={this.linkRouter.bind(this, 'member')} />
          <View className='top-btn-view'>
            <Image src={settingIcon} className='top-btn-icon' onClick={this.linkRouter.bind(this, 'setting')} />
            <Image src={messageIcon} className='top-btn-icon' onClick={this.linkRouter.bind(this, 'notice')} />
          </View>
          <View className='level-view'>
            <View className='level-name'>
              {!is_login
                ? <View onClick={this.linkRouter.bind(this)}>登录 > </View>
                : ('')
              }
            </View>
            <View className='wallet'>
              <View className='balance' onClick={this.linkRouter.bind(this, 'recharge')}>
                余额 {memberInfo.credit2}
              </View>
              <View className='integral' onClick={this.linkRouter.bind(this, 'pointsMall/pointsMall')}>
                积分 {memberInfo.credit1}
              </View>
            </View>
          </View>

          <View className='user'>
            <View className='thumb-view'>
              <View className='nickname'>{is_login ? memberInfo.nickname : '游客'}</View>
              <Image src={is_login ? memberInfo.avatar : thumb} className='thumb' />
            </View>
            <View className='autograph'>{memberInfo.desc}</View>
          </View>
        </View>
        <View className='user-my-order'>
          <View className='order-top'>
            <View className='title'>我的订单</View>
            <View className='all' onClick={this.linkRouter.bind(this, 'order', '-2')}>查看全部</View>
          </View>
          <View className='list'>
            <View className='item' onClick={this.linkRouter.bind(this, 'order', 0)}>
              <Image src={order1} className='order-icon' />
              <Text>待付款</Text>
              {orderInfo.order_0 > 0 &&
                <Text className='num'>{orderInfo.order_0}</Text>
              }
            </View>
            <View className='item' onClick={this.linkRouter.bind(this, 'order', 1)}>
              <Image src={order2} className='order-icon' />
              <Text>待发货</Text>
              {orderInfo.order_1 > 0 &&
                <Text className='num'>{orderInfo.order_1}</Text>
              }
            </View>
            <View className='item' onClick={this.linkRouter.bind(this, 'order', 2)}>
              <Image src={order3} className='order-icon' />
              <Text>待收货</Text>
              {orderInfo.order_2 > 0 &&
                <Text className='num'>{orderInfo.order_2}</Text>
              }
            </View>
            <View className='item' onClick={this.linkRouter.bind(this, 'order', 3)}>
              <Image src={order4} className='order-icon' />
              <Text>待评价</Text>
              {orderInfo.order_3 > 0 &&
                <Text className='num'>{orderInfo.order_3}</Text>
              }
            </View>
            <View className='item' onClick={this.linkRouter.bind(this, 'afterSale/afterSaleList')}>
              <Image src={order5} className='order-icon' />
              <Text>售后</Text>
              {orderInfo.order_4 > 0 &&
                <Text className='num'>{orderInfo.order_4}</Text>
              }
            </View>
          </View>
        </View>
        <View className='line'></View>
        <Image src={discover} mode='widthFix' style='width:100%;display:block' onClick={this.linkRouter.bind(this, 'discover/index')} />
        <View className='line'></View>
        <View className='service-view'>
          <View className='title'>我的服务</View>
          <View className='service-list'>
            {
              serviceList.map((item) => {
                return (
                  <View className='item-list' key={item.id}>
                    <Button
                      className='item'
                      onClick={this.linkRouter.bind(this, item.type)}
                      open-type={item.type === 'customerService' ? 'contact' : ''}
                    >
                      <Image src={item.icon} className='icon' />
                      <Text>{item.value}</Text>
                    </Button>
                  </View>
                )
              })
            }
            {
              memberInfo.commission
                ? <View className='item-list'>
                  <Button
                    className='item'
                    onClick={this.linkRouter.bind(this, 'commission/home')}
                  >
                    <Image src={s9} className='icon' />
                    <Text>分销中心</Text>
                  </Button>
                </View>
                : ('')
            }
          </View>
        </View>
      </View>
    )
  }
}

export default User
