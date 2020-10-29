import Taro, { Component } from '@tarojs/taro'
import { AtSearchBar } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'
import Like from '../../components/like'

import './index.less'

class Search extends Component {

  config = {
    navigationBarTitleText: '搜索'
  }
  constructor(props) {
    super(props)
    this.state = {
      keywords: '',
      recommend: [], //推荐
      history: [] //搜索记录
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentDidShow() {
    this.getInfo()
  }

  onChange(keywords) {
    this.setState({
      keywords: keywords
    })
  }
  onActionClick() {
    if (this.state.keywords === '') {
      Taro.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return;
    } else {
      Taro.navigateTo({
        url: '/pages/searchList/index?keywords=' + this.state.keywords
      })
    }
  }
  search(keywords) {
    Taro.navigateTo({
      url: `/pages/searchList/index?keywords=${keywords}`
    })
  }
  //获取历史记录
  getInfo() {
    Request.post(api.searchHistory, {})
      .then(
        res => {
          const result = res.data
          if (result.code === 0) {
            this.setState({
              recommend: result.data.recommend, //推荐,
              history: result.data.history //历史记录
            })
          } else {
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      )
  }
  //清除历史记录
  clearHistory() {
    Request.post(api.clearHistory, {})
      .then(
        res => {
          const result = res.data
          if (result.code === 0) {
            Taro.showToast({
              title: '删除成功',
              icon: 'none'
            })
            this.setState({
              history: []
            })
          } else {
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      )
  }
  render() {
    const { recommend, history } = this.state

    return (
      <View className='searchWrap'>
        <Navbar />
        <Menu />
        <View className='search_view'>
          <AtSearchBar
            value={this.state.keywords}
            onChange={this.onChange.bind(this)}
            placeholder='最新时尚搭配'
            onActionClick={this.onActionClick.bind(this)}
            onConfirm={this.onActionClick.bind(this)}
          />
        </View>
        <View className='history-view'>
          <View className='history-top'>
            <Text className='history-title'>最近搜索</Text>
            <Text className='clear' onClick={this.clearHistory.bind(this)}>清除</Text>
          </View>
          <View className='list-view'>
            {
              history.length > 0
                ? history.map((item, index) => {
                  return (
                    <Text className='list' onClick={this.search.bind(this, item.keyword)} key={index}>{item.keyword}</Text>
                  )
                })
                : <View className='noHistory'>暂无搜索记录</View>
            }
          </View>
        </View>

        {
          recommend.length > 0 &&
          <View className='recommend-view'>
            <View className='recommend-title'>为你推荐</View>
            <View className='list-view'>
              {
                recommend.map((item, index) => {
                  return (
                    <Text className='list' onClick={this.search.bind(this, item.keyword)} key={index}>{item.keyword}</Text>
                  )
                })
              }
            </View>
          </View>
        }
        <Like />
      </View>
    )
  }
}

export default Search; 