import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image,ScrollView } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Empty from '../../components/empty'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import cartIcon from '../../images/car.png';
import './index.less'

class CouponGoodsList extends Component {
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      goodsList: [],
      loadStatus: 'loading',
      page: 1,
      ids: '',
      cate: [],
    }
  }
  componentWillMount() {
    this.setState({
      cate: this.$router.params.limitgoodcateids,
      ids: this.$router.params.limitgoodids
    }, () => {
      this.loadList()
    })
  }

  //获取列表
  /* 
    page: 页数
  */
  loadList() {
    Taro.showLoading({
      title: '正在加载'
    })
    Request.post(api.search, {
      page: this.state.page,
      ids: this.state.ids,
      cate: this.state.cate,
    }).then(
      res => {
        Taro.hideLoading();
        this.setState({
          ready: true,
        })
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
            goodsList: this.state.goodsList.concat(list),
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
            icon: 'none',
            mask: true
          })
        }
      }
    )
  }
  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  reset() {
    this.setState({
      goodsList: [],
      ready: false,
      page: 1,
    }, () => {
      this.loadList()
    })
  }
  //加载更多
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
  render() {
    const {
      goodsList,
      loadStatus,
      ready
    } = this.state

    return (
      <View className='CouponGoodsList'>
        <Menu />
        <Navbar bgColor='#1E3468' />
        {
          (goodsList.length > 0 && ready) &&
          <block>
            <ScrollView
              className='goods-list'
              scrollY
              onScrollToLower={this.loadMore}>
              {
                goodsList.map((item) => {
                  return (
                    <View
                      className='list'
                      key={item.id}
                      onClick={this.goodsDetail.bind(this, item.id)}
                    >
                      <View className='cover'>
                        <Image src={item.thumb} className='goods-pic'></Image>
                      </View>
                      <View className='desc'>{item.title}</View>
                      <View className='bottom'>
                        <View className='price-view'>
                          <View className='xian'>￥{item.marketprice}</View>
                          {/* <View className='yuan'>￥{item.productprice}</View> */}
                        </View>
                        {/* <Image src={cartIcon} className='cart'></Image> */}
                      </View>
                    </View>
                  )
                })
              }
              <AtLoadMore status={loadStatus} moreText='上拉加载更多' />
            </ScrollView>
          </block>
        }
        {
          (goodsList.length === 0 && ready) &&
          <View style='margin-top:200px;'>
            <Empty title='暂无相关商品~' />
          </View>
        }
      </View>
    )
  }
}

export default CouponGoodsList