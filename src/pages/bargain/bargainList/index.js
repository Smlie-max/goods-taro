import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Empty from '../../../components/empty'
import { AtLoadMore } from 'taro-ui'

import './index.less'

class bargainList extends Component {
  config = {
    navigationBarTitleText: '全部砍价'
  }
  constructor() {
    super(...arguments)
    this.state = {
      ready: false,
      list: [],
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }
  componentWillMount() { }

  componentDidMount() {
    this.getList()
  }

  goodsDetail(bgid) {
    Taro.navigateTo({
      url: `/pages/bargain/goodsDetail/index?bgid=${bgid}`
    })
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.bargainList, {
        page: this.page,
        is_all: 1
      }).then(
        res => {
          this.setState({
            ready: true
          })
          const result = res.data
          if (result.code === 0) {
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
      Request.post(api.bargainList, {
        page: this.page,
        is_all: 1
      }).then(
        res => {
          const result = res.data
          if (result.code === 0) {
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
    const { list, loadStatus, ready } = this.state
    return (
      <View className='bargainList'>
        <Navbar />
        <Menu />
        <ScrollView
          className='bargainList-scrollview'
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
                      <View className='goods-list' onClick={this.goodsDetail.bind(this, item.bgid)} key={item.bgid}>
                        <Image src={item.thumb} className='goods-pic' />
                        <View className='goods-info'>
                          <View className='goods-title'>{item.title}</View>
                          <View className='goods-desc'>{item.subtitle}</View>
                          <View className='goods-price'>
                            <View className='price'>￥{item.marketprice}</View>
                            <View className='buy-btn'>￥{item.end_price}</View>
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

export default bargainList;
