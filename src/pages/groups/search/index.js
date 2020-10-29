import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Empty from '../../../components/empty'
import GoodGroups from '../goodGroups/goodGroups'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import { AtSearchBar, AtLoadMore } from 'taro-ui'

import './index.less'
class GroupsSearch extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      keyword: '',
      loadStatus: 'loading',
      data: [], //列表数据
      page: 1,
      searchShow: true,
      category: ''
    }
  }
  componentWillMount() {
    if (this.$router.params.category) {
      this.setState({
        category: this.$router.params.category,
        searchShow: false
      }, () => {
        this.loadList()
      })
    } else {
      this.loadList()
    }
  }
  componentDidMount() { }
  
  onChange(value) {
    this.setState({
      keyword: value
    })
  }
  //获取列表
  loadList() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.searchGroups, {
      keyword: this.state.keyword,
      page: this.state.page,
      category: this.state.category
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        const list = result.data.list
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
  //点击搜索
  search() {
    this.setState({
      data: [],
      page: 1,
      loadStatus: 'loading',
    }, () => {
      this.loadList()
    })
  }
  render() {
    const { data, searchShow, loadStatus } = this.state
    return (
      <View className='groupsSearch'>
        <Navbar />
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.loadMore.bind(this)}>
          {
            searchShow &&
            <AtSearchBar
              value={this.state.keyword}
              onChange={this.onChange.bind(this)}
              placeholder='搜索拼团商品'
              onActionClick={this.search.bind(this)}
            />
          }
          {!data.length
            ? <Empty title='暂无商品' />
            : <View style='margin-top:10px;'>
              <GoodGroups data={data} />
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

export default GroupsSearch;
