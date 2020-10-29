import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'

import './index.less'

class ImageScrollGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
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
    const { data } = this.props
    return (
      <ScrollView
        className='ImageScrollGroups'
        scrollX
      >
        {
          data.map((item, index) => {
            return (
              <Image className='images'
                key={index}
                onClick={this.linkTo.bind(this, item.linkurl)}
                src={item.imgurl}
                lazyLoad
              />
            )
          })
        }
      </ScrollView>
    )
  }
}
ImageScrollGroups.defaultProps = {
}

export default ImageScrollGroups;
