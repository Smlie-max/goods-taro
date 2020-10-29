import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import couponBg from '../../../images/new-coupon-bg.png'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

import './index.less'

class CouponGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }

  getCoupon(id) {
    if (!id) {
      Taro.showToast({
        title: '领取失败',
        icon: 'none',
        mask: true
      })
      return
    }
    Taro.showLoading({
      title: '领取中'
    })
    Request.post(api.buyCoupon, {
      id: id,
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          Taro.showToast({
            title: '领取成功',
            mask: true,
            icon: 'none'
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
        }
      }
    )
  }

  render() {
    const { data } = this.props
    return (
      <View className='CouponGroups'>
        {
          data.list.map((item) => {
            return (
              <View className={data.col === '2' ? 'coupon-view col-2' : 'coupon-view col-3'} key={item.id}>
                <Image src={couponBg} className='couponBg' />
                <View className='coupon'>
                  <View className='num'>{item.price}</View>
                  <View className='enough'>{item.desc}</View>
                  <View className='get' onClick={this.getCoupon.bind(this, item.couponid)}>立即领取</View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
CouponGroups.defaultProps = {
  //   data: {
  //     col: 3, //2、3 两列或3列
  //     list: [
  //       {
  //         id: 1,
  //         price: '¥20',
  //         enough: '满200可用'
  //       },
  //       {
  //         id: 2,
  //         price: '¥20',
  //         enough: '满200可用'
  //       },
  //       {
  //         id: 3,
  //         price: '¥20',
  //         enough: '满200可用'
  //       },
  //       {
  //         id: 4,
  //         price: '¥20',
  //         enough: '满200可用'
  //       },
  //       {
  //         id: 5,
  //         price: '¥20',
  //         enough: '满200可用'
  //       },
  //     ]
  //   }
}

export default CouponGroups;
