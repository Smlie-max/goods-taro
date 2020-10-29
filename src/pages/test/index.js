import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import Menu from '../../components/menu'
import VConsole from '../../utils/vconsole.min.js'
import uploadImg from '../../utils/uploadImg';
import withShare from '../../utils/withShare'
import shareConfig from '../../utils/share'
import FloatLayout from './FloatLayout'
@withShare()

export default class test extends Component {
  config = {
    navigationBarTitleText: '测试'
  }
  constructor() {
    super(...arguments)
    this.state = {
      localIds: '点击',
      showLayout: false,
    }
  }
  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      let vConsole = new VConsole();
    }
  }
  componentWillMount() {
    return
    setTimeout(() => {
      shareConfig({
        title: 'jxz',
        imageUrl: 'http://fdgtest.zhikehl.cn/attachment/images/1/2019/02/vZ00KzQ9KO0d5k0ayxob5u30hTZyw0.jpg',
        path: '/pages/notice/index?',
        desc: `这是描述这是描述这是描述这是描述这是描述这是描述这是描述`
      })
      this.$setShareTitle = () => `aaaaa`
      this.$setShareImageUrl = () => `http://fdgtest.zhikehl.cn/attachment/images/1/2019/02/vZ00KzQ9KO0d5k0ayxob5u30hTZyw0.jpg`
      this.$setSharePath = () => `/pages/notice/index?`
    }, 2000)
  }
  async chooseImg() {
    var wx = require('m-commonjs-jweixin');
    const self = this
    wx.ready(function () {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          self.upload(localIds)
        }
      })
    })
  }
  async upload(localIds) {
    await uploadImg(localIds).then(res => {
    })
  }
  //微信支付
  wxPay() {
    var wx = require('m-commonjs-jweixin');
    Request.post(api.rechargeSubmit, {
      money: 0.01,
      type: 1
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        const pay_data = res.data.data.pay_data
        if (result.code === 0) {
          // self.pay(result.data.pay_data)
          wx.chooseWXPay({
            timestamp: pay_data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: pay_data.nonceStr, // 支付签名随机串，不长于 32 位
            package: pay_data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: pay_data.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              if (res.errMsg == "chooseWXPay:ok") {
                //支付成功
              } else {
                Taro.showToast({
                  title: '支付失败',
                  icon: 'none',
                  mask: true
                });
                // payStatus = 'fail'
                // resolve(payStatus)
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
  //分享
  share() {
  }
  //加入购物车
  addCart() {
    this.setState({
      showLayout: !this.state.showLayout
    })
  }
  render() {
    const { showLayout } = this.state
    return (
      <View>
        {/* <Menu /> */}
        {/* <View onClick={this.chooseImg.bind(this)}>点击</View>*/}
        <View onClick={this.wxPay.bind(this)}>支付</View>
        {/* <Button onClick={this.share.bind(this)}>分享</Button> */}
        {/* <Button onClick={this.addCart.bind(this)}>加入购物车</Button>
        <FloatLayout showLayout={showLayout} onClose={this.addCart.bind(this)} /> */}
      </View>
    )
  }
}
