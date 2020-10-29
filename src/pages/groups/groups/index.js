import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Loading from '../../../components/loading'
import Menu from '../../../components/menu'
import GoodGroups from '../goodGroups/goodGroups'
import withToken from '../../../utils/withToken';

import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import hotPic from '../images/hot.png'
import icon1 from '../images/icon1.png'
import icon2 from '../images/icon2.png'
import searchIcon from '../images/search.png'
import './index.less'
@withToken()
class Groups extends Component {
  config = {
    navigationBarTitleText: '拼团'
  }
  constructor() {
    super(...arguments)
    this.state = {
      category: [], //分类
      advs: [], //广告图
      goodsList: [], //商品列表
      loadingShow: true
    }
  }
  componentWillMount() { }

  componentDidMount() {
    //获取数据
    Request.post(api.groupsIndex, {}).then(
      res => {
        const result = res.data;
        this.setState({
          loadingShow: false
        })
        if (result.code === 0) {
          this.setState({
            category: result.data.category,
            advs: result.data.advs[0],
            goodsList: result.data.goods
          })
        } else {
          // Taro.showToast({
          //   title: result.msg,
          //   icon: 'none'
          // })
        }
      }
    )
  }

  tabLink(url) {
    Taro.navigateTo({
      url: '/pages/groups/' + url + '/index'
    })
  }
  goodsDetail() {
    Taro.navigateTo({
      url: '/pages/groups/goodsDetail/index'
    })
  }

  search() {
    Taro.navigateTo({
      url: '/pages/groups/search/index'
    })
  }
  //分类
  category(id) {
    Taro.navigateTo({
      url: `/pages/groups/search/index?category=${id}`
    })
  }

  linkTo(url) {
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
    const { category, advs, goodsList } = this.state
    return (
      <View className='groups-wrap'>
        <Navbar />
        <Menu />
        <Loading show={this.state.loadingShow} title='加载中' />
        <Image src={advs.thumb} className='banner' mode='widthFix' onClick={this.linkTo.bind(this, advs.link)} />
        <View className='search-view' onClick={this.search}>
          <Text className='txt'>搜索拼团商品</Text>
          <Image className='img' src={searchIcon} />
        </View>
        <ScrollView
          className='scrollview'
          scrollX
        >
          {
            category.map((item) => {
              return (
                <View className='scroll-block' key={item.id} onClick={this.category.bind(this, item.id)}>
                  <Image src={item.thumb} className='category-icon' />
                  <View className='category-name'>{item.name}</View>
                </View>
              )
            })
          }
        </ScrollView>
        <Image src={hotPic} className='hotPic' mode='widthFix' />
        {
          goodsList.length > 0 && <GoodGroups data={goodsList} />
        }
        {/* 导航栏 */}
        <View className='tabbar'>
          <View className='tab' onClick={this.tabLink.bind(this, 'groupsOrder')}>
            <Image src={icon1} className='icon' />
            <Text>拼团订单</Text>
          </View>
          <View className='tab' onClick={this.tabLink.bind(this, 'myGroups')}>
            <Image src={icon2} className='icon' />
            <Text>我的拼团</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Groups;
