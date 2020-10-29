import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import coverIn from '../images/cover-in.png'
import coverOut from '../images/cover-out.png'
import open from '../images/open.png'
import popupBg from '../images/popup-bg.png'
import close from '../images/popup-close.png'
import './cover.less'

class Cover extends Component {
  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentWillMount() { }

  componentDidMount() {  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onShowCover() {
    this.props.onShowCover()
  }
  goHome() {
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }
  render() {
    const { giftError } = this.state
    const { member, status } = this.props
    return (
      <View className='Cover'>
        <View className='main'>
          <Image src={coverIn} className='coverIn' />
          <View className='cover-view'>
            <Image src={coverOut} className='coverOut' mode='widthFix' />
            <Image src={open} className='open' onClick={this.onShowCover.bind(this)} />
          </View>
          <Image src={member.avatar} className='thumb' />
          <View className='tips1'>
            <Text>{member.nickname}</Text>
            <Text style='color:#E2BE91'>的心享礼</Text>
          </View>
          <View className='tips2'>快打开看看有什么惊喜</View>
        </View>
        <View className='gift' onClick={this.goHome.bind(this)}>我也要送礼</View>
        {
          (status == 4 || status == 5 || status == 6) &&
          <View className='popup-mask'>
            <View className='popup-main'>
              <Image src={popupBg} className='popupBg' />
              {
                (status == 4 || status == 5) &&
                <View>
                  <View className='popup-title1'>来晚一步</View>
                  <View className='popup-title2'>礼物已经被领取了</View>
                </View>
              }
              {
                status == 6 &&
                <View>
                  <View className='popup-title1'>已过期</View>
                  <View className='popup-title2'>礼物已经过期了哦</View>
                </View>
              }
              <View className='popup-btn' onClick={this.goHome.bind(this)}>我也要送礼</View>
            </View>
            <Image src={close} className='close' onClick={this.goHome.bind(this)} />
          </View>
        }
      </View>
    )
  }
}
Cover.defaultProps = {
}

export default Cover;
