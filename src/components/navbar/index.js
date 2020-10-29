import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import * as actionCreators from './store/actionCreators'
import { setNavbarPosition } from '../../utils/common'
import searchIcon from '../.././images/search.png'
import './index.less'

@connect(({ navbar }) => ({
  navList: navbar.navList,
  scrollLeft: navbar.scrollLeft,
  tabIndex: navbar.tabIndex,
  isNavbar: navbar.isNavbar
}), (dispatch) => ({
  changeNavlistData() {
    dispatch(actionCreators.getNavList())
  },
  changeTabIndex(scrollLeft, tabIndex) {
    dispatch(actionCreators.changeTabIndex(scrollLeft, tabIndex))
  },
  navbarReset() {
    dispatch(actionCreators.navbarReset())
  },
  changeNavbarLeft() {
    dispatch(actionCreators.changeNavbarLeft())
  }
}))
class Navbar extends Component {
  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentDidMount() {
    if (this.props.navList.length === 0) {
      this.props.changeNavlistData()
    }
    this.props.navbarReset()
    let setNavbar = setNavbarPosition(this.props.navList)
    if (setNavbar) {
      this.props.changeNavbarLeft()
    }
  }
  /*
    url: 跳转的链接
    id: 链接id
    index: 点击的是第几个
  */
  linkRouter(url, index) {
    setTimeout(() => {
      if (url.indexOf('http') != -1) {
        if (process.env.TARO_ENV === 'h5') {
          location.href = url
        } else if (process.env.TARO_ENV === 'weapp') {
          Taro.navigateTo({
            url: `/pages/webView/index?url=${url}`
          })
        }
        this.props.changeTabIndex(0, -1) //记录tabIndex和滚动距离
      } else {
        if (process.env.TARO_ENV === 'h5') {
          Taro.navigateTo({
            url: url
          })
        } else if (process.env.TARO_ENV === 'weapp') {
          Taro.reLaunch({
            url: url
          })
        }
      }
    }, 50);
    let screenWidth = 0
    Taro.getSystemInfo({
      success: res => {
        screenWidth = res.screenWidth
      }
    })
    let query = null
    let scrollLeft = 0
    if (process.env.TARO_ENV === 'h5') {
      query = Taro.createSelectorQuery().in(this)
    } else {
      query = Taro.createSelectorQuery().in(this.$scope)
    }
    if (index === 0) {
      this.props.changeTabIndex(0, 0) //记录tabIndex和滚动距离
    } else {
      if (url.indexOf('http') != -1) {
        if (process.env.TARO_ENV === 'weapp') {
          return
        }
      }
      for (let i = 0; i < index + 1; i++) {
        let number = 0 //元素宽度
        query.select('.index' + i)
          .fields({
            size: true,
            rect: true,
          }, res => {
            if (i == index) {
              number = res.width / 2
            } else {
              number = res.width
            }
          })
          .exec(() => {
            scrollLeft = scrollLeft + number
            if (i == index) {
              if (scrollLeft < screenWidth / 2) {
                this.props.changeTabIndex(0, index) //记录tabIndex和滚动距离
              } else {
                const scrollLeft1 = Math.abs(scrollLeft - screenWidth / 2)
                this.props.changeTabIndex(scrollLeft1, index) //记录tabIndex和滚动距离
              }
            }
          })
      }
    }
  }
  //跳转搜索
  search() {
    Taro.redirectTo({
      url: '/pages/search/index'
    })
  }
  render() {
    const { navList, bgColor, scrollLeft, tabIndex } = this.props
    const style = `background:${bgColor}`
    const searchStyle = `background:${bgColor}`
    return (
      navList.length > 0 &&
      <View className='NavbarView'>
        <ScrollView
          className='navbar-scrollview'
          scrollX
          style={style}
          scrollLeft={scrollLeft}
        >
          {
            navList.map((item, index) => {
              const blockClassName = `index${index} nav`
              return (
                <View
                  className={blockClassName}
                  key={item.id}
                  onClick={this.linkRouter.bind(this, item.url, index)}
                >
                  <View className='block'>
                    <View className='cn'>{item.navname}</View>
                    {
                      index == tabIndex
                        ? <View className='en nav_line'></View>
                        : <View className='en'>{item.italy_name || ''}</View>
                    }
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
        <View className='navbar-search' onClick={this.search.bind(this)} style={searchStyle}>
          <Image src={searchIcon} className='searchIcon' />
        </View>
      </View>
    )
  }
}

Navbar.defaultProps = {
  navList: [],
  bgColor: 'rgba(0,0,0,0.3)'
};
export default Navbar