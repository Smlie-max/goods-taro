import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Empty from '../../../components/empty'
import { AtLoadMore } from 'taro-ui'
import Navbar from '../../../components/navbar'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import cart from '../../../images/car.png'

import './index.less'

class ProAddprice extends Component {

  config = {
    navigationBarTitleText: '加价购'
  }
  constructor() {
    super(...arguments)
    this.state = {
      data: [],
      page: 1,
      loadStatus: 'loading',
      goodsid: '',
      info: {}
    }
  }
  componentWillMount() {
    this.setState({
      goodsid: this.$router.params.goodsid,
    }, () => {
      this.loadList()
    })
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loadList() {
    Request.post(api.addprice, {
      page: this.state.page,
      goodsid: this.state.goodsid,
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
            data: this.state.data.concat(list),
            info: result.data.info,
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
  //商品详情
  /*
    id: 商品id
    is_addprice 加价购 0不是 1是
  */
  goodsDetail(id, is_addprice) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}&is_addprice=${is_addprice}`
    })
  }
  render() {
    const { data, loadStatus } = this.state
    return (
      <View className='ProAddprice'>
        <Navbar bgColor='#1E3468' />
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.loadMore}
        >
          <Image src={info.pic_url} className='banner' mode='widthFix' />
          {
            data.length > 0 ? (
              <block>
                <View className='goods-list'>
                  {
                    data.map((item) => {
                      return (
                        <View className='goods-block' key={item.id} onClick={this.goodsDetail.bind(this, item.goods_id, 1)}>
                          <Image src={item.thumb} className='goods-img' />
                          <View className='right'>
                            <View className='goods-name'>{item.title}</View>
                            <View className='goods-sale'>已售{item.sale}件</View>
                            <View className='goods-bottom'>
                              <View className='price-view'>
                                <View className='xian'>¥ {item.productprice}</View>
                                {/* <View className='yuan'></View> */}
                              </View>
                              <Image src={cart} className='cart' />
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
              </block>
            ) : (
                <Empty title='暂无内容' />
              )
          }
        </ScrollView>
      </View>
    )
  }
}

export default ProAddprice; 