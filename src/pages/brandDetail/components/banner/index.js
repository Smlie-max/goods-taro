import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.less'

class BrandBanner extends Component {

  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentWillMount() { }

  componentDidMount() { }
  componentWillUnmount() { }

  componentDidShow() { }

  render() {
    const { data } = this.props
    return (
      <View className='BrandBanner'>
        {
          data.map((item) => {
            return (
              <Image src={item.imgurl} className='banner' mode='widthFix' key={item}/>
            )
          })
        }
      </View>
    )
  }
}

export default BrandBanner; 
