import Taro, { Component } from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import close from '../../images/cha.png'

import './index.less'
class Delivery extends Component {

  constructor() {
    super(...arguments);
    this.state = {
    }
  }

  showDeliveryMask = () => {
    this.props.onShowDeliveryMask()
  }

  render() {
    const { showDeliveryMask } = this.props
    return (
      < View className='delivery-wrap' >
        < View className={showDeliveryMask ? 'layoutCover layoutShow' : 'layoutCover'} >
          <View className='layoutMask' onClick={this.showDeliveryMask.bind(this)}></View>
          <View className='layoutMain'>
            <View className='layoutHeader'>
              <Image src={close} className='close' onClick={this.showDeliveryMask.bind(this)} />
            </View>
            <View className='layoutBody'>
              <View className='title'>快递配送</View>
              <View className='item'>海外商品约15-30天到货</View>
              <View className='title'>发货时间</View>
              <View className='item'>FDG商城海外直邮约15-30天到货，海外商品需申报清关，在中国海关清关时，有可能导致因包裹清关延误或扣留</View>
              <View className='title'>不支持7天无理由退货</View>
              <View className='item'>海外商品受国际邮费和关税影响，不支持退换货</View>
            </View>
            <View className='footer'>
              <View className='btn' onClick={this.showDeliveryMask.bind(this)}>确定</View>
            </View>
          </View>
        </View >
      </View >
    )
  }
}

export default Delivery; 
