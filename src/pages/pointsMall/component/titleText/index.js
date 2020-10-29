import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components'

import './index.less'
import pic from '../../images/integral.png'
import pic1 from '../../images/integral1.png'

class TitleText extends Component {

  constructor() {
    super(...arguments);
  }

  render() {
    const { type, title, color } = this.props;
    return (
      <View className='main'>
        <Image src={type === 'true' ? pic : pic1} className='img'></Image>
        <View className='text' style={`color:${color}`}>{title}</View>
      </View>
    )
  }
}

export default TitleText;