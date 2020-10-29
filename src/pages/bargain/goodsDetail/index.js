import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import ParseComponent from '../../../components/wxParse';
import { getLoginAndLabel } from '../../../utils/common'

import title from '../images/title.png'
import ruleIcon from '../images/icon1.png'
import './index.less'

class BargainGoodsDetail extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      bannerList: [],
      info: {},
      bannerHeight: 250,
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.bargainDetail, {
      bgid: this.$router.params.bgid
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        this.setState({
          info: result.data,
          bannerList: result.data.thumb_url
        })
      }
    )
  }

  //发起砍价
  startBargian() {
    getLoginAndLabel().then((res) => {
      if (!res) return
      Taro.showLoading({
        title: '请求中'
      })
      Request.post(api.bargainDetail, {
        bgid: this.state.info.bgid,
        // bgid: 2,
        is_bargain: 1
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          if (result.code === 0) {
            Taro.navigateTo({
              url: `/pages/bargain/bargainDetail/index?bpid=${result.data.bpid}`
            })
          } else {
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      )
    })
  }
  //直接购买
  addOrder() {
    getLoginAndLabel().then((res) => {
      if (!res) return
      Taro.navigateTo({
        url: `/pages/orderPreview/index?is_cart=0&id=${this.state.info.goods_id}&optionid=''&total=1`
      })
    })
  }
  //活动规则
  activeRule() {
    Taro.navigateTo({
      url: `/pages/article/index?type=1`
    })
  }
  //图片自适应
  imageLoad(e) {
    if (process.env.TARO_ENV === 'h5') {
      this.setState({
        bannerHeight: 'auto'
      })
    } else if (process.env.TARO_ENV === 'weapp') {
      const res = Taro.getSystemInfoSync();
      const imgwidth = e.detail.width
      const imgheight = e.detail.height
      const ratio = imgwidth / imgheight
      this.setState({
        bannerHeight: res.screenWidth / ratio + 'px'
      })
    }
  }
  render() {
    const { info, bannerList, bannerHeight } = this.state
    const style = `height:${bannerHeight}`
    return (
      <View className='BargainGoodsDetail'>
        <Navbar />
        <Menu />
        <Swiper
          className='swiper'
          circular
          autoplay
          style={style}
        >
          {
            bannerList.map((item) => {
              return (
                <SwiperItem key={item}>
                  <Image src={item} className='banner' mode='widthFix' onload={this.imageLoad.bind(this)} />
                </SwiperItem>
              )
            })
          }
        </Swiper>
        <View className='goods-title'>{info.title}</View>
        <View className='people'>
          <View className='desc'>{info.subtitle}</View>
          <View className='num'>{info.success_times} 人成功砍价</View>
        </View>
        <View className='price-view'>
          <View>底价 ￥{info.end_price}</View>
          <View className='yj'>￥{info.marketprice}</View>
        </View>
        <Image src={title} className='title-pic' mode='widthFix' />
        <View className='content'>
          {
            (process.env.TARO_ENV === 'weapp' && info.content) &&
            <ParseComponent parseData={info.content} />
          }
          {
            (process.env.TARO_ENV === 'h5' && info.content)
              ? <View className='h5Parse'>
                <View dangerouslySetInnerHTML={{ __html: info.content }} />
              </View>
              : ('')
          }
        </View>
        <View className='tabbar'>
          <View className='tab buy' onClick={this.addOrder.bind(this)}>
            <Text>￥{info.marketprice} 直接购买</Text>
          </View>
          <View className='tab' onClick={this.startBargian.bind(this)}>
            <Text>我要砍</Text>
          </View>
        </View>

        {/*规则*/}
        <View className='rule' onClick={this.activeRule.bind(this)}>
          <Image src={ruleIcon} className='ruleIcon' />
          <Text>活动规则</Text>
        </View>
      </View>
    )
  }
}

export default BargainGoodsDetail;
