import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import { AtLoadMore } from 'taro-ui'
import './index.less'

class Recommend extends Component {
  config = {
    navigationBarTitleText: '今日推荐'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      page: 1,
      loadStatus: 'loading',
      banner: []
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Request.post(api.disRecommendBanner, {}).then(
      res => {
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            banner: result.data.banner,
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
    this.loadList()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loadList() {
    Request.post(api.disRecommendList, {
      page: this.state.page,
    }).then(
      res => {
        const result = res.data
        const list = result.data.list
        if (result.code === 0) {
          if (list.length === 0) {
            this.setState({
              loadStatus: 'noMore'
            })
            return;
          }
          this.setState({
            list: this.state.list.concat(list),
            loadStatus: 'loading'
          })
          if (list.length == parseInt(result.data.total)) {
            this.setState({
              loadStatus: 'noMore'
            })
          }
        } else {
          Taro.showToast({
            title: result.msg,
          })
        }
      }
    )
  }
  loadMore = () => {
    if (this.state.loadStatus == 'noMore') {
      return
    }
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this.loadList()
    })
  }
  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  render() {
    const { banner, list, loadStatus } = this.state
    return (
      <View className='Recommend'>
        <Navbar />
        <Menu />
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          onScrollToLower={this.loadMore}>
          <Swiper
            className='swiper'
            circular
            indicatorDots
            autoplay>
            {
              banner.map((item) => {
                return (
                  <SwiperItem key={item.id}>
                    <Image src={item.thumb} className='banner' />
                  </SwiperItem>
                )
              })
            }
          </Swiper>
          {
            list.map((item) => {
              return (
                <View className='recommend-list' key={item.id}>
                  <Image src={item.thumb} className='goods-pic' />
                  <View className='goods-info'>
                    <View className='title'>推荐理由</View>
                    <View className='reason'>{item.subtitle}</View>
                    <View className='goods-name'>{item.title}</View>
                    <View className='goods-price'>￥{item.productprice}</View>
                    <View className='buy-view'>
                      <Text className='num'>已售{item.sales}件</Text>
                      <View className='buy-btn' onClick={this.goodsDetail.bind(this, item.id)}>立即抢购</View>
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

export default Recommend;
