import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Like from '../../components/like'
import Request from '../../utils/request';
import { api } from '../../utils/api';

import './index.less'
class ReBind extends Component {

  config = {
    navigationBarTitleText: '换绑手机'
  }
  constructor() {
    super(...arguments)
    this.state = {
      disabled: false,
      second: 60,
      mobile: '',
      code: '',
      first_step: true
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  showTipText() {
    return this.state.disabled ? `${this.state.second}s` : '验证码'
  }
  sendCode() {
    if (!(/^1[34578]\d{9}$/.test(this.state.mobile))) {
      Taro.showToast({
        title: '请输入正确的手机号！',
        icon: 'none'
      })
      return
    }
    if (this.state.disabled) return
    this.setState({
      disabled: true
    })
    this.countDown()
    Taro.showLoading({
      title: '发送中'
    })
    Request.post(api.sendCode, {
      mobile: this.state.mobile,
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        Taro.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
    )
  }
  // 倒计时
  countDown() {
    this.timer = setInterval(() => {
      if (this.state.second > 0) {
        this.setState({
          second: this.state.second - 1
        })
      } else {
        this.setState({
          second: 60,
          disabled: false
        })
        clearInterval(this.timer)
      }
    }, 1000)
  }
  handleInput(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }
  //验证手机号
  submit() {
    if (this.state.mobile === '') {
      Taro.showToast({
        title: '请输入手机号码！',
        icon: 'none'
      })
      return
    }
    if (this.state.code === '') {
      Taro.showToast({
        title: '请输入验证码！',
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '请稍候'
    })
    Request.post(api.checkOldMobile, {
      mobile: this.state.mobile,
      verifycode: this.state.code
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            first_step: false,
            mobile: '',
            code: '',
            disabled: false,
            second: 60
          })
          clearInterval(this.timer)
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }
  //完成
  finish() {
    if (this.state.mobile === '') {
      Taro.showToast({
        title: '请输入手机号码！',
        icon: 'none'
      })
      return
    }
    if (this.state.code === '') {
      Taro.showToast({
        title: '请输入验证码！',
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '请稍候'
    })
    Request.post(api.reBindMobile, {
      mobile: this.state.mobile,
      verifycode: this.state.code
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          Taro.showModal({
            title: '提示',
            content: '绑定成功',
            showCancel: false,
          }).then(res => {
            if (res.confirm) {
              clearInterval(this.timer)
              this.setState({
                first_step: true,
                mobile: '',
                code: '',
                disabled: false,
                second: 60
              }, () => {
                Taro.navigateBack()
              })
            }
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }
  render() {
    const { first_step, disabled, mobile, code } = this.state
    return (
      <View className='ReBind'>
        <Navbar />
        <Menu />
        <View className='phone-view'>
          <View className='title'>
            {first_step ? '请输入原来绑定的手机号' : '请输入新的手机号'}
          </View>
          <View className='input-view'>
            <Text className='label'>
              {first_step ? '旧手机号' : '新手机号'}
            </Text>
            <Input
              placeholder='请输入手机号'
              type='phone'
              value={mobile} onInput={this.handleInput.bind(this, 'mobile')}
            />
            <Button
              className='btn'
              onClick={this.sendCode.bind(this)}
              style={{
                'color': disabled ? '#FF4949' : '',
              }}
            >
              {this.showTipText()}
            </Button>
          </View>
        </View>

        <View className='code'>
          <View className='label'>验证码</View>
          <Input
            placeholder='请输入验证码'
            type='number'
            value={code}
            onInput={this.handleInput.bind(this, 'code')}
          />
        </View>
        {
          first_step
            ? <View className='submit' onClick={this.submit.bind(this)}>下一步</View>
            : <View className='submit' onClick={this.finish.bind(this)}>完成</View>
        }
        <Like />
      </View>
    )
  }
}

export default ReBind; 