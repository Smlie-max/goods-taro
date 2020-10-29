import Taro, { Component } from '@tarojs/taro'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import { View, Text, Image } from '@tarojs/components'
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'
import card2 from '../../images/card2.jpg'
import openPic from '../../images/open-member.png'
import './index.less'

class OpenMember extends Component {
  config = {
    navigationBarTitleText: '购买FDG会员卡'
  }
  constructor() {
    super(...arguments)
    this.state = {
      id: '', //会员卡ID
      info: {}
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }

  componentDidMount() { }

  componentDidShow() {
    this.getInfo()
  }

  getInfo() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.plusDetail, {
      id: this.$router.params.id
    }).then(
      res => {
        Taro.hideLoading()
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
  open() {
    if (this.state.info.is_data == 0) {
      Taro.showModal({
        title: '提示',
        content: '开通会员需要填写资料,是否前去填写?',
        success: function (res) {
          if (res.confirm) {
            //点击确定
            Taro.navigateTo({
              url: '/pages/fillMemberData/index'
            })
          }
        },
      })
    } else {
      /*
      *order_id:订单ID
      *pay_type:支付方式 1--微信支付 2--余额支付 3--银联支付
      *type:支付环境 1--微信 2--小程序
      */
      const self = this;
      //小程序支付
      if (process.env.TARO_ENV === 'weapp') {
        Taro.showLoading({ title: '请求中' })
        Request.post(api.buyPlus, {
          id: this.$router.params.id
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            if (result.code === 0) {
              Request.post(api.payPlus, {
                id: this.$router.params.id,
                order_id: result.data.order_id,
                pay_type: 1,
                type: 2
              }).then(
                res => {
                  const result1 = res.data
                  const payData = result1.data
                  if (result1.code === 0) {
                    Taro.requestPayment({
                      'timeStamp': payData.timeStamp,
                      'nonceStr': payData.nonceStr,
                      'package': payData.package,
                      'signType': 'MD5',
                      'paySign': payData.paySign,
                      'complete': function (res) {
                        if (res.errMsg == 'requestPayment:ok') {
                          Taro.showModal({
                            title: '提示',
                            content: '支付成功',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                Taro.navigateBack()
                              }
                            }
                          });
                        } else {
                          Taro.showModal({
                            title: '提示',
                            content: '支付失败',
                            showCancel: false
                          });
                        }
                      }
                    });
                  } else {
                    Taro.showToast({
                      title: result1.msg,
                      icon: 'none',
                      mask: true
                    })
                  }
                }
              )
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
      //公众号支付
      if (process.env.TARO_ENV === 'h5') {
        var wx = require('m-commonjs-jweixin');
        Taro.showLoading({ title: '请求中' })
        Request.post(api.buyPlus, {
          id: this.$router.params.id
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            if (result.code === 0) {
              Request.post(api.payPlus, {
                id: this.$router.params.id,
                order_id: result.data.order_id,
                pay_type: 1,
                type: 1
              }).then(
                res => {
                  const result1 = res.data
                  const payData = result1.data
                  if (result1.code === 0) {
                    wx.chooseWXPay({
                      timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                      nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                      package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                      signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                      paySign: payData.paySign, // 支付签名
                      success: function (res) {
                        // 支付成功后的回调函数
                        if (res.errMsg == "chooseWXPay:ok") {
                          //支付成功
                          Taro.showModal({
                            title: '提示',
                            content: '支付成功',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                Taro.navigateBack()
                              }
                            }
                          });
                        } else {
                          Taro.showToast({
                            title: '支付失败',
                            icon: 'none',
                            mask: true
                          });
                        }
                      },
                      cancel: function (res) {
                        //支付取消
                        Taro.showToast({
                          title: '支付取消',
                          icon: 'none',
                          mask: true
                        });
                      }
                    });
                  } else {
                    Taro.showToast({
                      title: result1.msg,
                      icon: 'none',
                      mask: true
                    })
                  }
                }
              )
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
    }
  }
  //协议
  agreement() {
    Taro.navigateTo({
      url: `/pages/article/index?type=${12}`
    })
  }
  //文章详情
  articleDetail(id) {
    if (id !== '0') {
      Taro.navigateTo({
        url: `/pages/articleDetail/index?id=${id}`
      })
    }
  }
  render() {
    const { info } = this.state
    return (
      <View className='openmemberWrap'>
        <Navbar />
        <Menu />
        <View className='card-view'>
          <Image src={info.pic_url} className='card1' mode='widthFix' />
          <Image src={card2} className='card2' />
          <View className='name-view'>
            <View>尽享专属权益</View>
            <View>￥{info.marketprice}/{info.unit}</View>
          </View>
          <View className='bottom'>
            <View className='buy' onClick={this.open.bind(this)} >立即开通</View>
          </View>
        </View>
        <Image src={openPic} className='open-member' mode='widthFix' />
        <View className='list-view'>
          {
            info.equity_list &&
            info.equity_list.map((item) => {
              return (
                <View
                  className='list'
                  key={item.art_id}
                  onClick={this.articleDetail.bind(this, item.art_id)}
                >
                  <Image src={item.icon} className='icon' />
                  <View className='title'>{item.title}</View>
                  <View className='desc'>{item.description}</View>
                </View>
              )
            })
          }
        </View>
        <View className='btn' onClick={this.open.bind(this)}>立即开通</View>
        <View className='agreement'>
          <Text>支付即视为同意</Text>
          <Text onClick={this.agreement.bind(this)}>《FDG会员-用户协议》</Text>
        </View>
      </View>
    )
  }
}

export default OpenMember 