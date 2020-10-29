import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Empty from '../../../components/empty'
import { AtCountdown, AtLoadMore } from 'taro-ui'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import GoodsGroup from '../components/goodsGroup'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import withShare from '../../../utils/withShare'
import withToken from '../../../utils/withToken'
import shareConfig from '../../../utils/share'
import bindParent from '../../../utils/bindParent'

import './index.less'

@withToken()
@withShare()

class ProDiscount extends Component {

  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      data: [],
      page: 1,
      loadStatus: 'loading',
      id: '',
      typeid: '',
      info: {},
      shareMessage: {}
    }
  }
  componentWillMount() { }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    this.setState({
      id: this.$router.params.id,
      typeid: this.$router.params.typeid
    }, () => {
      this.loadList()
    })
  }

  loadList() {
    Request.post(api.marketing, {
      page: this.state.page,
      id: this.state.id,
      typeid: this.state.typeid,
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
            data: this.state.data.concat(list),
            info: result.data.info,
            shareMessage: result.data.share,
            loadStatus: 'loading'
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.icon}`
            this.$setSharePath = () => `/pages/promotional/discount/index?id=${this.state.id}&typeid=${this.state.typeid}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.icon}`,
              path: `/pages/promotional/discount/index?id=${this.state.id}&typeid=${this.state.typeid}`,
              desc: `${this.state.shareMessage.desc}`
            })
            if (process.env.TARO_ENV === 'h5') {
              document.title = this.state.shareMessage.title
            } else if (process.env.TARO_ENV === 'weapp') {
              Taro.setNavigationBarTitle({
                title: this.state.shareMessage.title
              })
            }
          })
          if (list.length === parseInt(result.data.total)) {
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
  }
  loadMore = () => {
    if (this.state.loadStatus === 'noMore') {
      return
    }
    this.setState({
      page: this.state.page + 1,
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }

  // $setSharePath = () => `/pages/promotional/discount/index?id=${this.state.id}&typeid=${this.state.typeid}`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.icon}`

  render() {
    const { data, loadStatus, info } = this.state
    return (
      <View className='ProDiscount'>
        <Navbar />
        <Menu />
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          onScrollToLower={this.loadMore}>
          <View className='banner-view'>
            {
              info.thumb
                ? <Image src={info.thumb} className='banner' mode='widthFix' />
                : <View className='noBanner'></View>
            }
            {
              info.end_time &&
              <View className='djs'>
                <AtCountdown
                  isShowDay
                  format={{ day: '天', hours: '时', minutes: '分', seconds: '秒' }}
                  day={Number(info.end_time[0])}
                  hours={Number(info.end_time[1])}
                  minutes={Number(info.end_time[2])}
                  seconds={Number(info.end_time[3])}
                  isCard
                />
              </View>
            }
          </View>
          {
            data.length > 0 ? (
              <View className='list-view'>
                <GoodsGroup data={data} />
                <AtLoadMore
                  status={loadStatus}
                  moreText='上拉加载更多'
                />
              </View>
            ) : (
                <Empty title='暂无内容' />
              )
          }
        </ScrollView>
      </View>
    )
  }
}

export default ProDiscount;