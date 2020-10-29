import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView, Input } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

class BecomeShop extends Component {
  config = {
    navigationBarTitleText: '成为门店',
  }

  constructor(props) {
    super(props)
    this.state = {
      showList: [],
      type_list: [],
      id: "1"
    }
  }

  render() {
    return <View className="main">
      <View className='img-contant'>
        <Image className='img' mode='widthFix' src='https://jdc.jd.com/img/690'></Image>
      </View>
      <ScrollView scrollY='true' className='main-contant'>
        <View className='text-contant'>选择类型</View>
        <View className='type-contant'>
          <View className='item'>
            <View className='icon'>
              <Image className='image'></Image>
            </View>
            <View className='text'>机构</View>
          </View>
          <View className='item'>
            <View className='icon'>
              <Image className='image'></Image>
            </View>
            <View className='text'>个人</View>
          </View>
        </View>
        <View className='text-contant'>选择门店信息</View>
        <View className='type-contant'>
          <View className='item'>
            <View className='icon'>
              <Image className='image'></Image>
            </View>
            <View className='text'>线下</View>
          </View>
          <View className='item'>
            <View className='icon'>
              <Image className='image'></Image>
            </View>
            <View className='text'>线上</View>
          </View>
        </View>
        <View className='text-contant'>申请人</View>
        <View className='input-contant'>
          <View className='avatar'>
            <Image className='img' src='https://jdc.jd.com/img/88'></Image>
          </View>
          <Input className='input'></Input>
        </View>
        <View className='text-contant'>联系方式</View>
        <View className='input-contant'>
          <View className='avatar'>
            <Image className='img' src='https://jdc.jd.com/img/88'></Image>
          </View>
          <Input className='input'></Input>
        </View>
        <View className='text-contant'>所在地区</View>
        <View className='input-contant'>
          <View className='avatar'>
            <Image className='img' src='https://jdc.jd.com/img/88'></Image>
          </View>
          <Input className='input'></Input>
        </View>
        <View className='button-contant'>
          <View className='sub-contant'>提交审核</View>
          <View className='connect-contant'>联系客服</View>
        </View>
      </ScrollView>
    </View>
  }
}

export default BecomeShop;
