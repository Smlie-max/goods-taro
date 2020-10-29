import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import { AtLoadMore, AtProgress } from 'taro-ui'
import withShare from '../../utils/withShare'
import withToken from '../../utils/withToken'
import bindParent from '../../utils/bindParent'
import { getLoginAndLabel } from '../../utils/common'
import shareConfig from '../../utils/share'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import defaultImg from '../../images/fdg-logo.png'
import './index.less'

@withToken()
@withShare()

class CouponCenter extends Component {

  config = {
    navigationBarTitleText: '领券中心'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }
  componentWillMount() { }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    this.getList()
    Request.post(api.couponCenterShare, {})
      .then(
        res => {
          const result = res.data
          if (result.code === 0) {
            //小程序和h5分享
            this.$setShareTitle = () => `${result.data.title}`
            this.$setShareImageUrl = () => `${result.data.icon}`
            this.$setSharePath = () => `/pages/couponCenter/index?`
            shareConfig({
              title: `${result.data.title}`,
              imageUrl: `${result.data.icon}`,
              path: `/pages/couponCenter/index?`,
              desc: `${result.data.desc}`
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
  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.couponCenter, {
        page: this.page
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
      Request.post(api.couponCenter, {
        page: this.page
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
  //领取优惠券
  buyCoupon(id) {
    getLoginAndLabel().then((res) => {
      if (!res) return
      if (!id) return
      Taro.showLoading({
        title: '领取中'
      })
      Request.post(api.buyCoupon, {
        id: id,
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          if (result.code === 0) {
            Taro.showToast({
              title: '领取成功',
              mask: true
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

  render() {
    const { list, loadStatus } = this.state
    return (
      <View className='couponCenterView'>
        <Navbar />
        <Menu />
        <ScrollView
          className='CouponCenter'
          scrollY
          onScrollToLower={this.getMoreList.bind(this)}
        >
          {
            list.map((item) => {
              return (
                <View className='coupon' key={item.id}>
                  {
                    item.thumb === ''
                      ? <Image src={defaultImg} className='pic' />
                      : <Image src={item.thumb} className='pic' />
                  }
                  <View className='right'>
                    <View className='top'>
                      <View className='title'>{item.couponname}</View>
                      {
                        item.get_radio
                          ? <View className='percent-view'>
                            <View className='tips'>已领取{item.get_radio}%</View>
                            <AtProgress percent={item.get_radio} isHidePercent className='progress' />
                          </View>
                          : ''
                      }
                    </View>
                    <View className='bottom'>
                      <Text className='price'>¥ {item.deduct}</Text>
                      <Text className='enough'>{item.use_tips}</Text>
                      <Text className='btn' onClick={this.buyCoupon.bind(this, item.id)}>立即领取</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
          <AtLoadMore
            status={loadStatus}
            moreText='上拉加载更多'
          />
        </ScrollView>
      </View>
    )
  }
}

export default CouponCenter; 