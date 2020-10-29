import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.less'

class HotArea extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      screenWidth: '', //屏幕宽度
    }
  }
  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
  }
  clickArea(url) {
    if (url.indexOf('http') != -1) {
      if (process.env.TARO_ENV === 'h5') {
        location.href = url
      } else if (process.env.TARO_ENV === 'weapp') {
        Taro.navigateTo({
          url: `/pages/webView/index?url=${url}`
        })
      }
    } else {
      Taro.navigateTo({
        url: `${url}`
      })
    }
  }
  render() {
    const { data, bgImg } = this.props
    const { screenWidth } = this.state
    return (
      <View className='HotArea'>
        <Image src={bgImg} className='bg' mode='widthFix' lazyLoad />
        {
          data.map((item, index) => {
            // 后台设置的最大宽是302
            const style = `
            width:${Math.round(screenWidth * (item.width / 302)) + 'px'};
            top:${Math.round(item.top * (screenWidth / 302)) + 'px'};
            left:${Math.round(item.left * (screenWidth / 302)) + 'px'};
            height:${Math.round(screenWidth * (item.height / 302)) + 'px'};`
            return (
              <View className='area' style={style} key={`id${index}`} onClick={this.clickArea.bind(this, item.linkurl)}>
                {
                  item.thumb &&
                  <Image src={item.thumb} className='areaImg' mode='widthFix' lazyLoad />
                }
              </View>
            )
          })
        }
      </View>
    )
  }
}

HotArea.defaultProps = {
  data: [],
}

export default HotArea;
