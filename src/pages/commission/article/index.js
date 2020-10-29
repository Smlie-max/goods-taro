import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Empty from '../../../components/empty'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import heart from '../../../images/like_icon1.png'

import { AtLoadMore } from 'taro-ui';

import './index.less'

class DiscoverArticle extends Component {
  config = {
    navigationBarTitleText: '分销文章'
  }
  constructor() {
    super(...arguments)
    this.state = {
      data: [],
      page: 1,
      loadStatus: 'loading'
    }
  }
  componentDidMount() {
    this.loadList()
  }

  loadList() {
    Request.post(api.distArticle, {
      page: this.state.page,
    }).then(
      res => {
        const result = res.data
        const list = result.data.list
        this.setState({
          data: result.data
        })
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
            mask: true,
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
  articleDetail(id) {
    Taro.navigateTo({
      url: `/pages/articleDetail/index?id=${id}`
    })
  }
  render() {
    const { data, loadStatus } = this.state

    return (
      <View className='DiscoverArticle'>
        <Navbar />
        <Menu />
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
        >
          <View className='list'>
            {
              data.map((item) => {
                return (
                  <View className='ArticleBlock' onClick={this.articleDetail.bind(this, item.id)}>
                    <View className='pic-view'>
                      <Image src={item.thumb} className='img' />
                    </View>
                    <View className='title'>{item.title}</View>
                    <View className='info-view'>
                      <Image src={item.userheader} className='thumb' />
                      <View className='name'>{item.username}</View>
                      <View className='like-view'>
                        <Image className='heart' src={heart} />
                        <Text>{item.like}</Text>
                      </View>
                    </View>
                  </View>
                )
              })
            }
          </View>
          <AtLoadMore
            status={loadStatus}
            moreText='上拉加载更多'
          />
        </ScrollView>
      </View >
    )
  }
}

export default DiscoverArticle;
