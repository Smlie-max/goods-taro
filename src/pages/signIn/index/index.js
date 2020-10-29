import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtSwitch } from 'taro-ui'
import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import Like from '../../../components/like';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import icon from '../images/sign-icon.png'
import tag from '../images/tag.png'
import open from '../images/open.png'
import couponBg from '../../../images/new-coupon-bg.png'
import calendarBg from '../images/calendar.png'
import './index.less'

class SignIn extends Component {
  config = {
    navigationBarTitleText: '每日签到'
  }
  constructor() {
    super(...arguments)
    this.state = {
      banner_bg: '',
      calendar: [],
      showAll: false,
      this_week: [],
      couponList: [],
      advImg: '',
      signinfo: {},
      today_credit: '',
      credit1: '',
      is_remind: '0'
    }
  }

  componentDidMount() {
    this.getIndex()
  }

  getIndex() {
    Request.post(api.signIndex, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            banner_bg: result.data.head_thumb,
            calendar: result.data.calendar,
            couponList: result.data.couponList,
            advImg: result.data.bottom_thumb,
            signinfo: result.data.signinfo,
            credit1: result.data.credit1,
            is_remind: result.data.is_remind
          }, () => {
            this.state.calendar.map((item) => {
              item.map((list) => {
                if (list.today === 1) {
                  this.setState({
                    this_week: item,
                    today_credit: list.credit
                  })
                }
              })
            })
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
  signIn() {
    const that = this
    Request.post(api.signIn, {}).then(
      res => {
        const result = res.data;
        Taro.showModal({
          title: '提示',
          content: result.msg,
          showCancel: false
        })
          .then(res => {
            if (res.confirm) {
              that.getIndex()
            }
          })
      }
    )
  }
  showAll() {
    this.setState({
      showAll: !this.state.showAll
    })
  }
  linkTo() {
    Taro.navigateTo({
      url: '/pages/pointsMall/pointsMall/index'
    })
  }
  jumpToDetail(id) {
    Taro.navigateTo({
      url: `/pages/pointsMall/productDetail/index?id=${id}`
    })
  }
  //开启通知
  changeRemind() {
    const is_remind = this.state.is_remind
    Request.post(api.signRemind, {}).then(
      res => {
        const result = res.data;
        Taro.showToast({
          title: result.msg,
          icon: 'none',
          duration: 2000
        })
        if (result.code === 0) {
          this.setState({
            is_remind: is_remind === '0' ? '1' : '0'
          })
        }
      }
    )
  }
  render() {
    const {
      banner_bg,
      calendar,
      showAll,
      this_week,
      couponList,
      advImg,
      signinfo,
      today_credit,
      credit1,
      is_remind
    } = this.state
    return (
      <View className='SignIn'>
        <Navbar />
        <Menu />
        <View className='banner'>
          <Image src={banner_bg} className='banner_bg' />
          <View className='top'>
            <View className='my-integral' onClick={this.linkTo}>
              <Image src={icon} className='icon' />
              <Text>我的积分：{credit1} > </Text>
            </View>
            <View className='notice'>
              <Text className='tip'>签到提醒</Text>
              <AtSwitch
                border={false}
                title=''
                className='my-switch'
                checked={is_remind === '0' ? false : true}
                onChange={this.changeRemind.bind(this)}
              />
            </View>
          </View>
          {
            signinfo.signed === 0
              ? <View>
                <View className='sign-btn' onClick={this.signIn.bind(this)}>签到</View>
                <View className='tips'>
                  <View>今日签到可领{today_credit}积分</View>
                  <View>连续签到可领更多</View>
                </View>
              </View>
              :
              <View>
                <View className='calendar-day'>
                  <Image src={calendarBg} className='calendarBg' />
                  <View className='orderday'>
                    <Text className='counts'>{signinfo.orderday}</Text>
                    <Text>天</Text>
                  </View>
                </View>
                <View className='tips'>
                  <View>今日已签到</View>
                  <View>明日签到可领{signinfo.next_credit}积分</View>
                </View>
              </View>

          }
        </View>
        <View className='calendar'>
          {
            showAll &&
            calendar.map((item) => {
              return (
                <View className='row' key={item}>
                  {
                    item.map((list) => {
                      return (
                        <View className='day-view' key={list}>
                          {
                            list.day != 0 &&
                            <View>
                              <View className='integral'>
                                <View className='num'>+{list.credit}</View>
                                {
                                  list.signed === 1 &&
                                  <Image className='tag' src={tag} />
                                }
                              </View>
                              {
                                list.today === 0
                                  ? <View className='day'>{list.month}.{list.day}</View>
                                  : <View className='day'>今日</View>
                              }
                            </View>
                          }
                        </View>
                      )
                    })
                  }
                </View>
              )
            })
          }
          {
            !showAll &&
            <View>
              <View className='row'>
                {
                  this_week.map((list) => {
                    return (
                      <View className='day-view' key={list}>
                        {
                          list.day != 0 &&
                          <View>
                            <View className='integral'>
                              <View className='num'>+{list.credit}</View>
                              {
                                list.signed === 1 &&
                                <Image className='tag' src={tag} />
                              }
                            </View>
                            {
                              list.today === 0
                                ? <View className='day'>{list.month}.{list.day}</View>
                                : <View className='day'>今日</View>
                            }
                          </View>
                        }
                      </View>
                    )
                  })
                }
              </View>
            </View>
          }
          <Image src={open} className={showAll ? 'open roate' : 'open'} onClick={this.showAll.bind(this)} />
        </View>
        {
          couponList.length > 0 &&
          <View className='coupon-view'>
            <View className='en'>COUPON REDEMPTION</View>
            <View className='cn'>优惠券兑换</View>
            <View className='coupon-list'>
              {
                couponList.map((item) => {
                  return (
                    <View className='list' key={item.id} onClick={this.jumpToDetail.bind(this, item.id)}>
                      <Image className='couponBg' src={couponBg}></Image>
                      <View className='num'>￥{item.price}</View>
                      <View className='enough'>{item.enough_str}</View>
                      <View className='type'>{item.credit_str}</View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        }
        <View className='adv' onClick={this.linkTo}>
          <Image className='adv-img' src={advImg} mode='widthFix' />
        </View>
        <Like />
      </View>
    )
  }
}

export default SignIn;
