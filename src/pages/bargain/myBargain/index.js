import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtCountdown, AtLoadMore } from 'taro-ui'
import Menu from '../../../components/menu'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import rightIcon from '../../../images/choose-right.png'
import './index.less'
import Empty from '../../../components/empty';

class MyBargain extends Component {
  config = {
    navigationBarTitleText: '我发起的'
  }
  constructor() {
    super(...arguments)
    this.state = {
      ready: false,
      list: [],
      status: '0', //砍价状态 0--砍价中 1--砍价成功 2--砍价失败
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }

  componentDidShow() {
    this.getList()
  }

  goodsDetail(bpid) {
    Taro.navigateTo({
      url: `/pages/bargain/bargainDetail/index?bpid=${bpid}`
    })
  }

  changeTab(status) {
    this.setState({
      status: status
    }, () => {
      this.getList()
    })
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.myBargain, {
        page: this.page,
        status: this.state.status
      }).then(
        res => {
          this.setState({
            ready: true
          })
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
      Request.post(api.myBargain, {
        page: this.page,
        status: this.state.status
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

  render() {
    const { status, list, loadStatus, ready } = this.state
    return (
      <View className='MyBargain'>
        <Menu />
        <View className='navbar-view'>
          <View className={status === '0' ? 'navbar-bar active' : 'navbar-bar'}>
            <Text onClick={this.changeTab.bind(this, '0')}>砍价中</Text>
          </View>
          <View className={status === '1' ? 'navbar-bar active' : 'navbar-bar'}>
            <Text onClick={this.changeTab.bind(this, '1')}>砍价成功</Text>
          </View>
          <View className={status === '2' ? 'navbar-bar active' : 'navbar-bar'}>
            <Text onClick={this.changeTab.bind(this, '2')}>砍价失败</Text>
          </View>
        </View>
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.getMoreList.bind(this)}
        >
          {
            list.length === 0 && ready
              ? <Empty title='暂无内容' />
              : <View className='list-view'>
                {
                  list.map((item) => {
                    return (
                      <View className='block' onClick={this.goodsDetail.bind(this, item.bpid)} key={item.bpid}>
                        <View className='status-view'>
                          <View className='status-left'>
                            {
                              item.status === '0' &&
                              <View>
                                <Text className='status-txt1'>砍价距结束还剩</Text>
                                <AtCountdown
                                  format={{ hours: ':', minutes: ':', seconds: '' }}
                                  hours={Number(item.endtime[0])}
                                  minutes={Number(item.endtime[1])}
                                  seconds={Number(item.endtime[2])}
                                  isCard
                                />
                              </View>
                            }
                            {
                              item.status === '1' && <Text className='status-txt2'>砍价成功</Text>
                            }
                            {
                              item.status === '2' && <Text className='status-txt3'>砍价失败</Text>
                            }
                          </View>
                          <Image src={rightIcon} className='rightIcon' />
                        </View>
                        <View className='goods-view'>
                          <Image className='goods-pic' src={item.thumb} />
                          <View className='goods-info'>
                            <View className='goods-top'>
                              <View className='goods-title'>{item.title}</View>
                              <View className='goods-price'>{item.is_order == '0' ? '当前价' : '成交价'} ￥{item.now_price}</View>
                            </View>
                            <View className='goods-bottom'>
                              <Text className='yuan'>￥{item.marketprice}</Text>
                              <Text className='kan'>已砍 ￥{item.bargain_price}</Text>
                            </View>
                          </View>
                        </View>
                        {
                          item.status !== '2' && item.is_order == 0
                            ? <View className='btn-view'>
                              { item.status !== '1' &&　<View className='btn'>找人帮砍</View>　}
                              <View className='btn buy'>立即购买</View>
                            </View>
                            : <View />
                        }
                      </View>
                    )
                  })
                }
                <AtLoadMore
                  status={loadStatus}
                  moreText='上拉加载更多'
                />
              </View>
          }
        </ScrollView>
      </View>
    )
  }
}

export default MyBargain;
