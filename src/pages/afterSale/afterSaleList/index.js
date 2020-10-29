import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import Empty from '../../../components/empty';
import Loading from '../../../components/loading';
import { AtLoadMore } from 'taro-ui'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

import rightIcon from '../../../images/choose-right.png'
import './index.less'

class AfterSaleList extends Component {
  config = {
    navigationBarTitleText: '售后列表'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      loadStatus: 'more',
      loadingShow: true
    }
    this.page = 1; //页码
  }
  componentWillMount() { }
  componentDidMount() {
    this.getList()
  }
  getList() {
    this.page = 1
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.refundList, {
        page: this.page
      }).then(
        res => {
          this.setState({
            loadingShow: false
          })
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
      Request.post(api.creditGetList, {
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
  lookDetail(id) {
    Taro.navigateTo({
      url: `/pages/afterSale/afterSaleDetail/index?id=${id}`
    })
  }
  render() {
    const { list,loadStatus } = this.state
    return (
      <View className='AfterSaleList'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <Loading show={this.state.loadingShow} title='加载中' />
        {
          list.length > 0
            ? <ScrollView
              className='order-scrollview'
              scrollY
              onScrollToLower={this.getMoreList.bind(this)}
            >
              {
                list.map((item) => {
                  return (
                    <View className='order-block' key={item.id}>
                      <View className='block-top' onClick={this.lookDetail.bind(this, item.id)}>
                        <Text>{item.createtime}</Text>
                        <View className='status'>
                          <Text>{item.status_str}</Text>
                          <Image src={rightIcon} className='rightIcon'></Image>
                        </View>
                      </View>
                      {/* <View className='store'>
                        <Text>fdg自营旗舰店</Text>
                        <Text className='store-type'>自营</Text>
                      </View> */}
                      {
                        item.goods_list.map((row) => {
                          return (
                            <View className='goods-list' key={row.id}>
                              <Image src={row.thumb} className='goods-pic' />
                              <View className='goods-info'>
                                <View className='goods-title'>{row.title}</View>
                                {/* <View className='get-type'>【到店自提】</View> */}
                                <View className='options-view'>
                                  <Text>{row.optionname}</Text>
                                  <Text>x{row.total}</Text>
                                </View>
                              </View>
                            </View>
                          )
                        })
                      }
                      <View className='order-type'>
                        <Text className='type-txt'>{item.rtype_str}</Text>
                        <Text className='detail' onClick={this.lookDetail.bind(this, item.id)}>查看详情</Text>
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
            : <Empty title='暂无内容' />
        }
      </View>
    )
  }
}

export default AfterSaleList; 
