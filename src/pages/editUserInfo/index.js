import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import AreaPicker from '../../components/areaPicker';

import './index.less'

class EditUserinfo extends Component {

  config = {
    navigationBarTitleText: '编辑'
  }
  constructor() {
    super(...arguments)
    this.state = {
      editType: '',
      value: '',
      genderSelector: ['男', '女'],
    }
  }
  componentWillMount() {
    this.setState({
      editType: this.$router.params.editType,
      value: this.$router.params.value
    })
  }

  componentDidMount() { }

  nicknameChange(value) {
    this.setState({
      value: value
    })
  }
  descChange(value) {
    this.setState({
      value: value
    })
  }
  birthdayChange(e) {
    this.setState({
      value: e.detail.value
    })
  }
  selectArea(myAreas) {
    this.setState({
      value: myAreas
    })
  }
  genderChange(e) {
    let value = '';
    const genderValue = this.state.genderSelector[e.detail.value]
    if (genderValue === '男') {
      value = '1'
    } else {
      value = '2'
    }
    this.setState({
      value: value
    })
  }
  submit() {
    if (this.state.editType == 'address' && this.state.value == '') {
      Taro.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return;
    }
    Request.post(api.editUserInfo, {
      param: this.state.editType,
      value: this.state.value
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          Taro.showToast({
            title: result.msg,
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1400)
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
    const { editType, value, genderSelector } = this.state
    return (
      <View className='editUserInfoWrap'>
        {
          editType === 'nickname' &&
          <AtInput
            border={false}
            title='昵称'
            placeholder='请输入新昵称'
            type='text'
            value={value}
            maxlength={7}
            onChange={this.nicknameChange.bind(this)}
          />
        }
        {
          editType === 'desc' &&
          <AtInput
            border={false}
            title='个性签名'
            placeholder='请输入个性签名'
            type='text'
            value={value}
            maxlength={10}
            onChange={this.descChange.bind(this)}
          />
        }
        {
          editType === 'address' &&
          <View className='picker'>
            <Text className='title'>我的地区</Text>
            <AreaPicker myAreas={value} onSelectArea={this.selectArea.bind(this)} />
          </View>
        }
        {
          editType === 'birthday' &&
          <Picker mode='date' onChange={this.birthdayChange.bind(this)} value={value}>
            <View className='picker'>
              <Text className='title'>我的生日</Text>
              <Text>{value}</Text>
            </View>
          </Picker>
        }
        {
          editType === 'gender' &&
          <Picker mode='selector' onChange={this.genderChange.bind(this)} range={genderSelector}>
            <View className='picker'>
              <Text className='title'>性别</Text>
              {value === '0' &&
                <Text className='gender'>未设置</Text>
              }
              {value === '1' &&
                <Text className='gender'>男</Text>
              }
              {value === '2' &&
                <Text className='gender'>女</Text>
              }
            </View>
          </Picker>
        }
        <View className='submit' onClick={this.submit.bind(this)}>确定</View>
      </View>
    )
  }
}

export default EditUserinfo; 
