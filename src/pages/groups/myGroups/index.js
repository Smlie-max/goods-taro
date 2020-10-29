import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import Empty from '../../../components/empty';
import Menu from '../../../components/menu';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import { AtLoadMore } from 'taro-ui'

import rightIcon from '../../../images/choose-right.png'

import './index.less'

class myGroups extends Component {
  config = {
    navigationBarBackgroundColor: '#F5F7F9',
    navigationBarTitleText: '我的组团'
  }
  constructor() {
    super(...arguments)
    this.state = {
      status: 0, //拼团状态 0--组团中 1--组团成功 -1--组团失败
      loadStatus: 'loading',
      list: [],
      tabList: [
        {
          status: 0,
          txt: '组团中'
        },
        {
          status: 1,
          txt: '组团成功'
        },
        {
          status: 2,
          txt: '组团失败'
        }
      ]
    }
  }

  componentDidShow() {
    this.resetList()
  }
  changeTab(status) {
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
    Request.post(api.myGroups, {
      success: this.state.status,
      page: this.state.page,
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
  goDetail(teamid) {
    Taro.navigateTo({
      url: '/pages/groups/goodsDetail/index?teamid=' + teamid
    })
  }
  render() {
    const { status, tabList, list, loadStatus } = this.state
    return (
      <View className='myGroups'>
        <Menu />
        <View className='navbar'>
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
          onScrollToLower={this.loadMore}
        >
          {list.length === 0
            ? <Empty title='暂无内容' />
            : <View>
              {
                list.map((item) => {
                  return (
                    <View className='order-block' key={item.id} onClick={this.goDetail.bind(this, item.teamid)}>
                      <View className='status-view'>
                        {
                          item.success === '0' && <Text className='status'>还差{item.few_count}人 组团中</Text>
                        }
                        {
                          item.success === '1' && <Text className='status'>组团成功</Text>
                        }
                        {
                          item.success === '2' && <Text className='status' style='color:#D73B3B'>组团失败</Text>
                        }
                        <Text className='time'>{item.starttime}</Text>
                        <Image src={rightIcon} className='rightIcon' />
                      </View>
                      <View className='goods-view'>
                        <Image src={item.thumb} className='goods-pic' />
                        <View className='goods-info'>
                          <View className='goods-title'>{item.title}</View>
                        </View>
                        <View className='price-view'>
                          <View className='price'>￥{item.groupsprice}</View>
                          <View className='counts'>x {item.goodsnum}</View>
                        </View>
                      </View>
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

export default myGroups;
