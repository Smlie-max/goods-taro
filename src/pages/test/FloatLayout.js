import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import close from '../../images/cha.png'


import './FloatLayout.less'

class FloatLayout extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      showLayout: false,
    }
  }
  componentWillMount() { }

  componentDidMount() {
  }

  componentWillUnmout() { }

  componentWillReceiveProps() { }

  onClose(e) {
    e.stopPropagation()
    this.props.onClose()
  }
  render() {
    const { showLayout } = this.props
    return (
      <View className='FloatLayout'>
        < View className={showLayout ? 'cover show' : 'cover'} >
          <View className='mask' onClick={this.onClose.bind(this)}></View>
          <View className='main'>
            <View className='header'>
              <Image src='https://jdc.jd.com/img/200' className='select_img' />
              <Image src={close} className='close' onClick={this.onClose.bind(this)} />
              <View className='header_main'>
                <View className='price_wrap'>
                  <View className='price'>  ¥5688-6188 </View>
                </View>
                <View className='stock'>库存 590件</View>
                <View className='sku_info'>
                  <Text>请选择: </Text>
                  <Text>机身颜色</Text>
                  <Text>套餐类型</Text>
                  <Text>存储容量</Text>
                  <Text>存储容量</Text>
                  <Text>存储容量</Text>
                  <Text>存储容量</Text>
                  <Text>存储容量</Text>
                </View>
              </View>
            </View>
            <View className='body'>
              <View>我们并不希望当最后一行只有两个字时也两端对齐，毕竟这是不便于阅读的，那么当我们只有一行文本，但要实现单行文本两端对齐怎么解决（如下图的表单项效果）？</View>
              <View className='count-view'>
                <Text className='count-title'>数量</Text>
                <View className='inputNmber'>
                  <View className='btn minus'></View>
                  <View className='number'>1</View>
                  <View className='btn add'></View>
                </View>
              </View>
            </View>
            <View className='footer'>
              <View className='btn add'>加入购物车</View>
              <View className='btn'>立即购买</View>
            </View>
          </View>
        </View >
      </View >
    )
  }
}

export default FloatLayout; 