import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.less'


class GoodsItem extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View className='goods-item-contant'>
        <Image className='img' src={this.props.imgSrc}></Image>
        <View className='detail-contant'>
          <View className='detail-row'>
            <View className='name'>
              {this.props.title}
            </View>
            <View className='price'>
              ￥{this.props.money}
            </View>
          </View>
          <View className='detail-row'>
            <View className='point'>{this.props.credit}积分</View>
          </View>
          <View className='detail-row'>
            <View className='format'></View>
            <View className='amount'>X{this.props.num}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default GoodsItem;