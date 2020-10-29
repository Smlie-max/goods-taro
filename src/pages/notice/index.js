import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Empty from '../../components/empty'
import { AtLoadMore } from 'taro-ui'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import orderIcon from '../../images/order-icon.png';

import './index.less'

class Notice extends Component {

  config = {
    navigationBarTitleText: '消息中心'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }
  componentWillMount() { }

  componentDidMount() {
    this.getList()
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.noticeList, {
        page: this.page
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
      Request.post(api.noticeList, {
        page: this.page
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

  noticeDetail(id) {
    let list = this.state.list
    for (let i in list) {
      if (list[i].id == id) {
        list[i].is_read = 1
        break
      }
    }
    this.setState({
      list: list
    })
    Taro.navigateTo({
      url: `/pages/notice/noticeDetail?id=${id}`
    })
  }

  render() {
    const { list, loadStatus } = this.state

    return (
      <View className='noticeWrap'>
        <Navbar />
        {
          <ScrollView
            className='scrollview'
            scrollY
            onScrollToLower={this.getMoreList.bind(this)}
          >
            {
              list.map((item) => {
                return (
                  <View className='list' key={item.id} onClick={this.noticeDetail.bind(this, item.id)}>
                    <Image src={orderIcon} className='icon' />
                    <View className='middle'>
                      <View className='title'>{item.type}</View>
                      <View className='desc'>{item.content}</View>
                      <View className='time'>{item.addtime}</View>
                    </View>
                    <View className='right'>
                      {item.is_read == 0 && <View className='dot'></View>}
                    </View>
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

export default Notice; 