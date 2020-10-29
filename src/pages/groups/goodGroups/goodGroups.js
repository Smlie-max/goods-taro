import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './index.less'
class GoodGroups extends Component {

  componentWillMount() { }

  componentDidMount() { }

  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/groups/goodsDetail/index?id=' + id
    })
  }
  render() {
    const { data } = this.props
    return (
      <View className='goodGroups-wrap'>
        <View className='goods-view'>
          {
            data.map((item) => {
              return (
                <View className='goods' onClick={this.goodsDetail.bind(this, item.id)} key={item.id}>
                  <View className='goods-pic-view'>
                    <Image src={item.thumb} className='goods-pic' />
                    <View className='counts'>已拼{item.teamnum}人</View>
                  </View>
                  <View className='goods-title'>{item.title}</View>
                  <View className='price-view'>
                    <Text className='xian'>￥{item.groupsprice}</Text>
                    <Text className='yuan'>￥{item.price}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
GoodGroups.defaultProps = {
  data: []
}
export default GoodGroups;
