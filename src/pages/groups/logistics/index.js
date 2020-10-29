import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Empty from '../../../components/empty';
import Like from '../../../components/like';
import Menu from '../../../components/menu';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Navbar from '../../../components/navbar'
import './index.less'

class Logistics extends Component {
  config = {
    navigationBarTitleText: '物流详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      order: {}
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.getList(this.$router.params.id)
  }

  //获取物流列表
  getList(id) {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.logistics, {
      id: id
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            list: result.data.expresslist,
            order: result.data.order
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
    const { list, order } = this.state
    return (
      <View className='Logistics'>
        <Navbar />
        <Menu />
        <View className='info'>
          <View className='items'>
            <Text className='left'>物流编号</Text>
            <Text className='right'>{order.ordersn || '暂无'}</Text>
          </View>
          <View className='items'>
            <Text className='left'>国内承运人</Text>
            <Text className='right'>{order.expresscom || '暂无'}</Text>
          </View>
        </View>
        {
          list.length > 0
            ? <block>
              <View className='timeline'>
                {
                  list.map((item, index) => {
                    return (
                      <View className='timeline-block' key={index}>
                        <View className='right'>
                          <View className={index === 0 ? 'active dot' : 'dot'}></View>
                          <View className='txt'>{item.step}</View>
                          <View className='time'>{item.time}</View>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </block>
            : <View className='empty'>
              <Empty title='暂无物流信息' />
            </View>
        }
        <Like />
      </View >
    )
  }
}

export default Logistics; 
