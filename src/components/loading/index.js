import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'


import './index.less'

class Loading extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      time: true
    }
  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({
        time: false
      })
    }, 400);
  }

  componentDidMount() { }

  componentWillUnmout() { }

  componentWillReceiveProps() { }

  render() {
    const { title, show } = this.props
    const { time } = this.state
    return (
      show || time
        ? <View className='loadingView' catchtouchmove>
          <View className='loadingMain'>
            <View className='loading'></View>
            <View className='loading'></View>
            <View className='loading'></View>
            <View className='loading'></View>
            <View className='loading'></View>
          </View>
          <View className='loadingTitle'>{title}</View>
        </View>
        : ''
    )
  }
}

export default Loading; 