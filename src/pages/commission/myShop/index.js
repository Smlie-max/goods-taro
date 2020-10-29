import Taro, { Component } from '@tarojs/taro'
import { api } from '../../../utils/api';
import { Text, View, Image, Form } from '@tarojs/components';
import './index.less';
import homeIcon from '../images/home.png'
import erweima from '../images/erweima.png'
import erweima1 from '../images/erweima1.png'
import success from '../images/success_open.png'
import submits from '../images/submit.png'
import congratulation from '../images/congratulation.png'
import ShoppRequest from '../../../utils/shoppRequest'
import free from '../images/free.png'
import freeopen from '../images/free-open.png'

import openvip from '../images/open_vip.png'
import basehead from '../images/base_head.png'

class MyShop extends Component {
  config = {
    navigationBarTitleText: '我的店',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white',
  }

  constructor() {
    super(...arguments)
    this.state = {
      level: null,
      code: null,
      // 提交信息
      dname: '',
      phone: '',
      adders: '',
      detail: '',
      showComparison: false,
      showOpenBase: false,
      showOpenVip: false,
      showProtocol: false, // 协议页面
      showUpgrade: false, // 准备升级高级版时的页面
      showUpgradeVip: false, // 升级高级版时确认支付的页面
      showSuccessCode: false,// 支付成功后小程序码
      isExtreme: false,// 是否是支付后显示小程序码
      showAddress: false,//是否是支付后显示添加地址
      isFree: false,//是否是免费试用
      isBaseTry: false,
      isVipTry: false,
      isTry: false,
      openidType: 0,
    }
  }
  componentWillMount() {
    this.goOpenidType()
    Taro.showLoading({ title: "加载中" })
    var that = this;
    ShoppRequest.post(api.selectUserinfoByUserId, {
      userId: Taro.getStorageSync("user_id"),
    }).then(res => {
      Taro.hideLoading()
      // code: -1 未支付 , 0 有支付（已注册） 1 有支付(未注册)
      // type: 1 普通版, 2 至尊版  (有支付的)
      if (res.data.code == 0 || res.data.code == 1) {
        //已支付
        // 1.判断版本
        if (res.data.result == 1) {
          // 普通版,显示升级
          that.setState({
            showUpgrade: true,
            showUpgradeVip: false,
            showProtocol: false,
          })
        } else {
          //TODO 至尊版
          that.goFwSeller(false)
        }
      } else {
        // 未支付 （-1）
      }
    })
  }

  goOpenidType() {
    if (process.env.TARO_ENV === 'h5') {
      this.setState({
        openidType: 1
      })
    }
    else if (process.env.TARO_ENV === 'weapp') {
      this.setState({
        openidType: 0
      })
    }
  }

  goFwSeller(extreme) {
    Taro.showLoading({
      title: '加载中',
      icon: 'none',
      success: () => {
        setTimeout(() => {
          Taro.hideLoading();
          if (process.env.TARO_ENV === 'h5') {
            // h5支付完成后显示小程序二维码
            this.setState({
              showComparison: false,
              showOpenBase: false,
              showOpenVip: false,
              showProtocol: false, // 协议页面
              showUpgrade: false, // 准备升级高级版时的页面
              showUpgradeVip: false, // 升级高级版时确认支付的页面
              showSuccessCode: true,// 支付成功后小程序码
              isExtreme: extreme,// 是否是支付后显示小程序码
            })
          } else if (process.env.TARO_ENV === 'weapp') {
            Taro.showModal({
              title: '提示',
              content: '您可以跳转FW店长端进行店铺装修啦！',
              showCancel: false,
              success: () => {
                wx.navigateToMiniProgram({
                  appId: 'wx705ec2958e48acb8',
                  envVersion: 'release',
                  success(res) { }
                })
              }
            })
          }
        }, 5000);
      }
    })
  }

  showComparison() {
    var status = !this.state.showComparison;
    this.setState({
      showComparison: status,
      showProtocol: false,
      isFree: true
    })
  }

