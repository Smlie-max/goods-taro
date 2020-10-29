import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView, Input } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

import suceesLogo from '../images/successLogo.png'
import Menu from './../../../components/menu/index';

class withdrawSuccess extends Component {
  config = {
    navigationBarTitleText: '提现',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super(...arguments)
    this.state = {
      showList: [],
      type_list: [],
      id: "1"
    }
  }
  
  back() {
    Taro.navigateBack({ delta: 2 })
  }

  render() {

    return <View className="main">
      <Navbar></Navbar>
      <Menu></Menu>
      <View className='main-contant'>
        <View className='title-contant'>
          <Image className='img' src={suceesLogo}></Image>
          <View className='value-contant'>
            <View className='status'>提现申请成功</View>
            <View className='des'>请耐心等待总部审核</View>
          </View>
        </View>
        <View className='button' onClick={this.back.bind(this)}>
          确认返回
        </View>
      </View>
    </View>
  }
}

export default withdrawSuccess;
