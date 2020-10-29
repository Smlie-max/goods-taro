import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import cartIcon from '../../../../images/car.png'

import './index.less'

class GoodsComponent extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }

  goodsDetail(id) { 
    Taro.navigateTo({
      url:'/pages/goodsDetail/index?id=' + id
    })
  }

  render() {
    const { data } = this.props
    return (
      <View className='promotionanDiscount'>
        {
          data.map((item) => {
            return (
              <View className='goods-block' key={item.id} onClick={this.goodsDetail.bind(this, item.id)}>
                <View className='pic-view'>
                  <Image src={item.thumb} className='img' />
                </View>
                <View className='title'>{item.title} </View>
                <View className='bottom-view'>
                  <View className='price-view'>
                    <View className='xian'>¥ {item.marketprice}</View>
                  </View>
                  {/* <View className='buy'>购买</View> */}
                  <Image src={cartIcon} className='cartIcon' />
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}


export default GoodsComponent;
