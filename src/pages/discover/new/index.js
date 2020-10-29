import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import GoodsBlock from '../components/goodsBlock'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import line from '../images/line.png'
import './index.less'

class DiscoverNew extends Component {
  config = {
    navigationBarTitleText: '上新'
  }
  constructor() {
    super(...arguments)
    this.state = {
      banner: [],
      adv: [],
      brand: [],
      new_goods: []
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Request.post(api.discoverNew, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            banner: result.data.banner,
            adv: result.data.adv,
            brand: result.data.brand,
            new_goods: result.data.new_goods
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

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { banner, adv, brand, new_goods } = this.state
    return (
      <View className='DiscoverNew'>
        <Navbar />
        <Menu />
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
        {/* 品牌上新 */}
        <View className='brand-new'>
          <View className='en-title'>BRAND NEW</View>
          <View className='cn-title'>
            <Image className='line' src={line} />
            <Text>品牌上新</Text>
          </View>
          <View className='brand-list'>
            {
              brand.map((item) => {
                return (
                  <View className='brand' key={item.id}>
                    <Image src={item.thumb} className='brand-bg' />
                    <View className='new-num'>
                      <Text className='title'>上新</Text>
                      {/* <Text>+10</Text> */}
                    </View>
                  </View>
                )
              })
            }
          </View>
          <View className='more'>查看更多</View>
        </View>
        {/* 每日上新 */}
        <View className='daily-new'>
          <View className='en-title'>DAILY NEW</View>
          <View className='cn-title'>
            <Image className='line' src={line} />
            <Text>每日上新</Text>
          </View>
          <Image src={adv.thumb} className='banner' mode='widthFix' />
          <View className='goods-list'>
            {
              new_goods.map((item) => {
                return (
                  <GoodsBlock data={item} key={item.id} />
                )
              })
            }
          </View>
          <View className='more'>查看更多</View>
        </View>
      </View>
    )
  }
}

export default DiscoverNew;
