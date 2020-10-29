import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import ImageScrollGroups from '../../components/shopDecoration/imageScrollGroups'
import GoodScrollGroups from '../../components/shopDecoration/goodScrollGroups'
import DefaultGoodGroups from '../../components/shopDecoration/defaultGoodGroups'
import CouponGroups from '../../components/shopDecoration/couponGroups'
import SwiperGroups from '../../components/shopDecoration/swiperGroups'
import ArticleGroups from '../../components/shopDecoration/articleGroups'
import TabGroups from '../../components/shopDecoration/tabGroups'
import HotArea from './../../components/hotArea'
import leftImg from '../../images/left-page.png'
import rightImg from '../../images/right-page.png'
import DefaultSwiperGroups from '../../components/shopDecoration/defaultSwiperGroups'
import './index.less'
class Index_test extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      min_touch: 50,
      screenWidth: '',
      screenHeight: '',
      lock: false,
      pageArr: [],
      current: 0,
    }
  }
  componentWillMount() {
    const _this = this
    Taro.getSystemInfo({
      success: function (res) {
        _this.setState({
          screenWidth: res.windowWidth
        });
      }
    })
    Request.post(api.test, {
      nav_id: this.$router.params.id
    })
      .then(res => {
        const result = res.data.data.list;
        this.setState({
          pageArr: result
        })
      })
  }
  componentDidMount() { }
  // 手势方案````````````````````````````````` 
  handleTouchStart = (e) => {
    this.startX = e.touches[0].clientX;
  }
  handleTouchMove = (e) => {
    this.endX = e.touches[0].clientX;
  }
  handleTouchEnd = (index) => {
    const that = this
    if (that.state.lock) return
    const pagesAreaLeft = this.state.screenWidth * 0.35
    const pagesAreaRight = this.state.screenWidth * 0.75
    let distance = Math.abs(this.startX - this.endX)
    if ((this.startX > pagesAreaRight) && (distance > this.state.min_touch)) {
      if (this.startX > this.endX) {
        console.log('左')
        that.nextPage(index)
      }
    }
    if ((this.startX < pagesAreaLeft) && (distance > this.state.min_touch)) {
      if (this.startX < this.endX) {
        console.log('右')
        that.prevPage(index)
      }
    }
  }
  // ```````````````````````` //翻页 
  nextPage() {
    const { pageArr, current } = this.state
    if (current === pageArr.length - 1) {
      Taro.showToast({
        title: '最后一页',
        icon: 'none'
      })
      return
    }
    pageArr[current].className = 'nextPage'
    this.setState({
      pageArr: pageArr,
      lock: true,
      current: current + 1
    }, () => {
      setTimeout(() => {
        this.setState({
          lock: false
        })
      }, 500)
    })
  }
  prevPage() {
    const { pageArr, current } = this.state
    if (current === 0) {
      Taro.showToast({
        title: '第一页',
        icon: 'none'
      })
      return
    }
    pageArr[current - 1].className = 'prevPage'
    this.setState({
      pageArr: pageArr,
      lock: true,
      current: current - 1
    }, () => {
      setTimeout(() => {
        this.setState({
          lock: false
        })
      }, 500)
    })
  }
  render() {
    const { pageArr } = this.state
    return (
      <View className='index_test'>
        <View className="flip-wrap">
          <View className="book-wrap preserve-3d">
            {
              pageArr.length > 0 &&
              pageArr.map((row, index) => {
                const classNames = `page point ${row.className}`
                const style = `z-index:${pageArr.length - index}`
                return (
                  <ScrollView
                    className={classNames}
                    style={style}
                    scrollY
                    key={row}
                  // onTouchStart={this.handleTouchStart.bind(this)}
                  // onTouchMove={this.handleTouchMove.bind(this)}
                  // onTouchEnd={this.handleTouchEnd.bind(this, index)}
                  >
                    {
                      row.items.length > 0
                        ? <block>
                          {
                            row.items.map((item) => {
                              return (
                                <block key={row.items}>
                                  {
                                    item.id === 'banner' && <DefaultSwiperGroups data={item.data} />
                                  }
                                  {
                                    item.id === 'goods' && <DefaultGoodGroups data={item.data} />
                                  }
                                  {
                                    item.id === 'hotphoto' && <HotArea data={item} />
                                  }
                                  {
                                    item.id === 'picturew' && <ImageScrollGroups data={item.list} />
                                  }
                                  {
                                    item.id === 'coupon' && <CouponGroups data={item.data} />
                                  }
                                  {
                                    item.id === 'pictures' && <SwiperGroups data={item.list} />
                                  }
                                </block>
                              )
                            })
                          }
                        </block>
                        : ('')
                    }
                  </ScrollView>
                )
              })
            }
            {
              this.state.current !== 0 &&
              <View className="back-button" onClick={this.prevPage.bind(this)}>
                <Image src={leftImg} className="controll-button-img"></Image>
              </View>
            }
            {
              this.state.current != (pageArr.length - 1) &&
              <View className="next-button" onClick={this.nextPage.bind(this)}>
                <Image src={rightImg} className="controll-button-img"></Image>
              </View>
            }
          </View>
        </View>
      </View>
    )
  }
}
export default Index_test;