  showOpenBase() {
    var status = !this.state.showOpenBase;
    this.setState({
      showOpenBase: status,
      isFree: false,
      isBaseTry: false,
      isTry: false
    })
  }

  showOpenFree() {
    var status = !this.state.showOpenBase;
    this.setState({
      showOpenBase: status,
      isFree: true,
      isBaseTry: true,
      isTry: true,
    })
  }

  showFreeVip() {
    var status = !this.state.showOpenVip;
    this.setState({
      showOpenVip: status,
      isFree: true,
      isVipTry: true,
      isTry: true
    })
  }
  showOpenVip() {
    var status = !this.state.showOpenVip;
    this.setState({
      showOpenVip: status,
      isFree: false,
      isVipTry: false,
      isTry: false
    })
  }
  showProtocol() {
    var status = !this.state.showProtocol;
    this.setState({
      showProtocol: status,
      showComparison: false,
    })
  }
  showAddress() {
    var status = !this.state.showAddress;
    this.setState({
      showAddress: status,
    })
  }
  showUpgradeVip() {
    var status = !this.state.showUpgradeVip;
    this.setState({
      showUpgradeVip: status,
    })
  }

  onRemindInput(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }
  //提交
  formSubmit(e) {
    if (!this.state.dname) {
      Taro.showToast({
        title: '请输入姓名！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(this.state.phone))) {
      Taro.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!this.state.adders) {
      Taro.showToast({
        title: '请输入地址！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!this.state.detail) {
      Taro.showToast({
        title: '请输入具体地址！',
        icon: 'none',
        mask: true
      })
      return
    }
    let that = this;
    ShoppRequest.post(api.saveAdders, {
      dname: this.state.dname, //姓名
      phone: this.state.phone, //手机号码
      adders: this.state.adders + this.state.detail,//地址
      userId: Taro.getStorageSync("user_id"),
    }).then(
      res => {
        const result = res.data
        console.log(result)
        if (result.code == 0) {
          that.goFwSeller(true)
        }
      }
    )

    return
  }

  /*
    type: 开店类型(1=基础版， 2=高级版， 3=基础升级高级)
    status： 0=正常购买， 1=免费试用
    openidType： 0=小程序, 1=h5
  */
  getPay(type, status) {
    const that = this
    console.log(that.state.openidType)
    ShoppRequest.post(api.setUpShop, {
      userId: Taro.getStorageSync("user_id"),
      paylevel: type,
      status: status,
      openidType: that.state.openidType
    }).then(res => {
      if (res.data.code == 0) {
        console.log("开始支付")
        if (process.env.TARO_ENV === 'weapp') {
          Taro.requestPayment(
            {
              'timeStamp': res.data.result.timeStamp,
              'nonceStr': res.data.result.nonceStr,
              'package': res.data.result.package,
              'paySign': res.data.result.sign,
              'signType': res.data.result.signType,
              'success': function (res) {
                if (res.errMsg == 'requestPayment:ok') {
                  console.log("支付成功")
                  if (status == 0) {
                    that.setState({
                      showComparison: false,
                      showOpenBase: false,
                      showOpenVip: false,
                      showProtocol: false, // 协议页面
                      showUpgrade: false, // 准备升级高级版时的页面
                      showUpgradeVip: false, // 升级高级版时确认支付的页面
                      showSuccessCode: true,
                      showAddress: true,
                    })
                  } else {
                    that.goFwSeller(true)
                  }
                }
              },
              'fail': function (res) {
                console.log("支付失败")
                Taro.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              },
              'complete': function (res) {
                console.log("支付结束")
              }
            })
        } else if (process.env.TARO_ENV === 'h5') {
          var wx = require('m-commonjs-jweixin');
          const timestamp = res.data.result.timeStamp;
          const nonce_str = res.data.result.nonceStr;
          const packagename = res.data.result.package;
          const signType = res.data.result.signType;
          const paySign = res.data.result.sign;
          wx.ready(function () {
            wx.chooseWXPay({
              timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: nonce_str, // 支付签名随机串，不长于 32 位
              package: packagename, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: paySign, // 支付签名
              success: function (res) {
                console.log(res);
                if (res.errMsg === 'chooseWXPay:ok') {
                  console.log("支付成功")
                  if (status == 0) {
                    that.setState({
                      showComparison: false,
                      showOpenBase: false,
                      showOpenVip: false,
                      showProtocol: false, // 协议页面
                      showUpgrade: false, // 准备升级高级版时的页面
                      showUpgradeVip: false, // 升级高级版时确认支付的页面
                      showSuccessCode: true,
                      showAddress: true,
                    })
                  } else {
                    that.goFwSeller(true)
                  }
                } else {
                  Taro.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              error: function (err) {
                Taro.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          })
        }
      }
    })
  }

  goHome() {
    Taro.redirectTo({
      url: `/pages/index/index`
    })
  }

  render() {
    const { openidType, showComparison, showOpenBase, showSuccessCode, showOpenVip, showProtocol, showUpgrade, showUpgradeVip, isExtreme, showAddress, isFree, isBaseTry, isVipTry, isTry } = this.state
    return (
      <View className="index">
        <Image src={homeIcon} className='homeIcon' onClick={this.goHome.bind(this)} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
        {/* 主页 */}
        <View className='header'>
          <Image className='img1' src="https://www.fdg1868.cn/resource/bayMyShop/header_02.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
        </View>
        <View className="head">
          <View className="basic">
            <Text >基础版</Text>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/button.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="left-btn" onClick={this.showOpenBase.bind(this)}></Image>
            <Image src={free} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="left-free" onClick={this.showOpenFree.bind(this)}></Image>
          </View>
          <View className="noble">
            <Text>尊享版</Text>
            <Image src={free} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="right-free" onClick={this.showFreeVip.bind(this)}></Image>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/button.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="right-btn" onClick={this.showOpenVip.bind(this)}></Image>
          </View>
          <Image src="https://www.fdg1868.cn/resource/bayMyShop/biao.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="biao"></Image>
        </View>
        <View className='main'>
          <View className='left'>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/base_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="base"></Image>
          </View>
          <View className='right'>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/vip_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="vip"></Image>
          </View>
        </View>
        <View className="footer">
          <Image src="https://www.fdg1868.cn/resource/bayMyShop/contrast_03.png" className="contrast" onClick={this.showComparison.bind(this)}></Image>
          <Image src="https://www.fdg1868.cn/resource/bayMyShop/footer_03.png" className="protocol" onClick={this.showProtocol.bind(this)}></Image>
        </View>

        {/* 对比页面 */}
        {(showComparison) ?
          <View className="comparison">
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/return.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_return" onClick={this.showComparison.bind(this)}></Image>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/comparison_head_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="comparison_head"></Image>
            <View className="comparison_main">
              <Image className="comparison_main1" src="https://www.fdg1868.cn/resource/bayMyShop/comparison_main_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} ></Image></View>
            {(!showUpgrade) ?
              <Image src="https://www.fdg1868.cn/resource/bayMyShop/button.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="l_btn" onClick={this.showOpenBase.bind(this)}></Image>
              : ''
            }
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/button.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="r_btn" onClick={this.showOpenVip.bind(this)}></Image>
          </View> : ''
        }

        {/* 普通用户开通页面 */}
        {(showOpenBase) ?
          <View className="open-base">
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/return.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_return" onClick={this.showOpenBase.bind(this)}></Image>
            {(!isBaseTry) ?
              <Image src="https://www.fdg1868.cn/resource/bayMyShop/open-head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_head1"></Image>
              :
              <Image src={basehead} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_head"></Image>
            }
            <View className="basemain">
              <View className="explain">一、个人独立小店，轻松体面，流量会员变现</View>
              <View className="explain">二、全球时尚产品选货平台，千款全球潮流好物任意上架，无货款囤货压力，收单即一件代发</View>
              <View className="explain">三、可自定义店铺背景头像，修改店名、标语、主题颜色，装修你的专属店铺</View>
              <View className="explain">四、线上货仓甄选商品，选择自己特别推荐商品3个，和普通推荐商品30个</View>
              <View className="explain">五、查看商品预估佣金，抢先定制销售策略</View>
              <View className="explain">六、7*12h客服对接</View>
              {(!isTry) ?
                <View className="explain">七、推广期开通店铺，可享受开通折扣、永久技术服务和店铺拥有权</View>
                : <View className="explain">七、推广期申请免费试用开通店铺，可享受3个月的技术服务和店铺拥有权，店铺开通支付成功后，可联系工作人员操作退款流程</View>
              }
              <View className="explain">八、支付即视为同意《FW时潮好物-用户协议》济南梵迪娇品牌管理有限公司拥有最终解释权</View>
            </View>
            {(!isFree) ?
              <Image src="https://www.fdg1868.cn/resource/bayMyShop/opened.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="openbtn" onClick={this.getPay.bind(this, 1, 0)}></Image>
              : <Image src={freeopen} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="openbtn" onClick={this.getPay.bind(this, 1, 1)}></Image>
            }
          </View> : ''
        }

        {/* vip用户开通页面 */}
        {(showOpenVip) ?
          <View className="open-vip">
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/return.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_return" onClick={this.showOpenVip.bind(this)}></Image>
            {
              (!isVipTry) ?
                <Image src="https://www.fdg1868.cn/resource/bayMyShop/Vip-head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_head1"></Image>
                :
                <Image src={openvip} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_head"></Image>
            }

            <View className="vip-main">
              <View className="explain">一、个人独立小店，轻松体面，流量会员变现</View>
              <View className="explain">二、全球时尚产品选货平台，千款全球潮流好物任意上架，无货款囤货压力，收单即一件代发</View>
              <View className="explain">三、可自定义店铺背景头像，修改店名、标语、主题颜色，装修你的专属店铺</View>
              <View className="explain">四、线上货仓甄选商品，选择自己特别推荐商品3个，和普通推荐商品30个</View>
              <View className="explain">五、查看商品预估佣金，抢先定制销售策略</View>
              <View className="explain">六、7*12h客服对接</View>
              <View className="explain">七、热力图分析掌握页面点击热度</View>
              <View className="explain">八、数据分析
                  <View className="explains">1.总访问量、2.总订单量、3.总销售金额总佣金、</View>
                <View className="explains">4.过去7天的订单报表、5.销售金额报表、6.客单价、</View>
                <View className="explains">7.顾客最爱品类、8.浏览下单转化</View>
              </View>
              <View className="explain">九、一键生成专属裂变分享海报</View>
              <View className="explain">十、获得线下大咖经验沙龙分享会参加权</View>
              {
                (!isTry) ?
                  <View className="explain">十一、推广期开通店铺，可享受开通折扣、永久技术服务和店铺拥有权</View> :
                  <View className="explain">十一、推广期申请免费试用开通店铺，可享受3个月的技术服务和店铺拥有权，店铺开通支付成功后，可联系工作人员操作退款流程</View>
              }

              <View className="explain">十二、支付即视为同意《FW时潮好物-用户协议》济南梵迪娇品牌管理有限公司拥有最终解释权</View>
            </View>
            {(!isFree) ?
              <Image src="https://www.fdg1868.cn/resource/bayMyShop/opened.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="openbtn" onClick={this.getPay.bind(this, 2, 0)}></Image>
              : <Image src={freeopen} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="openbtn" onClick={this.getPay.bind(this, 2, 1)}></Image>

            }
          </View> : ''
        }
        {/* 协议页面 */}
        {(showProtocol) ?
          <View className="protocols">
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/return.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_return" onClick={this.showProtocol.bind(this)}></Image>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/protocol_head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="protocoltwo"></Image>
            <View className="protocols-main">
              <View className="explain">
                欢迎使用FW时潮好物店长端服务，为了保障您的权益，请在进行下一步操作前，详细阅读本协议的所有内容。当您点击“立即开通”按钮或其他具有类似含义的按钮时，即表示您同意并签署了《FW时潮好物店长端-用户协议》，并同意遵守本协议中的约定。该协议构成您与济南梵迪娇品牌管理有限公司（以下简称“梵迪娇”）达成的协议，具有法律效力。
              </View>
              <View className="explain">
                如果您不同意本协议内容，可立即停止使用本服务；如果您点击同意、接受继续开通本服务，则视为您已阅读并同意签署本协议内容。
              </View>
              <View className="explain">
                本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。
              </View>
              <View className="rule">使用规则：</View>
              <View className="explain-line">
                1、FW时潮好物店长端使用权：FW时潮好物店长端是为客户打造的个人线上店铺，包括店铺自定义店铺背景头像，修改店名、标语、主题颜色、设置海报、挑选货品上架分类、佣金提现、根据版本可查看数据报表、使用裂变工具等，及服务商不定时提供的其它优惠服务，具体以FW时潮好物店长端公布的服务内容为准。
              </View>
              <View className="explain-line">
                2、您申请开通FW时潮好物店长端使用权时，须按照FW时潮好物店长端的收费标准支付相应的技术服务费用；FW可能会基于业务发展，对收费标准进行调整，调整后的收费标准自公布之日起生效。如您在调整后的收费标准公布之前已开通技术服务的，您技术服务有效期内的技术服务费用将不受影响，当技术服务有效期届满后，若您需要续费，则需要按照调整后的收费标准支付相应的技术服务费用。
              </View>
              <View className="explain-line">
                3、技术服务有效期为一年（366天），自您成功支付技术服务费用之日起算。若您希望有效期届满后继续享受技术服务，则需要续费或重新申请。
              </View>
              <View className="explain-line">
                4、如果您在18周岁以下，您只能在父母或监护人的监护参与下方能参与体验该服务。若因您不具备签署主体资格而产生的任何责任，则由您与您的监护人承担因此而导致的一切后果，梵迪娇有权向您的监护人追偿。
              </View>
              <View className="explain-line">
                5、您知悉并同意，FW将会通过邮件、短信或电话等形式，向您发送会员活动相关信息。
              </View>
              <View className="explain-line">
                6、技术服务开通后，您在已开通的服务期限内，主动取消服务或终止资格的，已支付本服务的费用将不予退还。
              </View>
              <View className="explain-line">
                7、您确认技术服务仅限您本人使用，同时，您保证您将合理使用FW时潮好物店长端，不利用FW时潮好物店长端非法获利，不以任何形式转让您所享有的FW时潮好物店长端，不以任何形式将您享有的FW时潮好物店长端借给他人使用，如梵迪娇有合理怀疑您存在不当使用FW时潮好物店长端行为时，梵迪娇将有权取消您的技术服务资格，且不退还您支付的技术服务费用，因此产生的相关责任及损失均由您自行承担，并与实际使用人承担连带责任。给梵迪娇造成损失的，梵迪娇将保留向您追偿的权利。
              </View>
              <View className="explain-line">
                8、梵迪娇保留在法律法规允许的范围内自行决定是否接受您的会员申请、调整会员服务内容、取消会员资格等相关权利。
              </View>
              <View className="explain-line">
                9、您理解并保证，您在使用会员服务过程中遵守诚实信用原则。如梵迪娇发现或有合理理由怀疑您存在以下任意情形的：
                <View>(1)通过任何不当手段或违反诚实信用原则的方式开通会员服务的，包括但不限于使用恶意软件绕过梵迪娇设定的正常流程开通技术服务；</View>
                <View>(2)您提供的资料不合法、不真实、不准确、不详尽，包括但不限于盗用他人信息等；</View>
                <View>(3) 梵迪娇有合理理由怀疑您存在违反诚实信用原则的其他行为。否则，梵迪娇有权拒绝您的技术服务开通需求；若已开通，梵迪娇有权单方面取消您的店铺开通资格且不退换您支付的技术服务费用。</View>
              </View>
              <View className="rule">会员服务售后</View>
              <View className="explain-line">
                1、您知悉并确认，开通会员服务后，若您中途主动取消服务或终止资格或被梵迪娇根据《FW时潮好物店长端-用户协议》、本协议及相关规则注销账号、终止会员资格的，您已支付的会员服务费用将不予退还。
              </View>
              <View className="explain-line">
                2、如您有其他与技术服务售后相关的问题，可以通过梵迪娇公布的联系方式联系客服进行反馈。
              </View>
              <View className="rule">其他约定</View>
              <View className="explain-line">
                1、本协议的成立、生效与解释均适用中华人民共和国法律。当本协议的任何内容与中华人民共和国法律抵触时，应当以法律规定为准，同时相关条款将按法律规定进行修改或重新解释，而本协议其他部分的法律效力不变。
              </View>
              <View className="explain-line">
                2、如使用技术服务过程中出现纠纷，您与梵迪娇应友好协商解决，若协商不成，任何一方均可向中国广州仲裁委员会提起仲裁，并按届时有效的仲裁规则进行裁决，一裁终局，对双方均有法律约束力。
              </View>
            </View>
          </View> : ''
        }

        {/* 升级页面 */}
        {(showUpgrade) ?
          <View className="upgrade">
            <View className='upheader'>
              {(!showUpgradeVip) && (!showProtocol) && (!showComparison) ?
                <Image className="upheader1" src="https://www.fdg1868.cn/resource/bayMyShop/upgrade_head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
                :
                <Image className="upheader1" src="https://www.fdg1868.cn/resource/bayMyShop/header_02.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
              }
            </View>
            <View className='uphead'>
              <Image className="uphead1" src="https://www.fdg1868.cn/resource/bayMyShop/upgrade.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
              <Image className="open-btn" src="https://www.fdg1868.cn/resource/bayMyShop/button.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open-btn" onClick={this.showUpgradeVip.bind(this)}></Image>
            </View>
            <View className='upmain'>
              <Image className="upmain1" src="https://www.fdg1868.cn/resource/bayMyShop/upgrade_main.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
            </View>
            <View className="upfooter">
              <Image src="https://www.fdg1868.cn/resource/bayMyShop/contrast_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="contrast" onClick={this.showComparison.bind(this)}></Image>
              <Image src="https://www.fdg1868.cn/resource/bayMyShop/footer_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="protocol" onClick={this.showProtocol.bind(this)}></Image>
            </View>
          </View> : ''}

        {/* 普通用户升级Vip页面 */}
        {(showUpgradeVip) ?
          <View className="upgrade-vip">
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/return.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_return" onClick={this.showUpgradeVip.bind(this)}></Image>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/upgradevip_head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="open_head"></Image>
            <View className="vip-main">
              <View className="explain">一、个人独立小店，轻松体面，流量会员变现</View>
              <View className="explain">二、全球时尚产品选货平台，千款全球潮流好物任意上架，无货款囤货压力，收单即一件代发</View>
              <View className="explain">三、可自定义店铺背景头像，修改店名、标语、主题颜色，装修你的专属店铺</View>
              <View className="explain">四、线上货仓甄选商品，选择自己特别推荐商品3个，和普通推荐商品30个</View>
              <View className="explain">五、查看商品预估佣金，抢先定制销售策略</View>
              <View className="explain">六、7*12h客服对接</View>
              <View className="explain">七、热力图分析掌握页面点击热度</View>
              <View className="explain">八、数据分析
                  <View className="explains">1.总访问量、2.总订单量、3.总销售金额总佣金、</View>
                <View className="explains">4.过去7天的订单报表、5.销售金额报表、6.客单价、</View>
                <View className="explains">7.顾客最爱品类、8.浏览下单转化</View>
              </View>
              <View className="explain">九、一键生成专属裂变分享海报</View>
              <View className="explain">十、获得线下大咖经验沙龙分享会参加权</View>
              <View className="explain">十一、推广期申请免费试用开通店铺，可享受3个月的技术服务和店铺拥有权，店铺开通支付成功后，可联系工作人员操作退款流程</View>
              <View className="explain">十二、支付即视为同意《FW时潮好物-用户协议》济南梵迪娇品牌管理有限公司拥有最终解释权</View>
            </View>
            <Image src="https://www.fdg1868.cn/resource/bayMyShop/opened.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="openbtn" onClick={this.getPay.bind(this, 3, 0)}></Image>
          </View> : ''
        }

        {/* 成功后二维码 */}
        {(showSuccessCode) ?
          <View className="success">
            <View className="success_header">
              <Image className="success_header1" src="https://www.fdg1868.cn/resource/bayMyShop/upgrade_head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
            </View>
            <View className="erweima">
              {(isExtreme) ? <Image src={erweima} className="erweima1" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
                :
                <Image className="erweima1" src={erweima1} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />}
            </View>
            <View className="scfooter">
              <Image className="scfooter1" src="https://www.fdg1868.cn/resource/bayMyShop/footer_03.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} onClick={this.showProtocol.bind(this)}></Image>
            </View>
          </View>
          : ''
        }

        {/* 支付成功后填写地址 */}
        {(showAddress) ?
          <View className="address">
            <View className="success_header">
              <Image className="success_header2" src="https://www.fdg1868.cn/resource/bayMyShop/upgrade_head.png" mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
            </View>

            <View className="address_info">
              <View className="success_open">
                <Image className="success_open1" src={success} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} />
              </View>
              <Image src={congratulation} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="congratulation" />

              <View className="info">
                <View className="info-title">填写信息</View>
                <View className="info-sure">请认真填写以下信息 以便礼包发放</View>
                <View class="detail">

                  <View className="info-name">收件人姓名:
                  <Input type="text" maxLength="8" value={this.state.dname} onInput={this.onRemindInput.bind(this, 'dname')}></Input></View>
                  <View className="info-phone">收件人电话号码:
                  <Input type='number' maxLength="11" value={this.state.phone} onInput={this.onRemindInput.bind(this, 'phone')}></Input></View>
                  <View className="info-address">收件人地址:
                  <Input type="text" placeholder="     省     市     区(县)" value={this.state.adders} onInput={this.onRemindInput.bind(this, 'adders')}></Input></View>
                  <View className="info-defail">
                    <Textarea placeholder="(请输入具体地址)" style='width:90%;min-height:60px;' autoHeight value={this.state.detail} onInput={this.onRemindInput.bind(this, 'detail')}></Textarea></View>
                </View>

                <Image src={submits} mode={process.env.TARO_ENV === 'weapp' ? 'widthFix' : ''} className="submits" onClick={this.formSubmit.bind(this)} />
              </View>


            </View>
            <View className="scfooter">
              <View className="explain">1.请在开通店铺成功后，请立即完成收货信息填写，未填写用户可在时潮好物店长端联系客服重新提交资料信息。 </View>
              <View className="explain">2.请确保提交资料真实有效，礼包将通过用户提交信息进行发放。</View>
              <View className="explain">3.用户开通即视为选择对应版本的礼包，每个用户只能获取一次。店铺升级将不重复发放礼包。</View>
              <View className="explain">4.我司将严格保管好您的个人信息，如有任何疑问欢迎添加官方公众号：FW时潮好物进行咨询。</View>
            </View>
          </View>
          : ''
        }
      </View>



    )
  }
}
export default MyShop;
