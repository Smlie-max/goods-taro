import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Picker } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import rightIcon from '../../images/right.png'
import './index.less'
class FillMemberData extends Component {
  config = {
    navigationBarTitleText: '资料填写'
  }
  constructor() {
    super(...arguments)
    this.state = {
      code: '',
      phone: '',
      disabled: false,
      second: 60,
      gender: ['男', '女'],
      constellation: ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'],
      selectGender: false,
      selectBirth: false,
      selectCon: false,
    }
  }

  showTipText() {
    return this.state.disabled ? `${this.state.second}s后重试` : '发送验证码'
  }
  sendCode() {
    if (this.state.disabled) return
    if (this.state.phone == '') {
      Taro.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return;
    }
    Taro.showLoading({
      title: '请求中'
    })
    Request.post(api.sendCode, {
      mobile: this.state.phone
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code == 0) {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
          this.setState({
            disabled: true
          })
          // 倒计时
          const timer = setInterval(() => {
            if (this.state.second > 0) {
              this.setState({
                second: this.state.second - 1
              })
            } else {
              this.setState({
                second: 60,
                disabled: false
              })
              clearInterval(timer)
            }
          }, 1000)
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }

  handleInput(value) {
    this.setState({
      phone: value
    })
  }
  onCodeInput(e) {
    this.setState({
      code: e.detail.value
    })
  }
  onGenderChange(e) {
    this.setState({
      selectGender: this.state.gender[e.detail.value]
    })
  }
  onBirthChange(e) {
    this.setState({
      selectBirth: e.detail.value
    })
    // 计算出星座
    this.calculateCon(e.detail.value)
  }
  onConChange(e) {
    this.setState({
      selectCon: this.state.constellation[e.detail.value]
    })
  }
  calculateCon(Birth) {
    const constellations = [
      { "Start": 101, "End": 119, "Name": "摩羯座" },
      { "Start": 120, "End": 218, "Name": "水瓶座" }, { "Start": 219, "End": 320, "Name": "双鱼座" },
      { "Start": 321, "End": 419, "Name": "白羊座" }, { "Start": 420, "End": 521, "Name": "金牛座" },
      { "Start": 522, "End": 621, "Name": "双子座" }, { "Start": 622, "End": 722, "Name": "巨蟹座" },
      { "Start": 723, "End": 822, "Name": "狮子座" }, { "Start": 823, "End": 922, "Name": "处女座" },
      { "Start": 923, "End": 1023, "Name": "天秤座" }, { "Start": 1024, "End": 1121, "Name": "天蝎座" },
      { "Start": 1122, "End": 1221, "Name": "射手座" }, { "Start": 1222, "End": 1231, "Name": "摩羯座" }];

    let date = Birth.split("-")
    let day = parseInt(date[2])
    let month = parseInt(date[1])
    var pos = parseInt(month * 100 + day)

    for (var i in constellations) {
      if (pos >= constellations[i].Start && pos <= constellations[i].End) {
        this.setState({
          selectCon: constellations[i].Name
        })
        console.info(constellations[i].Name)
        return;
      }
    }
  }
  save() {
    if (this.state.phone == '') {
      Taro.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return;
    }
    if (this.state.code == '') {
      Taro.showToast({
        title: '请填写验证码',
        icon: 'none'
      })
      return;
    }
    if (!this.state.selectGender) {
      Taro.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return;
    }
    if (!this.state.selectBirth) {
      Taro.showToast({
        title: '请选择生日',
        icon: 'none'
      })
      return;
    }
    if (!this.state.selectCon) {
      Taro.showToast({
        title: '请选择星座',
        icon: 'none'
      })
      return;
    }
    Taro.showLoading({
      title: '保存中'
    })
    const _this = this
    Request.post(api.saveFillData, {
      mobile: this.state.phone,
      verifycode: this.state.code,
      gender: this.state.selectGender == '男' ? '1' : '2',
      birthday: this.state.selectBirth,
      constellation: this.state.selectCon,
      oid1: this.$router.params.oid2 || '',
      oid2: this.$router.params.oid2 || ''
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code == 0) {
          Taro.showToast({
            title: result.msg
          })
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000)
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
    return (
      <View className='fillDataWrap'>
        <View className='title'>请输入你的手机号</View>
        <View className='block'>
          <Text className='label'>手机号</Text>
          <AtInput name='phone' border={false} type='phone' clear placeholder='请输入手机号码' value={this.state.phone} onChange={this.handleInput.bind(this)}>
            <View
              style={{
                'color': this.state.disabled ? '#FF4949' : '',
                'fontSize': '12px',
                'width': '90px'
              }}
              onClick={this.sendCode.bind(this)}
            >
              {this.showTipText()}
            </View>
          </AtInput>
        </View>
        <View className='block'>
          <Text className='label'>验证码</Text>
          <Input value={this.state.code} onChange={this.onCodeInput.bind(this)} className='codeInput'></Input>
        </View>
        <View className='title'>请填写你的信息</View>
        <View className='block'>
          <Text className='label'>性别</Text>
          <View className='right'>
            <Picker mode='selector' range={this.state.gender} onChange={this.onGenderChange.bind(this)}>
              <View className='picker'>
                {this.state.selectGender || '请选择'}
                <Image src={rightIcon} className='rightIcon'></Image>
              </View>
            </Picker>
          </View>
        </View>
        <View className='block'>
          <Text className='label'>生日</Text>
          <View className='right'>
            <Picker mode='date' onChange={this.onBirthChange.bind(this)}>
              <View className='picker'>
                {this.state.selectBirth || '请选择'}
                <Image src={rightIcon} className='rightIcon'></Image>
              </View>
            </Picker>
          </View>
        </View>
        <View className='block'>
          <Text className='label'>星座</Text>
          <View className='right'>
            <Picker mode='selector' range={this.state.constellation} onChange={this.onConChange.bind(this)}>
              <View className='picker'>
                {this.state.selectCon || '请选择'}
                <Image src={rightIcon} className='rightIcon'></Image>
              </View>
            </Picker>
          </View>
        </View>
        <View className='save' onClick={this.save.bind(this)}>保存</View>
      </View>
    )
  }
}

export default FillMemberData; 