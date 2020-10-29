import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, } from '@tarojs/components'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import cartIcon from '../../../images/car.png'
import refresh from '../images/refresh.png'
import line from '../images/line.png'

import './index.less'

class DiscoverMood extends Component {
  static options = {
    addGlobalClass: true
  }
  config = {
    navigationBarTitleText: '你的心情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      refreshing: false,
      detail: ''
    }
    this.refreshClick = this.refreshClick.bind(this)
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }
  componentDidMount() {
    this.getDetail(this.$router.params.id)
  }

  refreshClick() {
    this.setState({
      refreshing: !this.state.refreshing
    })
    this.getDetail(this.state.id)
  }
  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }
  //获取详情
  getDetail(id) {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.moodDetail, {
      id: id
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code == 0) {
          this.setState({
            detail: result.data,
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
  render() {
    const { refreshing, detail } = this.state
    return (
      <View className='DiscoverMood'>
        <Navbar />
        <Menu />
        {/* 背景图start */}
        <Image src={detail.image} className='bg' />
        {/* 背景图end */}
        {
          detail &&
          <View className='mood-words'>
            <Text className='words'>{detail.title}</Text>
          </View>
        }
        {
          detail.image &&
          <View className='mood-img'>
            <Image src={detail.image} className='moodImg' mode='widthFix' />
            <View className='mood-title'>
              <View className='title'>
                <View className='cn'>{detail.txt.cn_txt}</View>
                <View className='en'>{detail.txt.en_txt}</View>
              </View>
              <Image
                src={refresh}
                className={refreshing ? 'refresh refreshing' : 'refresh'}
                onClick={this.refreshClick.bind(this)}
              />
            </View>
          </View>
        }
        {/* 心情好物 */}
        {
          detail.goods_list &&
          detail.goods_list.length &&
          <View className='good-mood'>
            <View className='en-title'>GOOD MOOD</View>
            <View className='cn-title'>
              <Image className='line' src={line} />
              <Text>心情好物</Text>
            </View>
            <View className='goods-list'>
              {
                detail.goods_list.map((item) => {
                  return (
                    <View className='GoodsBlock' key={item.id} onClick={this.goodsDetail.bind(this, item.id)} >
                      <View className='pic-view'>
                        <Image src={item.thumb} className='img' />
                      </View>
                      <View className='title'>{item.title}</View>
                      <View className='bottom-view'>
                        <View className='price-view'>
                          <View className='xian'>¥ {item.marketprice}</View>
                          <View className='yuan'>¥ {item.productprice}</View>
                        </View>
                        <Image src={cartIcon} className='cartIcon' />
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        }
      </View>
    )
  }
}

export default DiscoverMood;
