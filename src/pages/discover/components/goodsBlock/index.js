import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import cartIcon from '../../../../images/car.png'
import './index.less'

class GoodsBlock extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentWillMount() {
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  render() {
    const { data } = this.props
    return (
      <View className='GoodsBlock'>
        <View className='pic-view'>
          <Image src={data.thumb} className='img' />
        </View>
        <View className='title'>{data.title}</View>
        <View className='bottom-view'>
          <View className='price-view'>
            <View className='xian'>¥ {data.marketprice}</View>
            <View className='yuan'>¥ {data.productprice}</View>
          </View>
          <Image src={cartIcon} className='cartIcon' onClick={this.goodsDetail.bind(thius, data.id)} />
        </View>
      </View>
    )
  }
}

export default GoodsBlock;
