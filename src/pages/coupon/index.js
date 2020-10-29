import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Request from '../../utils/request'
import { api } from '../../utils/api'

import bg from '../../images/coupon-bg.png'
import bg1 from '../../images/coupon-bg1.png'
import used from '../../images/coupon-used.png'
import used1 from '../../images/coupon-used1.png'
import noCoupon from '../../images/no-coupon.png'
import './index.less'

class Coupon extends Component {

  config = {
    navigationBarTitleText: '我的优惠券'
  }
  constructor() {
    super(...arguments)
    this.state = {
      status: 0,//状态 0 -- 未使用 1-- 已使用 2 -- 已过期
      list: [],
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }
  tabClick(value) {
    this.setState({
      status: value
    }, () => {
      this.getList()
    })
  }
  componentWillMount() { }

  componentDidMount() {
    this.getList()
  }
  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.getCouponList, {
        page: this.page,
        status: this.state.status
      }).then(
        res => {
          const result = res.data
          if (result.code == 0) {
            this.page++;
            this.setState({
              list: result.data.list,
              loadStatus: 'more'
            })
            if (result.data.list.length == result.data.total) {
              this.setState({
                loadStatus: 'noMore'
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
    })
  }
  getMoreList() {
    if (this.state.loadStatus != 'more') {
      return false;
    }
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.getCouponList, {
        page: this.page,
        status: this.state.status
      }).then(
        res => {
          const result = res.data
          if (result.code == 0) {
            if (result.data.list.length == 0) { //没有更多数据
              this.setState({
                loadStatus: 'noMore'
              })
              return;
            }
            this.page++;
            const list = this.state.list
            this.setState({
              list: list.concat(result.data.list),
              loadStatus: 'more'
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
    })
  }
  //领券中心
  couponCenter() {
    Taro.navigateTo({
      url: '/pages/couponCenter/index'
    })
  }
  //立即使用
  useCoupon(limitgoodcateids, limitgoodids) {
    const limitgoodcateids1 = JSON.stringify(limitgoodcateids)
    Taro.navigateTo({
      url: `/pages/couponGoodsList/index?limitgoodcateids=${limitgoodcateids1}&limitgoodids=${limitgoodids}`
    })
  }
  render() {
    const { list, loadStatus, status } = this.state
    return (
      <View className='couponWrap'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <View className='navbar'>
          <Text className={status == 0 ? 'active btn' : 'btn'} onClick={this.tabClick.bind(this, 0)}>未使用</Text>
          <Text className={status == 1 ? 'active btn' : 'btn'} onClick={this.tabClick.bind(this, 1)}>已使用</Text>
          <Text className={status == 2 ? 'active btn' : 'btn'} onClick={this.tabClick.bind(this, 2)}>已失效</Text>
        </View>
        {
          list.length > 0
            ? <ScrollView
              className='scrollview'
              scrollY
              onScrollToLower={this.getMoreList.bind(this)}
            >
              {
                list.map((item) => {
                  return (
                    <View className='list' key={item.id}>
                      <Image className='bg' src={this.state.status === 0 ? bg : bg1}></Image>
                      <View className='top'>
                        <View className='left'>
                          <View className='money'>¥ {item.deduct}</View>
                          <View className='how' style='text-align:center'>{item.coupontype}</View>
                        </View>
                        <View className='right'>
                          <View className='use'>
                            <Text className='type'>{item.couponname}</Text>
                            {
                              this.state.status === 0 &&
                              <View className='btn' onClick={this.useCoupon.bind(this, item.limitgoodcateids, item.limitgoodids)}>立即使用</View>
                            }
                            {
                              this.state.status === 1 &&
                              <Image src={used} className='used'></Image>
                            }
                            {
                              this.state.status === 2 &&
                              <Image src={used1} className='used'></Image>
                            }
                          </View>
                          <View className='time'>
                            <Text>{item.starttime}</Text>
                            {
                              item.starttime && <Text>-</Text>
                            }
                            <Text>{item.endtime}</Text>
                          </View>
                        </View>
                      </View>
                      <View className='bottom'>{item.tips1}</View> 
                    </View>
                  )
                })
              }
              <AtLoadMore
                status={loadStatus}
                moreText='上拉加载更多'
              />
            </ScrollView>
            : <View className='noCouponMain'>
              <View className='no-coupon'>
                <Image src={noCoupon} className='noCoupon' />
                <View className='z2'>啊哦~您还未有优惠券</View>
                <View className='coupon-center' onClick={this.couponCenter.bind(this)}>去领券中心看看吧~</View>
              </View>
            </View>
        }
      </View>
    )
  }
}

export default Coupon; 