import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Radio } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import wxIcon from '../../images/wx-pay.png';
import './index.less'

class Recharge extends Component {

  config = {
    navigationBarTitleText: '账户充值'
  }
  constructor() {
    super(...arguments)
    this.state = {
      rechargeList: [],
      selectMoney: 0
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.getInfo()
  }

  getInfo() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.getRechargeInfo, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            rechargeList: result.data.acts
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

  select(id) {
    const rechargeList = this.state.rechargeList
    rechargeList.map((item, index) => {
      item.select = false;
      if (index == id) {
        item.select = true;
        this.setState({
          selectMoney: item.enough
        })
      }
    })
  }

  recharge() {
    const self = this;
    if (self.state.selectMoney == 0) {
      Taro.showToast({
        title: '请选择充值金额',
        icon: 'none'
      })
      return;
    }
    Taro.showLoading({
      title: '加载中'
    })
    if (process.env.TARO_ENV === 'weapp') {
      Request.post(api.rechargeSubmit, {
        money: self.state.selectMoney,
        type: 2
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          const payData = result.data.pay_data
          if (result.code === 0) {
            Taro.requestPayment({
              'timeStamp': payData.timeStamp,
              'nonceStr': payData.nonceStr,
              'package': payData.package,
              'signType': 'MD5',
              'paySign': payData.paySign,
              'complete': function (res) {
                if (res.errMsg == 'requestPayment:ok') {
                  Taro.showToast({
                    title: '支付成功',
                    icon: 'none'
                  });
                } else {
                  Taro.showToast({
                    title: '支付失败',
                    icon: 'none',
                    mask: true
                  });
                }
              }
            });
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
    if (process.env.TARO_ENV === 'h5') {
      var wx = require('m-commonjs-jweixin');
      Request.post(api.rechargeSubmit, {
        money: self.state.selectMoney,
        type: 1
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          const payData = result.data.pay_data
          if (result.code === 0) {
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
                  Taro.showToast({
                    title: '支付成功',
                    icon: 'none'
                  })
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
              title: result.msg,
              icon: 'none',
              mask: true
            })
          }
        }
      )
    }
  }

  agreement() {
    Taro.navigateTo({
      url: `/pages/article/index?type=11`
    })
  }
  render() {
    const { rechargeList } = this.state
    return (
      <View className='Recharge'>
        <Navbar />
        <Menu />
        <View className='tips-title'>充值金额</View>
        <View className='recharge-list'>
          {
            rechargeList.map((item, index) => {
              return (
                <View
                  className={item.select ? 'list active' : 'list'}
                  onClick={this.select.bind(this, index)}
                  key={`id${index}`}
                >
                  <View className='money'>{item.enough}</View>
                  <View className='desc'>{item.give > 0 ? `送 ${item.give}` : ''}实到 {item.enough + item.give}</View>
                </View>
              )
            })
          }
        </View>
        <View className='tips-title'>选择充值方式</View>
        <View className='pay-list'>
          <View className='wx'>
            <Image className='pay-icon' src={wxIcon} />
            <Text>微信支付</Text>
          </View>
          <Radio color='#1E3468' checked></Radio>
        </View>
        <View className='tips'>
          <Text>点击立即充值，即表示您已阅读并同意</Text>
          <Text style='color:#F39800' onClick={this.agreement.bind(this)}>《充值协议》</Text>
        </View>
        <View className='recharge' onClick={this.recharge.bind(this)}>立即充值</View>
      </View>
    )
  }
}

export default Recharge