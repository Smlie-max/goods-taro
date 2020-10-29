import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import traceBg from '../../images/trace.png'
import './index.less'

class Trace extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      traceList: [],
      ready: false
    }
  }

  componentWillMount() { }

  componentDidMount() {
    this.changeTracelist()
  }

  changeTracelist() {
    Request.post(api.traceList, {}).then(
      res => {
        const result = res.data.data
        if (res.data.code === 0) {
          let traceList = []
          result.list.map((item) => {
            item.row.map((list) => {
              traceList.push(list)
            })
          })
          this.setState({
            traceList: traceList,
            ready: true
          })
        }
      }
    )
  }

  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }

  render() {
    const { traceList } = this.state
    return (
      <View className='traceWrap'>
        {
          <View style='padding-bottom:30px'>
            <Image src={traceBg} className='trace-pic' />
            <ScrollView
              className='scrollview'
              scrollX
            >
              {
                traceList.map((row) => {
                  return (
                    <View
                      className='trace-item'
                      key={row.id}
                      onClick={this.goodsDetail.bind(this, row.goodsid)}
                    >
                      <Image src={row.thumb} className='goods-pic' />
                      <View className='goods-name'>{row.title}</View>
                      <View className='goods-price'>￥{row.marketprice}</View>
                    </View>
                  )
                })
              }
            </ScrollView>
          </View>
        }
      </View>
    )
  }
}

export default Trace