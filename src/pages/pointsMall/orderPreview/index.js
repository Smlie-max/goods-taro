import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Image, Form } from '@tarojs/components'
import Loading from '../../../components/loading';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import orderPay from '../../../utils/orderPay';
import rightIcon from '../../../images/right.png'
import './index.less'

class CreditOrderPreview extends Component {
  config = {
    navigationBarTitleText: '提交订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      info: {},
      cgid: '',
      num: 0,
      optionid: '',
      form_id: '', //formId
      loadingShow: true,
    }
  }
  componentWillMount() {
    /*
    id: 商品ID
    num: 数量
    optionid: 规格ID
  */
    this.setState({
      cgid: this.$router.params.cgid,
      num: this.$router.params.num,
      optionid: this.$router.params.optionid
    })
  }

  componentDidMount() {
    Request.post(api.orderSubmit, {
      cgid: this.$router.params.cgid,
      total: this.$router.params.num,
      optionid: this.$router.params.optionid,
      is_creditshop: 1,//是否积分商城订单 0--否 1--是
      is_order: 0
    }).then(
      res => {
        this.setState({
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          this.setState({
            info: result.data
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

  //选择地址
  choiceAddress() {
    Taro.navigateTo({
      url: '/pages/address/index?status=order'
    })
  }

  submitOrder(e) {
    let address_id = 0;
    const that = this;
    if (!this.state.info.address) {
      address_id = this.props.myChoice.address_id
    } else if (this.state.info.address.id && this.props.myChoice.address_id === 0) {
      address_id = this.state.info.address.id
    } else {
      address_id = this.props.myChoice.address_id
    }
    if (address_id === 0) {
      Taro.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return;
    }
    Taro.showLoading({
      title: '请求中'
    })
    /*
      id: 商品ID
      num: 数量
      optionid: 规格ID
    */
    Request.post(api.orderSubmit, {
      cgid: this.state.cgid,
      total: this.state.num,
      optionid: this.state.optionid,
      is_creditshop: 1,//是否积分商城订单 0--否 1--是
      is_order: 1,
      form_id: e.detail.formId || ''
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          //0元支付
          if (result.data.status === 1) {
            Taro.showModal({
              title: '提示',
              content: '支付成功！',
              showCancel: false
            })
              .then(res => {
                if (res.confirm) {
                  Taro.redirectTo({
                    url: `/pages/orderDetail/index?id=${result.data.order_id}`
                  })
                }
              })
            return
          }
          that.pay(result.data.order_id)
        } else if (result.code === 1) {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
        } else if (result.code === 2) {  //海外商品地址提示
          Taro.showModal({
            title: '提示',
            content: result.msg
          }).then(res => {
            if (res.confirm) {
              Taro.navigateTo({
                url: `/pages/editAddress/index?id=${result.data.address_id}`
              })
            }
          })
        }
      }
    )
  }
  async pay(order_id) {
    const res = await orderPay(order_id)
    if (res == 'ok') {
      //支付成功
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/orderDetail/index?id=${order_id}`
        })
      }, 1400)
    } else if (res === 'fail') {
      Taro.redirectTo({
        url: `/pages/orderDetail/index?id=${order_id}`
      })
    }
  }
  render() {
    const { myChoice } = this.props
    const { info } = this.state
    return (
      <View className='CreditOrderPreview'>
        <Loading show={this.state.loadingShow} title='加载中' />
        {
          !info.address && myChoice.address === '' &&
          <View className='no-address' onClick={this.choiceAddress.bind(this)}>
            <Text>请选择地址</Text>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        {
          info.address && myChoice.address === '' &&
          <View className='address-view' onClick={this.choiceAddress.bind(this)}>
            <View>
              <View className='user'>{info.address.realname} {info.address.mobile}</View>
              <View className='address'>{info.address.province}{info.address.city}{info.address.area}{info.address.address}</View>
            </View>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        {
          myChoice.address != '' &&
          <View className='address-view' onClick={this.choiceAddress.bind(this)}>
            <View>
              <View className='user'>{myChoice.realname} {myChoice.mobile}</View>
              <View className='address'>{myChoice.address}</View>
            </View>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        }
        <View className='order-block'>
          {
            info.goods_list &&
            info.goods_list.map((item) => {
              return (
                <View className='goods' key={item.id}>
                  <Image src={item.thumb} className='goods-pic' />
                  <View className='goods-info'>
                    <View className='goods-desc'>
                      <View className='goods-title'>{item.title}</View>
                      <Text>￥{item.ggprice}</Text>
                    </View>
                    <View className='goods-item'>{item.optiontitle}</View>
                    <View className='goods-item'>x {item.total}</View>
                  </View>
                </View>
              )
            })
          }
          <View className='get-way'>
            <Text>配送</Text>
            <View className='select-way'>
              <Text>快递配送</Text>
            </View>
          </View>
        </View>
        <View className='sum-view'>
          <View className='sum-item yun'>
            <Text>运费</Text>
            <Text className='number'>￥{info.dispatch_price}</Text>
          </View>
          <View className='sum-item yun'>
            <Text>税费</Text>
            <Text className='number'>￥{info.tax_price}</Text>
          </View>
        </View>
        <View className='bottom-bar'>
          <View className='left'>
            <View className='txt'>实付款</View>
            <View className='money'>
              <View style='color:#1E3468'>¥ {info.total_price}</View>
              <View style='color:#565656'>{info.credit} 积分</View>
            </View>
          </View>
          <Form onSubmit={this.submitOrder.bind(this)} reportSubmit={true} >
            <View className='submit' onClick={this.submitOrder.bind(this)}>提交订单</View>
          </Form>
        </View>
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    myChoice: state.address.myChoice,
  }
}

export default connect(mapStateToProps)(CreditOrderPreview); 