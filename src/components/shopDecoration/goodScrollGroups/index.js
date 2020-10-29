import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import cartIcon from '../../../images/cart-icon.png'
import shoukong from '../../../images/null.png'
import './index.less'

class GoodScrollGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }

  linkTo(id) {
    if (id) {
      Taro.navigateTo({
        url: '/pages/goodsDetail/index?id=' + id
      })
    }
  }

  render() {
    const { data } = this.props
    return (
      <ScrollView
        className='GoodScrollGroups'
        scrollX
      >
        {
          data.map((item) => {
            return (
              <View
                className='goods-item'
                key={item.id}
                onClick={this.linkTo.bind(this, item.gid)}
              >
                <Image src={item.thumb} className='goods-pic' lazyLoad/>
                <View   className="guding">
                      <Image src={shoukong}  className={item.total==0? 'xianshi' : 'yingchang'} />
                      </View>
                <View className='goods-main'>
                  <View className='goods-name'>{item.title}</View>
                  <View className='goods-price'>
                    <Text>￥{item.price}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }
      </ScrollView>
    )
  }
}
GoodScrollGroups.defaultProps = {
  data: []
}

export default GoodScrollGroups;
