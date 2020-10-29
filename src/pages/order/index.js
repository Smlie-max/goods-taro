import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Loading from '../../components/loading'
import Empty from '../../components/empty'
import { AtLoadMore } from 'taro-ui'
import Request from '../../utils/request';
import { api } from '../../utils/api';

import './index.less'
class Order extends Component {

  config = {
    navigationBarTitleText: '订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      status: -2, //0--待付款 1--待发货 2-待收货 3--待评价 4--退款
      loadStatus: 'more',
      loadingShow: true
    }
    this.page = 1; //页码
  }

  componentWillMount() { }

  componentDidShow() {
    this.setState({
      status: this.$router.params.status || -2
    }, () => {
      this.getList()
    })
  }

  tabClick(status) {
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
      Request.post(api.getOrderList, {
        page: this.page,
        status: this.state.status
      }).then(
        res => {
          this.setState({
            loadingShow: false
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
      Request.post(api.getOrderList, {
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
  orderDetail(id) {
    Taro.navigateTo({
      url: `/pages/orderDetail/index?id=${id}`
    })
  }
  //跳转物流
  logistics(id) {
    Taro.navigateTo({
      url: `/pages/logistics/index?id=${id}`
    })
  }
  //取消订单
  cancelPay(id) {
    Taro.showModal({
      title: '提示',
      content: '确定取消订单？',
    }).then(res => {
      if (res.confirm) {
        Taro.showLoading({
          title: '正在取消'
        })
        Request.post(api.cancelPay, {
          id: id
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
            if (result.code == 0) {
              this.getList()
            }
          }
        )
      }
    })
  }
  //商品详情
  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }
  render() {
    const { status, list, loadStatus } = this.state
    return (
      <View className='orderWrap'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <Loading show={this.state.loadingShow} title='加载中' />
        <View className='navbar'>
          <Text className={status == -2 ? 'active tab' : 'tab'} onClick={this.tabClick.bind(this, -2)} >全部</Text>
          <Text className={status == 0 ? 'active tab' : 'tab'} onClick={this.tabClick.bind(this, 0)}>待付款</Text>
          <Text className={status == 1 ? 'active tab' : 'tab'} onClick={this.tabClick.bind(this, 1)}>待发货</Text>
          <Text className={status == 2 ? 'active tab' : 'tab'} onClick={this.tabClick.bind(this, 2)}>待收货</Text>
          <Text className={status == 3 ? 'active tab' : 'tab'} onClick={this.tabClick.bind(this, 3)}>待评价</Text>
        </View>
        {list.length == 0
          ? <Empty title='暂无内容' />
          : <ScrollView
            className='order-scrollview'
            scrollY
            scrollTop='1'
            onScrollToLower={this.getMoreList.bind(this)}
          >
            <View className='topLine'></View> {/* 兼容h5 */}
            {
              list.map((item) => {
                return (
                  <View className='order-block' key={item.id}>
                    <View className='top-view' onClick={this.orderDetail.bind(this, item.id)}>
                      <Text className='status'>{item.statusstr}</Text>
                      <Text className='time'>{item.createtime}</Text>
                      {
                        item.order_type &&
                        <View className='tag_view'>
                          <View className='tag_txt'>{item.order_type}</View>
                          <View className='tag'></View>
                        </View>
                      }
                    </View>
                    <View className='store-info'>
                      <Image src={item.merchlogo} className='store-logo' />
                      <Text>{item.merchname}</Text>
                      {
                        item.merchid == 0 &&
                        <Text className='store-type'>自营</Text>
                      }
                    </View>
                    {
                      item.goods.map((row) => {
                        return (
                          <View className='goods-list' key={row} onClick={this.goodsDetail.bind(this, row.goodsid)}>
                            <Image src={row.thumb} className='goods-pic' />
                            <View className='goods-info'>
                              <View className='info-item' style='color:#1E3468'>
                                <Text className='goods-title'>{row.title}</Text>
                                <Text>￥{row.price}</Text>
                              </View>
                              {/*<View className='info-item' style='color:#565656'>
                              <Text>【商家配送】</Text>
                              <Text>税费 ￥10.00</Text>
                            </View>*/}
                              <View className='info-item count' style='color:#B9B9B9'>
                                <Text>{row.optionname}</Text>
                                <Text>x{row.total}</Text>
                              </View>
                              <View className='refund'>{row.rstate_str}</View>
                            </View>
                          </View>
                        )
                      })
                    }
                    <View className='total-view'>
                      <View>共 {item.goods.length} 件商品</View>
                      <View className='total-price'>
                        <Text>合计</Text>
                        <Text className='price'>￥{item.price}</Text>
                      </View>
                    </View>
                    {
                      item.status == 0 &&
                      <View className='operation-view'>
                        <View className='operation-btn' onClick={this.cancelPay.bind(this, item.id)}>取消订单</View>
                        <View className='operation-btn right' onClick={this.orderDetail.bind(this, item.id)}>立即付款</View>
                      </View>
                    }
                    {
                      item.status == 2 &&
                      <View className='operation-view'>
                        <View className='operation-btn right' onClick={this.logistics.bind(this, item.id)}>查看物流</View>
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
          </ScrollView>
        }
      </View>
    )
  }
}

export default Order;

