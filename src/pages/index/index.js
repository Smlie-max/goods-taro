import Taro, { Component } from '@tarojs/taro'
import { View, Img, Image } from '@tarojs/components'
import Loading from '../../components/loading'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import NewUserCoupon from '../../components/newUserCoupon'
import Empty from './../../components/empty'
import HotArea from './../../components/hotArea'
import withToken from '../../utils/withToken'
import withShare from '../../utils/withShare'
import bindParent from '../../utils/bindParent'
import shareConfig from '../../utils/share'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import DefaultSwiperGroups from '../../components/shopDecoration/defaultSwiperGroups'
import DefaultGoodGroups from '../../components/shopDecoration/defaultGoodGroups'
import ImageScrollGroups from '../../components/shopDecoration/imageScrollGroups'
import CouponGroups from '../../components/shopDecoration/couponGroups'
import SwiperGroups from '../../components/shopDecoration/swiperGroups'
import GoodScrollGroups from '../../components/shopDecoration/goodScrollGroups'
import TabGroups from '../../components/shopDecoration/tabGroups'
import './index.less'

@withToken()
@withShare()

class Index extends Component {
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      pageData: [],
      ready: false,
      loadingShow: true,
    }
  }

  componentWillMount() {

  }
  onLoad(e) {
  }
  
  componentDidShow() {

  }
  componentDidMount() {
    bindParent(this.$router.params.shareFromUser || decodeURIComponent(this.$router.params.scene)) //绑定
    const that = this
    Request.post(api.test, {
      nav_id: this.$router.params.id
    }).then(
      res => {
        that.setState({
          ready: true,
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          that.setState({
            pageData: result.data.list[0].items
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
        if (process.env.TARO_ENV === 'h5') {
          document.title = result.data.title || '首页'
        } else if (process.env.TARO_ENV === 'weapp') {
          Taro.setNavigationBarTitle({
            title: result.data.title || '首页'
          })
        }
      }
    )
    //分享
    Request.post(api.commonShare, {})
      .then(
        res => {
          const result = res.data.data
          //小程序和h5分享
          this.$setShareTitle = () => `${result.title}`
          this.$setShareImageUrl = () => `${result.icon}`
          this.$setSharePath = () => `/pages/index/index?id=${this.$router.params.id}`
          shareConfig({
            title: `${result.title}`,
            imageUrl: `${result.icon}`,
            path: `/pages/index/index?id=${this.$router.params.id}`,
            desc: `${result.desc}`
          })
        }
      )
  }

  render() {
    const { pageData, ready } = this.state
    return (
      <View className='indexPage'>
        <Navbar />
        <Menu />
        <NewUserCoupon />
        <Loading show={this.state.loadingShow} title='' />
        {
          pageData && pageData.length > 0
            ? pageData.map((item, index) => {
              return (
                <View key={`id${index}`}>
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
                  {
                    item.id === 'gpictures' && <GoodScrollGroups data={item.list} />
                  }
                  {
                    item.id === 'tabbar' && <TabGroups data={item.list} />
                  }
                </View>
              )
            })
            : <View />
        }
        {
          pageData.length <= 0 && ready
            ? <Empty title='暂无内容' />
            : <View />
        }
        
      </View >
    )
  }
}

export default Index