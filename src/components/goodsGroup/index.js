import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

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
      <View className='GoodsComponent'>
        {
          data.map((item) => {
            return (
              <View className='goods-block' key={item} onClick={this.goodsDetail.bind(this, item.gid)}>
                <View className='pic-view'>
                  <Image src={item.thumb} className='img' />
                </View>
                <View className='title'>{item.title} </View>
                <View className='bottom-view'>
                  <View className='price-view'>
                    <View className='xian'>¥ {item.price}</View>
                  </View>
                  <View className='buy'>购买</View>
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
