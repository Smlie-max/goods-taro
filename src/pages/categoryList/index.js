import Taro, { Component } from '@tarojs/taro'

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'
import Empty from '../../components/empty'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import bg from '../../images/categoryList-bg.jpg'
import searchIcon from '../../images/search-icon.png'
import './index.less'
import shoukong from '../../images/null.png'

class CateGoryList extends Component {

  config = {
    navigationBarTitleText: '分类'
  }
  constructor() {
    super(...arguments)
    this.state = {
      categoryList: [],
      goods_list: [],
      data: [],
      page: 1,
      loadStatus: 'loading',
      id: '', //分类ID
      ready: true
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.setState({
      id: this.$router.params.id
    }, () => {
      this.loadList()
    })
    this.getCategory(this.$router.params.id)
  }

  //分类
  getCategory(id) {
    var that = this;
    Request.post(api.categoryList, {
      id: id
    }).then(
      res => {
        const result = res.data
        const list = result.data.cate_list
        if (result.code === 0) {
          that.setState({
            categoryList: list,
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

  loadList() {
    Request.post(api.categoryList, {
      page: this.state.page,
      id: this.state.id
    }).then(
      res => {
        const result = res.data
        const list = result.data.goods_list
        if (result.code === 0) {
          if (list.length === 0) {
            this.setState({
              loadStatus: 'noMore',
              ready: false
            })
            return;
          }
          this.setState({
            goods_list: this.state.goods_list.concat(list),
            loadStatus: 'loading',
            ready: true
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
  //切换分类
  tabClick(id) {
    this.setState({
      id: id,
      page: 1,
      goods_list: [],
    }, () => {
      this.loadList()
    })
  }
  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  //搜索
  search() {
    Taro.navigateTo({
      url: `/pages/search/index`
    })
  }
  render() {
    const { categoryList, goods_list, id, ready } = this.state
    return (
      <View className='CateGoryList'>
        <Navbar />
        <Menu />
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.loadMore}>
          <View className='top'>
            <Image src={bg} className='bg' />
            <View className='search-view' onClick={this.search.bind(this)}>
              <Image src={searchIcon} className='searchIcon' />
              <Text>最新时尚搭配</Text>
            </View>
            <ScrollView
              className='navbar-view'
              scrollX
            >
              {
                categoryList.map((item) => {
                  return (
                    <View
                      className={item.id === id ? 'nav active' : 'nav'}
                      key={item.id}
                      onClick={this.tabClick.bind(this, item.id)}
                    >
                      <View className='block'>
                        <View className='name'>{item.name}</View>
                      </View>
                    </View>
                  )
                })
              }
            </ScrollView>
          </View>
          <View className='goods-list'>
            {goods_list.length > 0 || ready
              ? (
                goods_list.map((item) => {

                  return (
                      
                      <View className='goodsBlock' key={item.id} onClick={this.goodsDetail.bind(this, item.id)}>
                        <Image src={item.thumb} className='goods-pic' />
                        <View className="guding">
                          <Image src={shoukong} className={item.total == 0 ? 'xianshi' : 'yingchang'} />
                        </View>
                        <View className='goods-name'>{item.title}</View>
                        <View className={item.total == 0 ? 'aaa' : 'bbb'} >已售空</View>
                        <View className='goods-price'>￥{item.marketprice}</View>
                      
                    </View>
                   
                  )
                })
              )
              : (
                <View className='none'>
                  <Empty title='暂无内容' />
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default CateGoryList; 