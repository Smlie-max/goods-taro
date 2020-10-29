import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtCountdown, AtLoadMore } from 'taro-ui'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Empty from '../../../components/empty'

import withShare from '../../../utils/withShare'
import withToken from '../../../utils/withToken'
import bindParent from '../../../utils/bindParent'
import shareConfig from '../../../utils/share'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import rightIcon from '../images/rightIcon.png'
import './index.less'

@withToken()
@withShare()

class Discount extends Component {
  config = {
    navigationBarTitleText: '闪购专场'
  }
  constructor() {
    super(...arguments)
    this.state = {
      bannerHeight: 250,
      timeList: [],
      scrollLeft: 0,
      timeBlockWidth: 0,
      current: 0,
      advs: [],
      roomid: '',
      timeid: '',
      taskid: '',
      data: [],
      end_time: false, // 本场倒计时
      page: 1,
      loadStatus: 'loading',
      shareMessage: {},
    }
  }
  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          timeBlockWidth: res.windowWidth / 5,
          scrollLeft: 0
        }, () => {
          this.getIndexInfo()
        })
      }
    })
  }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
  }

  chooseTime(id, index) {
    let timeList = this.state.timeList
    timeList.map((item) => {
      item.status = -1
      if (item.id === id) {
        item.status = 0
        this.setState({
          scrollLeft: this.state.timeBlockWidth * index - this.state.timeBlockWidth * 2,
          roomid: timeList[index].roomid,
          timeid: timeList[index].id,
          taskid: timeList[index].taskid,
          data: [],
          loadStatus: 'loading',
          page: 1,
        }, () => {
          this.loadList()
        })
      }
    })
    // this.setState({
    //   scrollLeft: this.state.timeBlockWidth * index - this.state.timeBlockWidth * 2,
    //   current: index,
    //   roomid: this.state.timeList[index].roomid,
    //   timeid: this.state.timeList[index].id,
    //   taskid: this.state.timeList[index].taskid,
    //   data: [],
    //   loadStatus: 'loading',
    //   page: 1,
    //   showTime: index === 0 ? true : false
    // }, () => {
    //   this.loadList()
    // })
  }

  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }

  getIndexInfo() {
    const that = this
    //获取数据
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.discount, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code === 0) {
          // that.setState({
          //   end_time: result.data.end_time,
          //   timeList: result.data.times,
          //   advs: result.data.advs,
          // }, () => {
          //   that.loadList()
          // })
          const timeList = result.data.times
          timeList.map((item, index) => {
            if (item.status === 0) {
              this.setState({
                scrollLeft: this.state.timeBlockWidth * index - this.state.timeBlockWidth * 2,
                roomid: timeList[index].roomid,
                timeid: timeList[index].id,
                taskid: timeList[index].taskid,
                end_time: result.data.end_time,
                timeList: timeList,
                advs: result.data.advs,
                shareMessage: result.data.shopshare
              }, () => {
                this.loadList()
                //小程序和h5分享
                this.$setShareTitle = () => `${this.state.shareMessage.title}`
                this.$setShareImageUrl = () => `${this.state.shareMessage.imgUrl}`
                this.$setSharePath = () => `/pages/discount/discount/index?`
                shareConfig({
                  title: `${this.state.shareMessage.title}`,
                  imageUrl: `${this.state.shareMessage.imgUrl}`,
                  path: `/pages/discount/discount/index?`,
                  desc: `${this.state.shareMessage.desc}`
                })
              })
            }
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
          this.setState({
            timeList: []
          })
        }
      }
    )
  }
  loadList() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.discountIndexGoods, {
      page: this.state.page,
      taskid: this.state.taskid ? this.state.taskid : this.state.timeList[0].taskid, //专题ID
      roomid: this.state.roomid ? this.state.roomid : this.state.timeList[0].roomid,
      timeid: this.state.timeid ? this.state.timeid : this.state.timeList[0].id,
    }).then(
      res => {
        Taro.hideLoading()
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
            loadStatus: 'loading'
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
  // $setSharePath = () => `/pages/discount/discount/index?`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.imgUrl}`
  render() {
    const { scrollLeft, timeList, current, advs, end_time, data, bannerHeight, loadStatus } = this.state
    const bannerStyle = `height:${bannerHeight}`
    return (
      <View className='Discount'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <ScrollView
          className='time-scrollview'
          scrollX
          scrollLeft={scrollLeft}
          scrollWithAnimation
        >
          {
            timeList.map((item, index) => {
              const style = `color:${item.status === 0 ? '#fff' : '#647193'}`
              return (
                <View className='time-block' key={item.id} onClick={this.chooseTime.bind(this, item.id, index)} style={style}>
                  <View className='status'>{item.statusstr}</View>
                  <View>{item.time}</View>
                </View>
              )
            })
          }
        </ScrollView>
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.loadMore}
        >

          {data.length === 0
            ? <Empty title='暂无内容' />
            :
            <block>
              <View className='banner-view'>
                <Swiper
                  className='swiper'
                  circular
                  autoplay
                  style={bannerStyle}
                >
                  {
                    advs.map((item) => {
                      return (
                        <SwiperItem key={item.id}>
                          <Image src={item.thumb} mode='widthFix' className='banner' onload={this.imageLoad.bind(this)}></Image>
                        </SwiperItem>
                      )
                    })
                  }
                </Swiper>
                {
                  end_time &&
                  <View className='end-time'>
                    <View style='margin-bottom:10px'>本场结束还剩</View>

                    <AtCountdown
                      format={{ hours: ':', minutes: ':', seconds: '' }}
                      hours={Number(end_time[0])}
                      minutes={Number(end_time[1])}
                      seconds={Number(end_time[2])}
                      isCard
                    />
                  </View>
                }
              </View>
              <View className='goods-list'>
                {
                  data.map((item) => {
                    return (
                      <View className='goods-block' key={item.id}>
                        <View className='left'>
                          {
                            item.en_title && <View className='goods-title'>{item.en_title}</View>
                          }
                          <View className='goods-desc'>{item.title}</View>
                          <View className='discount-price-view'>
                            <Text>抢购价</Text>
                            <Text className='discount-price'>￥{item.price}</Text>
                            {
                              Number(item.total) !== 0 && <Text className='discount-num'>仅剩{item.total}件</Text>
                            }
                          </View>
                          <View className='price'>￥{item.productprice}</View>
                          <View className='btn-view' onClick={this.goodsDetail.bind(this, item.goodsid)}>
                            {
                              item.can_buy === 1 && Number(item.total) !== 0
                                ? <View style='display:flex;align-items:center'>
                                  <Image src={rightIcon} className='rightIcon' />
                                  <Text>马上抢</Text>
                                </View>
                                : ('')
                            }
                            {
                              item.can_buy === 1 && Number(item.total) === 0
                                ? <View className='no-total' style='color:#D73B3B'>已抢完</View>
                                : ('')
                            }
                            {
                              (item.can_buy === 0 && Number(item.total) !== 0)
                                ? < Text className='look'>抢先看</Text>
                                : ('')
                            }
                            {
                              item.can_buy === 0 && Number(item.total) === 0
                                ? <View className='no-total' style='color:#D73B3B'>库存不足</View>
                                : ('')
                            }
                          </View>
                        </View>
                        <Image src={item.thumb} className='goods-pic' />
                      </View>
                    )
                  })
                }
                <AtLoadMore
                  status={loadStatus}
                  moreText='上拉加载更多'
                />
              </View>
            </block>
          }
        </ScrollView>
      </View >
    )
  }
}

export default Discount;
