import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'

import Empty from '../../../components/empty'
import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import { AtLoadMore } from 'taro-ui'
import logo from '../images/gift-logo.png'
import './index.less'

class giftList extends Component {
  config = {
    navigationBarTitleText: '心享礼订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      gift_status: 1, //心享礼订单状态 1--待领取 2--待签收 3--已完成
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }
  componentWillMount() { }

  componentDidMount() { }

  componentDidShow() {
    this.getList()
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.getOrderList, {
        page: this.page,
        gift_status: this.state.gift_status,
        is_gift: 1,
      }).then(
        res => {
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
      Request.post(api.getOrderList, {
        page: this.page,
        gift_status: this.state.gift_status,
        is_gift: 1,
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

  tabClick(gift_status) {
    this.setState({
      gift_status: gift_status
    }, () => {
      this.getList()
    })
  }
  giftDetail(id) {
    Taro.navigateTo({
      url: `/pages/gift/giftDetail/index?id=${id}`
    })
  }

  render() {
    const { list, loadStatus, gift_status } = this.state
    return (
      <View className='giftList'>
        <Navbar bgColor='#1f3569' />
        <Menu />
        <View className='navbar'>
          <Text className={gift_status == 1 ? 'active btn' : 'btn'} onClick={this.tabClick.bind(this, 1)}>待领取</Text>
          <Text className={gift_status == 2 ? 'active btn' : 'btn'} onClick={this.tabClick.bind(this, 2)}>待签收</Text>
          <Text className={gift_status == 3 ? 'active btn' : 'btn'} onClick={this.tabClick.bind(this, 3)}>已完成</Text>
        </View>
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style='height:calc(100vh - 80px)'
          onScrollToLower={this.getMoreList.bind(this)}
        >
          {list.length == 0
            ? <Empty title='暂无内容' />
            : <View>
              {
                list.map((item) => {
                  return (
                    <View className='order-list' key={item.id}>
                      <View className='list-top'>
                        <Image className='logo' src={logo} />
                        <Text className='order-num'>{item.ordersn}</Text>
                        <Text className='order-status'>{item.statusstr}</Text>
                      </View>
                      <View className='detail' onClick={this.giftDetail.bind(this, item.id)}>
                        <View className='pic-view'>
                          {
                            item.goods.map((list) => {
                              return (
                                <Image src={list.thumb} className='pic' key={list.goodsid} />
                              )
                            })
                          }
                        </View>
                        <View className='total-view'>
                          <View className='total-goods'>共 {item.goods.length} 件商品</View>
                          <View className='total-price'>合计 ￥{item.price}</View>
                        </View>
                      </View>
                      {
                        gift_status == 1 &&
                        <View className='operation-view'>
                          <View className='operation-btn' onClick={this.giftDetail.bind(this, item.id)}>自己签收</View>
                          <View className='operation-btn' onClick={this.giftDetail.bind(this, item.id)}>送给TA</View>
                        </View>
                      }
                      {
                        (gift_status == 2 || gift_status == 3) &&
                        <View className='operation-view'>
                          <View className='operation-btn' onClick={this.giftDetail.bind(this, item.id)}>查看详情</View>
                        </View>
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

export default giftList;
