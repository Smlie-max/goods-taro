import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Loading from '../../../components/loading'
import { AtLoadMore } from 'taro-ui'

// import arrow1 from '../images/arrow1.png'
import Tabs from './../component/tabs/index';
import Empty from './../../../components/empty/index';

class Order extends Component {
  config = {
    navigationBarTitleText: '提现明细'
  }

  constructor() {
    super(...arguments)
    this.state = {
      showList: [],
      type_list: [],
      typeId: "0",
      show: '',
      index: 1,
      nomore: false,
      list: [],
      loadStatus: 'more',
      loadingShow: true
    }
    this.page = 1; //页码
  }

  componentDidMount() {
    const that = this;
    // 请求参数,客户参数
    Request.post(api.distributionAbonusAbonusList, {}).then(
      res => {
        if (res.data.code === 1) {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        let type_list = res.data.data.status
        for (let i in type_list) {
          type_list[i].check = false
        }
        type_list[0].check = true
        //数据预处理 
        that.setState({
          type_list: type_list,
          typeId: type_list[0].id
        })
        that.getList()
      }
    )
  }

  // 点击改变类型
  changeID(id) {
    let type_list = this.state.type_list;
    for (let i in type_list) {
      type_list[i].check = false
    }
    type_list[id].check = true
    this.setState({
      typeId: type_list[id].id,
      type_list: type_list
    }, () => {
      this.getList()
    })
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.distributionAbonusGetList, {
        status: this.state.typeId,
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
      Request.post(api.distributionAbonusGetList, {
        status: this.state.typeId,
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
  // 跳转到详情
  jumpToDeatail(id) {
    Taro.navigateTo({
      url: `/pages/commission/detail/index?id=${id}`
    })
  }

  render() {
    const { type_list, list, loadStatus } = this.state
    return (
      <View className='commissionOrderWrap'>
        <Loading show={this.state.loadingShow} title='加载中' />
        <Tabs titleArry={type_list} onchange={this.changeID.bind(this)} positionStyle='position:fixed'></Tabs>
        {
          list.length == 0
            ? <Empty title='暂无内容' />
            : <ScrollView
              className='commissionOrder'
              scrollY
              scrollTop='1'
              onScrollToLower={this.getMoreList.bind(this)}
            >
              {
                list.map((item) => {
                  return (
                    <View className='card' key={item.id}>
                      <View className="row">
                        <View className='title'>提现到{item.type}</View>
                        <View className='money'>￥{item.realmoney}</View>
                        <View className='status'>{item.status}</View>
                      </View>
                      <View className='bottom'>
                        <View className='time'>单号: {item.applyno}</View>
                        <View className='orderSn'>{item.applytime}</View>
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

export default Order;
