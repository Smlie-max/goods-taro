import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtFloatLayout, AtActivityIndicator } from "taro-ui"
import { View } from '@tarojs/components'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import './index.less'
import Empty from '../../components/empty';
class ChooseCoupon extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      couponList: [],
      loadStatus: 'loading',
      ready: false
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.loadList()
  }

  componentDidShow() { }

  componentDidHide() { }
  onShowCouponMask = () => {
    this.setState({
      ready: false
    })
    this.props.onShowCouponMask()
  }
  onChooseCouponId = (couponId) => {
    this.props.onChooseCouponId(couponId);
    this.onShowCouponMask();
  }
  loadList() {
    //获取优惠券列表
    Request.post(api.chooseCoupon, {
      type: this.props.couponType,
      price: this.props.couponTypePrice,
      goods_list: JSON.stringify(this.props.goods_list),
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        this.setState({
          ready: true
        })
        if (result.code === 0) {
          this.setState({
            couponList: result.data.list
          })
        } else {
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false
          })
        }
      }
    )
  }
  render() {
    const { couponList, ready } = this.state
    return (
      <View className='ChooseCoupon'>
        <AtFloatLayout
          isOpened
          title='可用优惠券'
          onClose={this.onShowCouponMask}
          onScrollToLower={this.loadMore}
          className='layout'
        >
          {
            (ready && couponList.length > 0) &&
            <View style='padding-bottom:20PX'>
              {
                couponList.map((item) => {
                  return (
                    <View className='coupon' key={item.id}>
                      <View className='left'>
                        <View>¥{item.deduct}</View>
                        <View className='desc'>{item.tips1}</View>
                      </View>
                      <View className='right'>
                        <View className='info'>
                          <View className='type'>{item.coupontype}</View>
                          <View className='time'>有效期：{item.endtime}</View>
                        </View>
                        <View className='btn' onClick={this.onChooseCouponId.bind(this, item.id)}>立即使用</View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          }
          {
            !ready &&
            <View className='loading'>
              <AtActivityIndicator content='加载中'></AtActivityIndicator>
            </View>
          }
          {
            ready && couponList.length === 0 &&
            <Empty title='无可用优惠券' />
          }
        </AtFloatLayout>

        {
          couponList.length > 0 &&
          <View className='no-use' onClick={this.onChooseCouponId.bind(this, '')}>不使用优惠券</View>
        }
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(ChooseCoupon); 
