import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import NewUserCoupon from '../../components/newUserCoupon'
import CouponsComponent from './../../components/coupons'
import Empty from './../../components/empty'
import SwiperComponent from './../../components/swiper'
import GoodsComponent from './../../components/goodsGroup'
import HotArea from './../../components/hotArea'
import withToken from '../../utils/withToken'
import withShare from '../../utils/withShare'
import bindParent from '../../utils/bindParent'
import Request from '../../utils/request';
import { api } from '../../utils/api';

import DefaultSwiperGroups from '../../components/shopDecoration/defaultSwiperGroups'
import SwiperGroups from '../../components/shopDecoration/swiperGroups'
import DefaultGoodGroups from '../../components/shopDecoration/defaultGoodGroups'
import ImageScrollGroups from '../../components/shopDecoration/imageScrollGroups'
import CouponGroups from '../../components/shopDecoration/couponGroups'

import './index.less'

@withToken()
@withShare()
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      showCouponMask: false,
      paperArr: [],
      orginArr: [],
      test: 'go',
      width: '0px',
      index: 0,
      min_touch: 50,
      oldTime: 0
    }

    // 方法命名
    this.nextPage = this.nextPage.bind(this);
    this.backPage = this.backPage.bind(this);
  }
  config = {
    navigationBarTitleText: '首页',
    disableScroll: true
  }

  componentWillMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    const that = this
    Request.post(api.test, {
      nav_id: this.$router.params.id
    }).then(
      res => {
        const result = res.data.data;
        let newData = res.data.data;
        for (let i = 0; i < newData.length; i++) {
          newData[i].class = 'one';
        }
        that.setState({
          paperArr: newData === '' ? [] : newData,
          orginArr: result
        })
      }
    )

    let width = ''
    Taro.getSystemInfo({
      success: res => {
        width = res.screenWidth + 'px';
        this.setState({
          width: width
        })
      }
    })
  }

  componentDidMount() { }

  // 翻页方法不要动````````````````````````````
  nextPage(e) {
    let index = this.state.index;
    const max = this.state.paperArr.length;
    if (index + 1 >= max) {
      Taro.showToast({
        title: '最后一页',
        icon: 'none'
      })
      return;
    }
    // 当前页面已经是最后一页了,就没必要下翻了
    // 翻页操作
    let Arr = this.state.paperArr;
    Arr = this.state.orginArr;
    Arr[index].class = 'one' + ' next';
    //翻页成功
    index++;
    this.setState({
      paperArr: Arr,
      index: index
    })
  }

  backPage(e) {
    let index = this.state.index;
    let Arr = this.state.paperArr;
    Arr = this.state.orginArr;
    index--;
    if (index < 0) {
      index++;
      Taro.showToast({
        title: '第一页',
        icon: 'none'
      })
      return
    }
    Arr[index].class = 'one' + ' back';
    this.setState({
      paperArr: Arr,
      index: index
    })
  }
  // 翻页方法不要动````````````````````````````


  // 手势方案`````````````````````````````````
  handleTouchStart = (e) => {
    // (e)
    this.startX = e.touches[0].clientX;
  }

  handleTouchMove = (e) => {
    this.endX = e.touches[0].clientX;
  }

  handleTouchEnd = () => {
    const that = this;
    let distance = Math.abs(this.startX - this.endX);
    if (distance > this.state.min_touch) {
      if (this.startX > this.endX) {
        console.log('左')
        that.nextPage();
      } else {
        console.log('右')
        that.backPage();
      }
    }
  }
  // ``````````````````````````````````

  componentWillUnmount() {
  }

  componentDidShow() { }

  componentDidHide() { }

  onShowCouponMask = () => {
    this.setState({
      showCouponMask: !this.state.showCouponMask
    })
  }
  search() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  onShareAppMessage(res) {
    return {
      title: 'FDG滴蕉蕉',
      path: `/pages/index/index?user_id=${this.state.my_user_id}`
    }
  }
  render() {
    const { showCouponMask, paperArr } = this.state
    return (
      <View className='index'>
        <Navbar />
        <Menu />
        <NewUserCoupon
          showCouponMask={showCouponMask}
          onShowCouponMask={this.onShowCouponMask}
        />
        <View className='paper-contant'>
          {
            paperArr.length === 0 && <Empty title='暂无内容' />
          }
          {
            paperArr.map((item, index) => {
              let zIndex = this.state.paperArr.length - index;
              return (
                <View className={item.class} style={{ 'z-index': zIndex }} key={item}>
                  <ScrollView onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd} className="scroll" scrollY style={{ width: this.state.width + '; background:#fff' }}>
                    {
                      item.items.length > 0
                        ? <View className='scroll-view'>
                          {
                            item.items.map((it, index) => {
                              return (
                                <View key={it}>
                                  {/* {
                                    it.id === 'coupon' &&
                                    <CouponsComponent data={it.data} couponstyle={it.couponstyle} />
                                  } */}
                                  {
                                    it.id === 'banner' &&
                                    <DefaultSwiperGroups data={it.data} />
                                  }
                                  {
                                    it.id === 'goods' &&
                                    <DefaultGoodGroups data={it.data} />
                                  }
                                  {
                                    it.id === 'hotphoto' && <HotArea data={it} />
                                  }
                                  {
                                    it.id === 'picturew' && <ImageScrollGroups data={it.list} />
                                  }
                                  {
                                    it.id === 'coupon' && <CouponGroups data={it.data} />
                                  }
                                </View>
                              )
                            })
                          }
                        </View>
                        : <Empty title='暂无内容' />
                    }
                  </ScrollView>
                </View>
              )
            }
            )
          }
        </View>
      </View>
    )
  }
}

export default Index;