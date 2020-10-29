import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import cartIcon from '../../../images/car.png'
import emptyPic from '../../../images/empty-icon.png'

import './index.less'

class TabGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      tabs: [],
      list: []
    }
  }
  componentWillMount() {
    let tabs = []
    let list = []
    const data = this.props.data
    data.map((item) => {
      let obj = {}
      obj.id = item.id
      obj.title = item.tabbar_name
      tabs.push(obj)
      list.push(item.data || [])
    })
    this.setState({
      tabs: tabs,
      list: list
    })
  }
  handleClick(value) {
    this.setState({
      current: value
    })
  }
  linkTo(id) {
    if (!id) return
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }
  render() {
    const { data } = this.props
    const { list } = this.state
    return (
      <View className='TabGroups'>
        <AtTabs
          current={this.state.current}
          scroll
          tabList={this.state.tabs}
          onClick={this.handleClick.bind(this)}
        >
          {
            list.map((item, index) => {
              return (
                <AtTabsPane current={this.state.current} index={index} className='myTabsPane' key={index}>
                  <View className='pane-view'>
                    {
                      item.length > 0
                        ? <View className='listBlock'>
                          {
                            item.map((row) => {
                              return (
                                <View
                                  className='col-3'
                                  key={row.gid}
                                  onClick={this.linkTo.bind(this, row.gid)}
                                >
                                  <Image src={row.thumb} className='goods-pic' lazyLoad/>
                                  <View className='goods-name'>
                                    {row.title}
                                  </View>
                                  <View className='goods-price'>
                                    <Text>￥{row.price}</Text>
                                    <Image src={cartIcon} className='cartIcon' lazyLoad/>
                                  </View>
                                </View>
                              )
                            })
                          }
                        </View>
                        : <View className='tab-empty-view'>
                          <Image src={emptyPic} className='emptyPic' lazyLoad/>
                          <View>暂无商品</View>
                        </View>
                    }
                  </View>
                </AtTabsPane>
              )
            })
          }
        </AtTabs>
      </View>
    )
  }
}
TabGroups.defaultProps = {
  data: []
}

export default TabGroups;
