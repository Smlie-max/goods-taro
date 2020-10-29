import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Empty from '../../components/empty'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import searchIcon from '../../images/search-icon.png';
import './index.less'

class Category extends Component {

  config = {
    navigationBarTitleText: '分类',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white'
  }
  constructor() {
    super(...arguments)
    this.state = {
      cateItems: [], //左边一级分类
      cateItemsList: [], //右边子分类
      brand: [], //品牌索引列表
      banner_info: {}, //banner
      cbIndex: 0, //分类和品牌tab index
      switchTabIndex: 0, //分类和品牌内容 index
      curIndex: 0, //一级分类显示index
      leftTabScrollTop: 0, //一级分类scrollTop
      brandScrollTop: 0, //品牌索引scrollTop
      scrollIntoView: '', //品牌快捷跳转
    }
  }
  componentWillMount() { }

  componentDidMount() {
    //分类
    var that = this;
    Request.post(api.category, {}).then(res => {
      const result = res.data.data
      that.setState({
        cateItems: result.cate,
        cateItemsList: result.list,
        banner_info: result.banner_info
      })
    })
    //品牌
    Request.post(api.category, { type: 2 }).then(
      res => {
        const result = res.data.data.list
        this.setState({
          brand: result
        })
      }
    )
  }

  searchLink() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }
  //品牌详情
  brandDetail(id) {
    Taro.navigateTo({
      url: `/pages/brandDetail/index?id=${id}`
    })
  }
  //跳转分类
  categoryList(id) {
    Taro.navigateTo({
      url: `/pages/categoryList/index?id=${id}`
    })
  }
  changeSwitchTab() {
    this.setState({
      switchTabIndex: this.state.switchTabIndex === 0 ? 1 : 0,
      cbIndex: this.state.cbIndex === 0 ? 1 : 0
    })
  }
  switchRightTab(index) {
    if (index === this.state.curIndex) {
      return
    }
    this.setState({
      leftTabScrollTop: 1
    }, () => {
      this.setState({
        curIndex: index,
      })
    })
  }

  scrollTo(key, index) {
    Taro.showToast({
      title: key,
      icon: 'none',
      duration: 1000
    })
    const that = this
    let scrollTop = 0
    // //兼容h5,第一个时增加brandScrollTop=1
    if (index === 0) {
      this.setState({
        brandScrollTop: 1,
      })
      return
    }
    for (let i = 0; i < index; i++) {
      Taro.createSelectorQuery()
        .select(`#b_${i}`)
        .fields({
          size: true,
        }, res => {
          scrollTop = scrollTop + res.height
          if (i + 1 === index) {
            that.setState({
              brandScrollTop: scrollTop,
            })
          }
        })
        .exec()
    }
    // Taro.showToast({
    //   title: key,
    //   icon: 'none',
    //   duration: 1000
    // })
    // //兼容h5,第一个时增加brandScrollTop=1
    // if (index === 0) {
    //   this.setState({
    //     brandScrollTop: 1,
    //     scrollIntoView: `b_${index}`
    //   })
    // } else {
    //   this.setState({
    //     scrollIntoView: `b_${index}`
    //   })
    // }
  }
  render() {
    const { brandScrollTop, scrollIntoView, cbIndex, cateItems, cateItemsList, curIndex, banner_info, leftTabScrollTop, current, brand, switchTabIndex } = this.state
    return (
      <View className='categoryWrap'>
        <Navbar bgColor='#253C6D' />
        <Menu />
        <View className='top_bar'>
          {
            cbIndex === 0 ?
              <View>
                <Image src={banner_info.thumb} className='ad-pic' style="  height:114.721px;" />
              </View>
              :
              <View>
              </View>
          }
          <View className='search-view' >
            <View className='switchTabWrap'>
              <View className='switchTab'>
                <View className={switchTabIndex === 0 ? 'tab active' : 'tab'} onClick={this.changeSwitchTab.bind(this)}>分类</View>
                <View className={switchTabIndex === 1 ? 'tab active' : 'tab'} onClick={this.changeSwitchTab.bind(this)}>品牌</View>
              </View>
            </View>
          </View>
        </View>
        {/* 分类 */}
        <View className='switchTabWrap'>

          <View className={cbIndex === 0 ? 'categorySwitchTab cbShow' : 'categorySwitchTab'}>
            <ScrollView className="nav_left" scrollY scrollWithAnimation>
              {
                cateItems.map((item, index) => {
                  return (
                    <View
                      className={curIndex === index ? 'active nav_left_items' : 'nav_left_items'}
                      onClick={this.switchRightTab.bind(this, index)}
                      key={`id${index}`}
                    >
                      {item.title}
                    </View>
                  )
                })
              }
            </ScrollView>
            {
              cateItemsList.length > 0 &&
                cateItemsList[curIndex].length > 0
                ? <ScrollView className="nav_right" scrollY >
                  <View className='right_content'>
                    {
                      cateItemsList[curIndex].map((item) => {
                        return (
                          <View className="nav_right_items" >
                            <View className='txt' onClick={this.categoryList.bind(this, item.id)} key={item.id}>{item.name}</View>
                            <View>
                              <View className="reclassify">
                                {
                                  item.subclassif.map((fenlei) => {
                                    return (
                                      <View className="sanjifenlei" onClick={this.categoryList.bind(this, fenlei.id)} key={fenlei.id}>
                                        <Image src={fenlei.thumb} className='logo'></Image>
                                        <View className='sss'>{fenlei.name}</View>
                                      </View>
                                    )
                                  })
                                }
                              </View>
                            </View>

                          </View>


                        )
                      })


                    }

                  </View>
                </ScrollView>
                : <View className="nodata_text">
                  <Empty title='该分类暂无数据' />
                </View>
            }
          </View>
        </View>
        {/* 品牌索引 */}
        <View className={cbIndex === 1 ? 'brandListWrap cbShow' : 'brandListWrap'}>
          <ScrollView
            className='brandList'
            scrollY
            scrollWithAnimation
            scrollTop={brandScrollTop}
            scrollIntoView={scrollIntoView}
          >
            {
              brand.map((item, index) => {
                return (
                  <View key={`b_${index}`} id={`b_${index}`}>
                    <View className='list-title'>{item.title}</View>
                    {
                      item.items.map((items) => {
                        return (
                          <View className='list' key={items.id} onClick={this.brandDetail.bind(this, items.id)}>
                            <Image src={items.thumb} className='list-logo'></Image>
                            <View className='list-name'>{items.name}</View>
                          </View>
                        )
                      })
                    }
                  </View>
                )
              })
            }
          </ScrollView>
          <View className='indexes_menu'>
            {
              brand.map((item, index) => {
                return (
                  <View className='indexList' key={item.title} onClick={this.scrollTo.bind(this, item.key, index)}>{item.title}</View>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}

export default Category; 
