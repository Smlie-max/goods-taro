import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

class CouponsComponent extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      couponsList: []
    }
  }
  render() {
    const { data, couponstyle } = this.props
    return (
      <View className='CouponsComponent'>
        {
          data.map((item) => {
            return (
              <View className={couponstyle==2?'coupon line2':'coupon line3'} key={item.couponid}>
                <View className='num'>{item.price}</View>
                <View className='get'>立即领取</View>
              </View>
            )
          })
        }
      </View>
    )
  }
}


export default CouponsComponent;
