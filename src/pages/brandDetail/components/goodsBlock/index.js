import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import cartIcon from '../../../../images/car.png'
import './index.less'

class GoodsBlock extends Component {

  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentWillMount() { }

  componentDidMount() { }
  componentWillUnmount() { }

  componentDidShow() { }

  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }
  render() {
    const { data } = this.props
    return (
      <View className='BrandGoodsBlock'>
        {/* <View className='title-view'>
          <View className='en'>BrandGoodsBlock</View>
          <View className='cn-view'>
            <View>猜你喜欢</View>
            <Image src={line} className='line' />
          </View>
        </View> */}
        <View className='list'>
          {
            data.map((item) => {
              return (
                <View className='block' key={item.gid} onClick={this.goodsDetail.bind(this, item.gid)}>
                  <Image src={item.thumb} className='goods-pic' />
                  <View className='goods-name'>{item.title}</View>
                  <View className='bottom'>
                    <Text>￥{item.price}</Text>
                    <Image src={cartIcon} className='cartIcon' />
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

export default GoodsBlock; 
