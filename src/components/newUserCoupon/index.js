import Taro, { Component, checkIsSoterEnrolledInDevice } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { api } from '../../utils/api';
import Request from '../../utils/request';
import ShoppRequest from '../../utils/shoppRequest'
import closeIcon from '../../images/cha.png'
import line from '../../images/new-coupon-line.png'
import couponBg from '../../images/new-coupon-bg.png'
import namedPng from '../../images/front.png'

import './index.less'
import { compose } from 'redux';

class newUserCoupon extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      couponList: [],
      showCouponMask: false,
      staust: false,
      imgurlList: {}
    }
  }

  componentWillMount() { }

  componentDidMount() {
    this.gethaibao();
    setTimeout(() => {
      this.getCouponList()
    }, 2000)
  }

  getCouponList() {
    Request.post(api.newUserCoupon, {}).then(
      res => {
        const result = res.data.data
        if (res.data.code === 0) {
          this.setState({
            couponList: result,
          })
          this.onShowCouponMask()
        } else {
          // 不是新人直接显示海报
          if (Taro.getStorageSync('staust') === '') {
            this.setState({
              staust: true
            })
          } else {
            this.setState({
              staust: false
            })
          }

        }
      }
    )
  }

  gethaibao() {
    ShoppRequest.post(api.gethuodong, {
      type: 5
    }).then(res => {
      if (res.data.code === 0) {
        const result = res.data.result;

        let jsonlist = '['
        for (let i in result) {
          console.log('i'+i)
          if (i == 0) {
            jsonlist += '{"img":"' + result[i].img + '",';
            jsonlist += '"url":"' + result[i].position + '"}'
          } else {
            jsonlist += ',{"img":"' + result[i].img + '",';
            jsonlist += '"url":"' + result[i].position + '"}'
          }
        }
        jsonlist += ']'
        
        this.setState({
          imgurlList: JSON.parse(jsonlist),
      
        }) 
      }
    })
  }

  //确定跳转
  strue(url) {
    Taro.setStorageSync('staust', false)
    this.setState({
      staust: false,
    })
    Taro.navigateTo({
      url: url
    })
  }
  //取消弹出层
  mistake() {
    Taro.setStorageSync('staust', false)
    this.setState({
      staust: false,
    })
  }

  receive() {
    Taro.showLoading({
      title: '正在领取'
    })
    Request.post(api.getNewCoupon, {})
      .then(
        res => {
          Taro.hideLoading();
          if (res.data.code === 0) {
            Taro.showToast({
              title: res.data.msg
            })
            this.onShowCouponMask()
          } else {
            Taro.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            })
          }
        }
      )
  }

  onShowCouponMask() {
    if (Taro.getStorageSync('staust') === '') {
      this.setState(prevState => ({
        staust: prevState.showCouponMask,
        showCouponMask: !prevState.showCouponMask,
      }))
    } else {
      this.setState(prevState => ({
        showCouponMask: !prevState.showCouponMask,
      }))
    }
  }

  goDetail() {
    Taro.navigateTo({
      url: '/pages/couponRule/index'
    })
  }

  render() {
    const { couponList, showCouponMask, staust, imgurlList} = this.state
    return (
      <View className={showCouponMask ? 'newUserCouponWrap couponMaskShow' : 'newUserCouponWrap'}>
        <View className={showCouponMask ? 'newUserCoupon couponShow' : 'newUserCoupon'}>
          <View className='couponMain'>
            <Image className='closeIcon' src={closeIcon} onClick={this.onShowCouponMask.bind(this)} />
            <View className='title-view'>
              <Text>{couponList.title}</Text>
              <Image className='line' src={line} />
            </View>
            <View className='subhead'>{couponList.subhead}</View>
            <View className='detail' onClick={this.goDetail.bind(this)}>活动详情</View>
            <View className='coupon-list'>
              {
                couponList.coupons &&
                couponList.coupons.map((item) => {
                  return (
                    <View className='list' key={item.id}>
                      <Image className='couponBg' src={couponBg} />
                      <View className='num'>￥{item.deduct}</View>
                      <View className='enough'>{item.tip}</View>
                      <View className='type'>{item.couponname}</View>
                    </View>
                  )
                })
              }
            </View>
            <View className='receive' onClick={this.receive.bind(this)}>领取</View>
          </View>
        </View>
        {
          // staust && imgurlList.length > 4 ?
          staust && imgurlList.length> 0? 
            <View className="zhezhao">
              <Swiper
                className='test-h'
                indicatorColor='#999'
                indicatorActiveColor='#333'
                circular
                indicatorDots
              >
                {
                  imgurlList.map((item) => {
                    return (
                      <SwiperItem>
                        <Image className="img" src={item.img} onClick={this.strue.bind(this, item.url)} />
                        {/* <View className="strue" onClick={this.strue.bind(this)}> 立即领取 </View> */}
                      </SwiperItem>
                    )
                  })
                }
              </Swiper>
              <Image className="mistake" onClick={this.mistake.bind(this)} src={namedPng} />
            </View>
            :
            <View></View>
        }
      </View>

    )
  }
}

newUserCoupon.defaultProps = {
  showCouponMask: false
}

export default newUserCoupon