import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'

import './index.less'
import shoukong from '../../images/null.png'

class Recommend extends Component {

  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  render() {
    const { list } = this.props
    return (
      <View className='Recommend'>
        <ScrollView
          className='scrollview'
          scrollX
        >
          {
            list.map((row) => {
              return (
                <View
                  className='trace-item'
                  key={row.id}
                  onClick={this.goodsDetail.bind(this, row.id)}
                >
                  <Image src={row.thumb} className='goods-pic'></Image>
                   <View   className="guding">
                    <Image src={shoukong}  className={row.total==0? 'xianshi' : 'yingchang'} />
                   </View>
                  <View className='goods-name'>{row.title}</View>
                  <View className='goods-price'>￥{row.marketprice}</View>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }
}

export default Recommend; 