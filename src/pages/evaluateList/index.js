import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Empty from '../../components/empty'
import { AtLoadMore } from 'taro-ui'

import './index.less'
// import Empty from '../../components/empty';

class EvaluateList extends Component {
  config = {
    navigationBarTitleText: '商品评价'
  }
  constructor() {
    super(...arguments)
    this.state = {
      id: '',//商品ID
      tabList: [],
      page: 1,
      level: '',
      list: [],
      loadStatus: 'loading'
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    }, () => {
      this.getEvaluateLabel(this.$router.params.id)
      this.loadList(this.$router.params.id)
    })

  }

  componentDidMount() { }

  //获取评论标签
  getEvaluateLabel(id) {
    Request.post(api.evaluateCategory, {
      id: id
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          let tablist = result.data.tablist
          tablist[0].active = true
          this.setState({
            tabList: result.data.tablist
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
  }

  //获取评论列表
  loadList() {
    Request.post(api.getEvaluateList, {
      id: this.state.id,
      level: this.state.level,
      page: this.state.page
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
            loadStatus: 'more'
          })
          if (list.length === Number(result.data.total)) {
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
    if (this.state.loadStatus == 'noMore') {
      return
    }
    this.setState({
      page: this.state.page + 1,
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }
  //切换tab
  tabChange(id) {
    let tabList = this.state.tabList
    tabList.find((item) => {
      item.active = false
      if (item.id === id) {
        item.active = true
      }
    })
    this.setState({
      tabList: tabList,
      level: id,
      page: 1,
      list: [],
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }
  //小程序图片预览
  previewImg(thisUrl, arr) {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.previewImage({
        current: thisUrl,
        urls: arr
      })
    }
    if (process.env.TARO_ENV === 'h5') {
      var wx = require('m-commonjs-jweixin');
      wx.previewImage({
        current: thisUrl,
        urls: arr
      });
    }
  }
  render() {
    const { tabList, loadStatus, list } = this.state
    return (
      <View className='EvaluateList'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <ScrollView
          scrollY
          className='scrollview'
        >
          <View className='tabList'>
            {
              tabList.map((item) => {
                return (
                  <View
                    className={item.active ? 'tab active' : 'tab'}
                    key={item.id}
                    onClick={this.tabChange.bind(this, item.id)}
                  >
                    <Text>{item.txt}</Text>
                    <Text className='total'>{item.total}</Text>
                  </View>
                )
              })
            }
          </View>
          {
            list.length > 0 &&
            <block>
              {
                list.map((item) => {
                  return (
                    <block>
                      <View className='listBlock' key={item.id}>
                        <Image src={item.headimgurl} className='thumb' />
                        <View className='right'>
                          <View className='realname'>{item.nickname}</View>
                          <View className='comment'>{item.content}</View>
                          <View className='img-view'>
                            {
                              item.images.map((img, index) => {
                                return (
                                  <Image src={img} className='img' key={index} onClick={this.previewImg.bind(this, img, item.images)} mode='aspectFill' />
                                )
                              })
                            }
                          </View>
                          {
                            (item.reply_content !== '' || item.reply_images.length > 0) &&
                            <View className='boss-reply'>
                              <View className='reply-title'>掌柜回复:</View>
                              <View className='reply-txt'>{item.reply_content}</View>
                              {
                                item.reply_images.length > 0 &&
                                <View className='img-view'>
                                  {
                                    item.reply_images.map((reply_images, reply_index) => {
                                      return (
                                        <Image src={reply_images} mode='aspectFill' className='img' key={reply_index} onClick={this.previewImg.bind(this, reply_images, item.reply_images)} />
                                      )
                                    })
                                  }
                                </View>
                              }
                            </View>
                          }
                          <View className='bottom'>
                            <View className='time'>{item.createtime}</View>
                            {/* <View className='comment-btn'>评论</View> */}
                          </View>
                        </View>
                      </View>
                    </block>
                  )
                })
              }

              <AtLoadMore
                status={loadStatus}
                moreText='上拉加载更多'
              />
            </block>
          }
          {
            list.length === 0 && <Empty title='暂无评价' />
          }
        </ScrollView>
      </View>
    )
  }
}

export default EvaluateList; 
