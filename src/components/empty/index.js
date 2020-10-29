import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import emptyPic from '../../images/empty-icon.png'

import './index.less'

class Empty extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmout() { }

  componentWillReceiveProps() { }

  render() {
    const { title } = this.props
    return (
      <View className='empty-view'>
        <Image src={emptyPic} className='emptyPic' />
        <View>{title}</View>
        {/* <View>暂无内容</View> */}
      </View>
    )
  }
}
Empty.defaultProps = {
  title: '暂无内容'
}
export default Empty; 