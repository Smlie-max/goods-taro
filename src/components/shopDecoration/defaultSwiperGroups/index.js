import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'

import './index.less'

class DefaultSwiperGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      bannerHeight: 250,
    }
  }
  imageLoad(e) {
    if (process.env.TARO_ENV === 'h5') {
      this.setState({
        bannerHeight: 'auto'
      })
    } else if (process.env.TARO_ENV === 'weapp') {
      const res = Taro.getSystemInfoSync();
      const imgwidth = e.detail.width
      const imgheight = e.detail.height
      const ratio = imgwidth / imgheight
      this.setState({
        bannerHeight: res.screenWidth / ratio + 'px'
      })
    }
  }

  linkTo(url) {
    if (url.indexOf('http') === 0) {
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
    const { bannerHeight } = this.state
    const { data } = this.props
    const style = `height:${bannerHeight}`
    return (
      <View className='DefaultSwiperGroups'>
        <Swiper
          className='swiper'
          circular
          autoplay
          interval={5000}
          indicatorDots
          style={style}
        >
          {
            data.map((item, index) => {
              return (
                <SwiperItem key={index}>
                  <Image
                    src={item.imgurl}
                    className='banner'
                    onLoad={this.imageLoad.bind(this)}
                    mode='widthFix'
                    onClick={this.linkTo.bind(this, item.linkurl)}
                    lazyLoad
                  />
                </SwiperItem>
              )
            })
          }
        </Swiper>
      </View>
    )
  }
}
DefaultSwiperGroups.defaultProps = {
  // list: [
  //   {
  //     id: 1,
  //     imgurl: 'https://jdc.jd.com/img/240x100',
  //     url: '/pages/index/index'
  //   },
  //   {
  //     id: 2,
  //     imgurl: 'https://jdc.jd.com/img/240x100',
  //     url: '/pages/index/index'
  //   },
  //   {
  //     id: 3,
  //     imgurl: 'https://jdc.jd.com/img/240x100',
  //     url: '/pages/index/index'
  //   },
  //   {
  //     id: 4,
  //     imgurl: 'https://jdc.jd.com/img/240x100',
  //     url: '/pages/index/index'
  //   },
  // ]
}

export default DefaultSwiperGroups;
