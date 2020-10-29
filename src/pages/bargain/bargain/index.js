import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import bg1 from '../images/bg1.png'
import bg1Title from '../images/bg1-title.png'
import icon1 from '../images/icon1.png'
import icon2 from '../images/icon2.png'
import './index.less'
import Empty from '../../../components/empty';

class Bargain extends Component {
  config = {
    navigationBarTitleText: '砍价专场'
  }
  constructor() {
    super(...arguments)
    this.state = {
      banner: '',
      list: [],
      all_list: []
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.bargainIndex, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data.data
        this.setState({
          banner: result.bargain_image,
          list: result.list,
          all_list: result.all_list
        })
      }
    )
  }

  tabLink(url) {
    Taro.navigateTo({
      url: `/pages/bargain/${url}/index`
    })
  }
  bargainDetail(bgid) {
    Taro.navigateTo({
      url: `/pages/bargain/goodsDetail/index?bgid=${bgid}`
    })
  }
  render() {
    const { banner, list, all_list } = this.state
    return (
      <View className='Bargain'>
        <Navbar />
        <Menu />
        <Image src={banner} mode='widthFix' className='banner' />
        <ScrollView className='scrollview' scrollX>
          {
            list.map((item) => {
              return (
                <View className='scrollBlock' key={item.bgid} onClick={this.bargainDetail.bind(this, item.bgid)}>
                  <Image src={item.thumb} className='goods-pic' />
                  <View className='title'>{item.title}</View>
                  <View className='price'>￥{item.marketprice}</View>
                  <View className='true-price'>底价 ￥{item.end_price}</View>
                </View>
              )
            })
          }
        </ScrollView>
        {
          all_list.length > 0
            ? <View>
              <View className='bg-title'>
                <Image src={bg1} className='bg1' />
                <Image src={bg1Title} className='bg1Title' mode='widthFix' />
              </View>
              {
                all_list.map((item) => {
                  return (
                    <View className='goods-list' onClick={this.bargainDetail.bind(this, item.bgid)} key={item.bgid}>
                      <Image src={item.thumb} className='goods-pic' />
                      <View className='goods-info'>
                        <View className='goods-title'>{item.title}</View>
                        <View className='goods-desc'>{item.subtitle}</View>
                        <View className='goods-price'>
                          <View className='price'>￥{item.marketprice}</View>
                          <View className='buy-btn'>￥{item.end_price}</View>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
            : <Empty title='暂无内容' />
        }
        <View className='bottom-navbar'>
          <View className='item-bar' onClick={this.tabLink.bind(this, 'bargainList')}>
            <Image src={icon1} className='bar-icon' />
            <Text>全部砍价</Text>
          </View>
          <View className='item-bar' onClick={this.tabLink.bind(this, 'myBargain')}>
            <Image src={icon2} className='bar-icon' />
            <Text>我发起的</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Bargain;
