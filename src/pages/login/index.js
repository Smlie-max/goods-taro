import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'

import { api } from '../../utils/api'
import Request from '../../utils/request'
import logo from '../../images/fdg-logo.png'
import wxLogo from '../../images/wx-logo.png'
import './index.less'

class Login extends Component {
  config = {
    navigationBarTitleText: '登录'
  }
  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmout() { }

  componentWillReceiveProps() { }

  getUserInfo = (userInfo) => {
    const that = this;
    if (userInfo.detail.userInfo) {   //同意
      Taro.setStorageSync('userInfo', userInfo.detail.userInfo)
      Taro.login({
        success(res) {
          if (res.code) {
            that.login({
              encryptedData: userInfo.detail.encryptedData,
              iv: userInfo.detail.iv,
              code: res.code
            })
          } else {
            console.log(res.errMsg)
          }
        }
      })
    } else { //拒绝
    }
  }

  login(data) {
    Request.post(api.login, data).then(
      res => {
        if (res.data.code === 0) {
          const is_label = res.data.data.is_label === '1' ? true : false
          Taro.setStorageSync('is_login', true) //登录状态
          Taro.setStorageSync('access_token', res.data.data.access_token) //token
          Taro.setStorageSync('is_label', is_label) //是否已填资料
          Taro.setStorageSync('user_id', res.data.data.user_id) //user_id
          Taro.showToast({
            title: '登录成功',
            mask: true,
            duration: 1400,
            icon: 'none',
            success:function(){
              Taro.navigateBack();
            }
          })
          // const withoutLabel = this.$router.params.withoutLabel //判断某些场景登录完是否需要填资料,默认都需要
          // setTimeout(() => {
          //   if (withoutLabel) {
          //     Taro.navigateTo({
          //       url: '/pages/getnumber/index'
          //     })
          //     return
          //   }
          //   if (res.data.data.is_label === '0') { //是否已填资料
          //     Taro.redirectTo({
          //       url: '/pages/initInfo/index'
          //     })
          //   } else {
          //     Taro.navigateTo({
          //       url: '/pages/getnumber/index'
          //     })
          //   }
          // }, 1450)
        }
      }
    )
  }
  render() {
    return (
      <View className='loginWrap'>
        <Image src={logo} className='logo' mode='widthFix'></Image>
        <Button className='login-btn' open-type="getUserInfo" hover-class='none' onGetUserInfo={this.getUserInfo}>
          <Image src={wxLogo} className='type-logo' />
          <Text>使用微信一键登录</Text>
        </Button>
      </View>
    )
  }
}

export default Login;
