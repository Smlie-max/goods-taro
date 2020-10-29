import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import rightIcon from '../../../images/choose-right.png'
import Menu from '../../../components/menu';
import Empty from '../../../components/empty';
import { AtLoadMore } from 'taro-ui'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import './index.less'

class GroupsOrder extends Component {
  config = {
    navigationBarBackgroundColor: '#F5F7F9',
    navigationBarTitleText: '团购订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      status: -2,
      list: [],
      status: -2, //订单类型 -1--取消 -2--全部 0--待付款 1--待发货 2--待收货 3--已完成
      tabList: [
        {
          status: -2,
          txt: '全部'
        },
        {
          status: 0,
          txt: '待付款'
        },
        {
          status: 1,
          txt: '待发货'
        },
        {
          status: 2,
          txt: '待收货'
        },
        {
          status: 3,
          txt: '已完成'
        }
      ]
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentDidShow() {
    this.resetList()
  }
  changeTab(status) {
    if (status == this.state.status) {
      return
    }
    this.setState({
      status: status
    }, () => {
      this.resetList()
    })
  }
  resetList() {
    this.setState({
      page: 1,
      list: [],
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }
  loadList() {
    Request.post(api.getOrderList, {
      page: this.state.page,
      status: this.state.status,
      order_type: 2, //2拼团订单
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
            list: this.state.list.concat(list),
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
  //订单详情
  orderDetail(id) {
    Taro.navigateTo({
      url: `/pages/orderDetail/index?id=${id}`
    })
  }
  render() {
    const { status, loadStatus, tabList, list } = this.state
    return (
      <View className='groupsOrder'>
        <Menu />
        <View className='tabbar'>
          {
            tabList.map((item) => {
              return (
                <View className={item.status === status ? 'tab active' : 'tab'} key={item.status}>
                  <Text className='p' onClick={this.changeTab.bind(this, item.status)}>{item.txt}</Text>
                </View>
              )
            })
          }
        </View>
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.loadMore.bind(this)}
        >
          {
            list.length > 0
              ? <View className='orderList'>
                {
                  list.map((item) => {
                    return (
                      <View className='order-block' key={item.id} onClick={this.orderDetail.bind(this, item.id)}>
                        <View className='status-view'>
                          {
                            item.status === '-1' && <Text className='status'>已取消</Text>
                          }
                          {
                            item.status === '0' && <Text className='status'>待付款</Text>
                          }
                          {
                            item.status === '1' && <Text className='status'>待发货</Text>
                          }
                          {
                            item.status === '2' && <Text className='status'>待收货</Text>
                          }
                          {
                            item.status === '3' && <Text className='status'>已完成</Text>
                          }
                          <Text className='time'>{item.createtime}</Text>
                          <Image src={rightIcon} className='rightIcon' />
                        </View>
                        {
                          item.goods.map((row) => {
                            return (
                              <View className='goods-view'>
                                <Image src={row.thumb} className='goods-pic' />
                                <View className='goods-info'>
                                  <View className='goods-title'>{row.title}</View>
                                  {/* <View className='goods-type'>【商家配送】</View> */}
                                </View>
                                <View className='price-view'>
                                  <View className='price'>￥{row.price}</View>
                                  <View className='price1'>运费 ￥{item.dispatchprice}</View>
                                  <View className='counts'>x{row.total}</View>
                                </View>
                              </View>
                            )
                          })
                        }
                        <View className='total-view'>
                          <Text>共 {item.goods.length} 件商品</Text>
                          <View className='total-price'>
                            <Text>合计</Text>
                            <Text style='color:#1E3468'>￥{item.price}</Text>
                          </View>
                        </View>
                        {
                          item.status === '0' &&
                          <View className='btn-view'>
                            <View className='btn' onClick={this.orderDetail.bind(this, item.id)}>取消订单</View>
                            <View className='btn buy' onClick={this.orderDetail.bind(this, item.id)}>立即付款</View>
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
              : <Empty title='暂无相关订单哦' />
          }
        </ScrollView>
      </View>
    )
  }
}

export default GroupsOrder;
