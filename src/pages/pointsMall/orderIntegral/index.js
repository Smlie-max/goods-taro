import Taro, { Component } from '@tarojs/taro';
import Navbar from './../../../components/navbar/index';
import { View, Image, ScrollView } from '@tarojs/components';

import './index.less';
import GoodsItem from '../component/goodsItem';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import { AtLoadMore } from 'taro-ui'

import Menu from './../../../components/menu/index';

class OrderIntegral extends Component {
  config = {
    navigationBarTitleText: '兑换订单',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.getOrderList, {
        page: this.page,
        order_type: 9,
        status: -2
      }).then(
        res => {
          Taro.hideLoading()
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
    if (this.loadStatus !== 'more') {
      return false;
    }
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.getOrderList, {
        page: this.page,
        order_type: 9,
        status: -2
      }).then(
        res => {
          Taro.hideLoading()
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
  // 跳转到详情
  jumpToOrderDetail(id) {
    Taro.navigateTo({
      url: `/pages/pointsMall/success/index?id=${id}`
    })
  }

  render() {
    const { list, loadStatus } = this.state
    return (
      <View className='orderIntegral'>
        <Navbar bgColor='#253C6D'></Navbar>
        <Menu></Menu>
        <ScrollView className='scrollView' scrollY onScrollToLower={this.getMoreList.bind(this)}>
          {
            list.map((item) => {
              return (
                <View>
                  {
                    item.goods.map((row) => {
                      return (
                        <View className='card-menu' key={row.id} onClick={this.jumpToOrderDetail.bind(this, item.id)}>
                          <View className='card-list'>
                            <View className='order-contant'>
                              <View className='number-contant'>
                                <View className='number-row'>
                                  <View className='order'>订单编号</View>
                                  <View className='number'>{item.ordersn}</View>
                                </View >
                                <View className='time'>{item.createtime}</View>
                              </View>
                            </View>
                          </View>
                          <View className='goods-contant'>
                            <GoodsItem imgSrc={row.thumb} title={row.title} money={item.price} credit={item.deductcredit} num={row.total}></GoodsItem>
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              )
            })
          }
          <AtLoadMore status={loadStatus} moreText='上拉查看更多' />
        </ScrollView>
      </View>
    )
  }
}
export default OrderIntegral;