import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Loading from '../../../components/loading'
import Tabs from '../component/tabs/index'
import { AtLoadMore } from 'taro-ui'
import './index.less'
import Request from '../../../utils/request'
import { api } from '../../../utils/api'
import Empty from './../../../components/empty/index'
import Menu from './../../../components/menu/index'
class Detail extends Component {
  config = {
    navigationBarTitleText: '分销订单'
  }

  constructor() {
    super(...arguments)
    this.state = {
      totalMoney: '',
      type_list: [],
      list: [],
      typeId: 0,
      loadStatus: 'more',
      loadingShow: true
    }
    this.page = 1; //页码
  }

  componentDidMount() {
    const that = this;
    Request.post(api.commissionOrder, {}).then(
      res => {
        const info = res.data.data;
        let type_list = info.type_list
        for (let i in type_list) {
          type_list[i].check = false
        }
        type_list[0].check = true
        //数据预处理 
        that.setState({
          totalMoney: info.count_withdraw,
          type_list: type_list,
          typeId: type_list[0].id
        }, () => {
          that.getList()
        })
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
      Request.post(api.distributionOrderList, {
        page: this.page,
        status: this.state.typeId
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
      Request.post(api.distributionOrderList, {
        page: this.page,
        status: this.state.typeId
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
  render() {
    const { totalMoney, type_list, list, loadStatus } = this.state
    return (
      <View className="distributionOrderWrap" >
        <Navbar bgColor='#253C6D' />
        <Menu />
        <Loading show={this.state.loadingShow} title='加载中' />
        <View className='main-contant'>
          <View className="money-contant">
            <View className='moneyWrap'>
              <View className='title'>累计佣金(¥)</View>
              <View className='number'>{totalMoney}</View>
            </View>
          </View>
          <Tabs titleArry={type_list} onchange={this.changeID.bind(this)} positionStyle={`position:fixed;top:${Taro.pxTransform('220px')}`}></Tabs>
          {
            list.length == 0
              ? <View className='noData'>
                <Empty title='暂无内容' />
              </View>
              : <ScrollView
                className='card-contant'
                scrollY
                scrollTop='1'
                onScrollToLower={this.getMoreList.bind(this)}
              >
                {
                  list.map((item) => {
                    return (
                      <View className='card' key={item.id}>
                        <View className="row">
                          <View className='title'>订单编号</View>
                          <View className='money'>{item.order_sn}</View>
                          <View className='status'>{item.status}</View>
                        </View>
                        <View className='time'>{item.createtime}</View>
                        <View className='total-contant'>
                          <View className='title'>预计佣金</View>
                          <View className='money'>￥{item.abonus}</View>
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
      </View >
    )
  }
}

export default Detail;
