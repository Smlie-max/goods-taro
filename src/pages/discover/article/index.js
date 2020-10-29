import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Empty from '../../../components/empty'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import ArticleBlock from '../components/articleBlock'

import { AtLoadMore } from 'taro-ui';

import './index.less'

class DiscoverArticle extends Component {
  config = {
    navigationBarTitleText: '达人说'
  }
  constructor() {
    super(...arguments)
    this.state = {
      data: [],
      page: 1,
      loadStatus: 'loading'
    }
  }
  componentWillMount() { }
  componentDidMount() {
    this.loadList()
  }

  loadList() {
    Request.post(api.speakList, {
      page: this.state.page,
    }).then(
      res => {
        const result = res.data
        // const list = result.data.list
        this.setState({
          data: result.data
        })
        return;
        if (result.code == 0) {
          if (list.length == 0) {
            this.setState({
              loadStatus: 'noMore'
            })
            return;
          }
          this.setState({
            data: this.state.data.concat(list),
            loadStatus: 'loading'
          })
          if (list.length == parseInt(result.data.total)) {
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
                  <ArticleBlock data={item} key={item} />
                )
              })
            }
          </View>
        </ScrollView>
      </View >
    )
  }
}

export default DiscoverArticle;
