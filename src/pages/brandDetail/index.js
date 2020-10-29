import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import { AtLoadMore } from 'taro-ui'
import HotArea from '../../components/hotArea'
import DefaultSwiperGroups from '../../components/shopDecoration/defaultSwiperGroups'
import DefaultGoodGroups from '../../components/shopDecoration/defaultGoodGroups'
import ImageScrollGroups from '../../components/shopDecoration/imageScrollGroups'
import SwiperGroups from '../../components/shopDecoration/swiperGroups'
import CouponGroups from '../../components/shopDecoration/couponGroups'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import withShare from '../../utils/withShare'
import withToken from '../../utils/withToken'
import bindParent from '../../utils/bindParent'
import shareConfig from '../../utils/share'

import cartIcon from '../../images/car.png'
import line from '../../images/line-bg.png'
import collect1 from '../../images/collect1.png';
import collect2 from '../../images/collect2.png';
import './index.less'

@withToken()
@withShare()

class BrandDetail extends Component {

  config = {
    navigationBarTitleText: '品牌'
  }
  constructor() {
    super(...arguments)
    this.state = {
      id: '', //品牌ID
      goodsList: [],
      loadStatus: 'loading',
      page: 1,
      total: 0,
      is_like: 0,
      shareMessage: {}, //分享信息
      detail: [],
    }
  }
  componentWillMount() { }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    this.setState({
      id: this.$router.params.id
    }, () => {
      this.getDetail()
      this.loadList()
    })
  }

  getDetail() {
    Request.post(api.brandDetail, {
      id: this.state.id
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          this.setState({
            detail: result.data.info,
            is_like: result.data.is_like,
            shareMessage: result.data.share_info
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.thumb}`
            this.$setSharePath = () => `/pages/brandDetail/index?id=${this.state.id}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.thumb}`,
              path: `/pages/brandDetail/index?id=${this.state.id}`,
              desc: `${this.state.shareMessage.description}`
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
  loadList() {
    Request.post(api.brandGoodsList, {
      id: this.state.id,
      page: this.state.page
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
            goodsList: this.state.goodsList.concat(list),
            loadStatus: 'loading',
            total: result.data.total
          })
          if (list.length === parseInt(result.data.total)) {
            this.setState({
              loadStatus: 'noMore'
            })
          }
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
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
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }
  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }
  //收藏品牌
  brandCollect() {
    Request.post(api.collectGoods, {
      brandid: this.state.id
    }).then(
      res => {
        const result = res.data
        const list = result.data.list
        Taro.showToast({
          title: result.msg,
          icon: 'none'
        })
        if (result.code === 0) {
          let is_like = this.state.is_like
          this.setState({
            is_like: !is_like
          })
        }
      }
    )
  }

  // $setSharePath = () => `/pages/brandDetail/index?id=${this.state.id}`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.thumb}`

  render() {
    const { detail, goodsList, total, is_like } = this.state
    return (
      <ScrollView
        className='BrandDetail'
        scrollY
        onScrollToLower={this.loadMore}>
        <Navbar />
        <Menu />
        <Image src={is_like ? collect2 : collect1} className='collect' onClick={this.brandCollect.bind(this)} />
        {
          detail.map((item) => {
            return (
              <View key={item.id}>
                {
                  item.id === 'banner' && <DefaultSwiperGroups data={item.data} />
                }
                {
                  item.id === 'goods' && <DefaultGoodGroups data={item.data} />
                }
                {
                  item.id === 'hotphoto' && <HotArea data={item.data} bgImg={item.imgurl} />
                }
                {
                  item.id === 'picturew' && <ImageScrollGroups data={item.list} />
                }
                {
                  item.id === 'coupon' && <CouponGroups data={item.data} />
                }
                {
                  item.id === 'pictures' && <SwiperGroups data={item.list} />
                }
              </View>
            )
          })
        }
        {
          goodsList.length > 0 &&
          <block>
            <View className='title-view'>
              <View className='en'>All PRODUCTS({total})</View>
              <View className='cn-view'>
                <View>全部商品({total})</View>
                <Image src={line} className='line' />
              </View>
            </View>
            <View className='list'>
              {
                goodsList.map((item) => {
                  return (
                    <View className='block' key={item.id} onClick={this.goodsDetail.bind(this, item.id)}>
                      <Image src={item.thumb} className='goods-pic' />
                      <View className='goods-name'>{item.title}</View>
                      <View className='bottom'>
                        <Text>￥{item.marketprice}</Text>
                        <Image src={cartIcon} className='cartIcon' />
                      </View>
                    </View>
                  )
                })
              }
            </View>
            <AtLoadMore
              status={loadStatus}
              moreText='上拉加载更多'
            />
          </block>
        }
      </ScrollView>
    )
  }
}

export default BrandDetail; 
