import { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'

import './index.less'

class SwiperComponent extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }
  onSwiperClick = (e) => {
    e.stopPropagation()
  }
  render() {
    const { data } = this.props
    return (
      <View className='SwiperComponent'>
        <Swiper
          className='swiper'
          circular
          autoplay
        >
          {
            data.map((item) => {
              return (
                <SwiperItem key={item} onTouchStart={this.onSwiperClick}>
                  <Image src={item.imgurl} className='banner' />
                </SwiperItem>
              )
            })
          }
        </Swiper>
      </View>
    )
  }
}


export default SwiperComponent;
