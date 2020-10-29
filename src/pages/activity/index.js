import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Loading from '../../components/loading'
import Empty from './../../components/empty'
import HotArea from './../../components/hotArea'
import withToken from '../../utils/withToken'
import withShare from '../../utils/withShare'
import shareConfig from '../../utils/share'
import bindParent from '../../utils/bindParent'
import Request from '../../utils/request';
import { api } from '../../utils/api';

import DefaultSwiperGroups from '../../components/shopDecoration/defaultSwiperGroups'
import DefaultGoodGroups from '../../components/shopDecoration/defaultGoodGroups'
import ImageScrollGroups from '../../components/shopDecoration/imageScrollGroups'
import SwiperGroups from '../../components/shopDecoration/swiperGroups'
import CouponGroups from '../../components/shopDecoration/couponGroups'
import GoodScrollGroups from '../../components/shopDecoration/goodScrollGroups'
import TabGroups from '../../components/shopDecoration/tabGroups'

import './index.less'

@withToken()
@withShare()

class activityIndex extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      data: [],
      ready: false,
      loadingShow: true,
    }
  }
  config = {
    navigationBarTitleText: ''
  }

  componentWillMount() { }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    const that = this
    Request.post(api.diypages, {
      id: this.$router.params.id
    }).then(
      res => {
        this.setState({
          ready: true,
          loadingShow: false
        })
        const result = res.data
        that.setState({
          data: result.data.data
        })
        if (process.env.TARO_ENV === 'h5') {
          document.title = result.data.title || 'FDG滴蕉蕉'
        } else if (process.env.TARO_ENV === 'weapp') {
          Taro.setNavigationBarTitle({
            title: result.data.title || 'FDG滴蕉蕉'
          })
        }
      }
    )
    //分享
    Request.post(api.commonShare, {})
      .then(
        res => {
          const result = res.data.data;
          //小程序和h5分享
          this.$setShareTitle = () => `${result.title}`
          this.$setShareImageUrl = () => `${result.icon}`
          this.$setSharePath = () => `/pages/activity/index?id=${this.$router.params.id}`
          shareConfig({
            title: `${result.title}`,
            imageUrl: `${result.icon}`,
            path: `/pages/activity/index?id=${this.$router.params.id}`,
            desc: `${result.desc}`
          })
        }
      )
  }

  render() {
    const { data, ready } = this.state
    return (
      <View className='activityIndex'>
        <Navbar />
        <Menu />
        <Loading show={this.state.loadingShow} title='' />
        <View className='paper-contant'>
          {
            data.length === 0 && ready
              ? <Empty title='暂无内容' />
              : <View className='scroll-view'>
                {
                  data.map((item, index) => {
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
                }
              </View>
          }
        </View>
      </View>
    )
  }
}

export default activityIndex;