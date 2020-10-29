import Taro, { Component } from '@tarojs/taro'
import { View, Image, Input, Text } from '@tarojs/components'
import Navbar from '../../../components/navbar';

import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import bg from '../images/get-gift-success.png'
import './success.less'

class GetSuccess extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      info: '',
      order_id: ''
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    this.setState({
      order_id: this.$router.params.order_id,
    })
    Request.post(api.getGiftSuccess, {
      order_id: this.$router.params.order_id,
      // order_id: 104
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        Taro.showToast({
          title: result.msg,
          mask: true,
          icon: 'none'
        });
        if (result.code === 0) {
          this.setState({
            info: result.data
          })
        }
      }
    )
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  goHome() {
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }
  looklog() {
    Taro.redirectTo({
      url: `/pages/logistics/index?id=${this.state.order_id}`
    })
  }
  render() {
    const { info } = this.state
    return (
      <View className='getSuccess'>
        <Navbar />
        <Image src={bg} className='bg' mode='widthFix' />
        <View className='big-title'>领取成功</View>
        <View className='little-title'>尽情期待快递到来的惊喜吧</View>
        <View className='title'>收货信息</View>
        <View className='block'>
          <View className='block-item'>
            <View className='item-title'>收货人姓名</View>
            <View className='value'>{info.name}</View>
          </View>
          <View className='block-item'>
            <View className='item-title'>联系方式</View>
            <View className='value'>{info.mobile}</View>
          </View>
          <View className='block-item' style='width:100%'>
            <View className='item-title'>收货人地址</View>
            <View className='value' style='width:100%'>{info.areas}{info.address}</View>
          </View>
        </View>
        <View className='btn wl' onClick={this.looklog.bind(this)}>查看物流</View>
        <View className='btn sl' onClick={this.goHome.bind(this)}>我也要送礼</View>
      </View>
    )
  }
}
export default GetSuccess;
