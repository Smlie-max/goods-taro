import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

import card from '../images/card.png'

import one from '../images/1.png';
import two from '../images/2.png';
import three from '../images/3.png';
import four from '../images/4.png';
import five from '../images/5.png';
import six from '../images/6.png';
import Menu from './../../../components/menu/index';

class CommissionHome extends Component {
  config = {
    navigationBarTitleText: '分销中心',
    navigationBarBackgroundColor:'#253C6D',
    navigationBarTextStyle:'white',
  }

  constructor() {
    super(...arguments)
    this.state = {
      info: {},
      avtar: "",
      userId:{},
      nickname:''
    }
  }

  componentDidMount() {
    const that = this;
    // 请求参数,客户参数
    Request.post(api.distribution, {}).then(
      res => {
        const info = res.data.data;
        console.log(info)
        that.setState({
          info: info
        })
      }
    )
  
    // 读取头像
    const data = Taro.getStorageSync('userInfo').avatarUrl
    // 读取昵称
    const nickname=Taro.getStorageSync('userInfo').nickName
    // 读取用户id
    const userId = Taro.getStorageSync('user_id')
    this.setState({
      avtar: data,
      userId:userId,
      nickname:nickname
    })
  }
//跳转
  shopp(page){
    // if(process.env.TARO_ENV === 'h5'){
    //   var redirect_uri = "https://www.fdg1868.cn/h5/#/pages/commission/myShop/index";
    //   // 登录使用code
    //   Request.post(api.H5Login, {
    //     redirect_uri: redirect_uri,
    //     snsapi: 'snsapi_base',
    //     // test: 1
    //   }).then(
    //     res => {
    //       const result = res.data
    //       if (result.code === 0) {
    //         location.href = result.data.url
    //       } else {
    //         Taro.showToast({
    //           title: result.msg,
    //           icon: 'none'
    //         })
    //       }
    //     }
    //   )   
    // }else if(process.env.TARO_ENV === 'weapp'){
      Taro.navigateTo({
        url: page
      })
    // }
  }
  // 跳转路由
  jumpToPage(page) {
    Taro.navigateTo({
      url: page
    })
  }

  render() {
    const { info, avtar,userId,nickname } = this.state
    return <View className="main">
     <Menu />
      <Navbar bgColor="#253C6D"></Navbar>
      <Menu></Menu>
      <View className='home-main-contant'>
        <View className='bgc'>
          <View className='home-card-contant'>
            <Image className='card-bgc' src={card}>
            </Image>
            <View className='homeCard'>
              <View className='person-contant'>
                <View className='avatar-contant'>
                  <Image className='img' src={avtar}></Image>
                </View>
               <View className="userInfo">
               <View className='name'>{nickname}</View>
                <Text className='userId'>id:{userId}</Text>
               </View>
                
                <View className='level-contant'>
                  {info.levelname}
                </View>
              </View>
              <View className="money-contant">
                <View className='money-item'>
                  <View className='title'>成功提现佣金(¥)</View>
                  <View className='number'>{info.success_withdraw}</View>
                  <View className='button' onClick={this.jumpToPage.bind(this, "/pages/commission/order/index")}>
                    提现明细
                  </View>
                </View>
                <View className='money-item'>
                  <View className='title'>可提现佣金(¥)</View>
                  <View className='number'>{info.can_withdraw}</View>
                  <View className='button' onClick={this.jumpToPage.bind(this, "/pages/commission/withdraw/index")}>
                    提现
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="menu-contant">
          <View className="menu-item">
            <View className='img-contant' onClick={this.jumpToPage.bind(this, "/pages/commission/commission/index")}>
              <Image className='img' src={one}></Image>
            </View>
            <View className='title' >分销佣金</View>
          </View>
          <View className="menu-item" onClick={this.jumpToPage.bind(this, "/pages/commission/distributionOrder/index")}>
            <View className='img-contant'>
              <Image className='img' src={two}></Image>
            </View>
            <View className='title'>佣金明细</View>
          </View>
          <View className="menu-item" onClick={this.jumpToPage.bind(this, "/pages/commission/myTeam/index")}>
            <View className='img-contant'>
              <Image className='img' src={three}></Image>
            </View>
            <View className='title' >我的团队</View>
          </View>
          <View className="menu-item" onClick={this.jumpToPage.bind(this, "/pages/commission/ad/index")}>
            <View className='img-contant'>
              <Image className='img' src={four}></Image>
            </View>
            <View className='title'>推广专码</View>
          </View>
          <View className="menu-item" onClick={this.shopp.bind(this, "/pages/commission/myShop/index")}>
            <View className='img-contant'>
              <Image className='img' src={five}></Image>
            </View>
            <View className='title'>我的小店</View>
          </View>
          <View className="menu-item" onClick={this.jumpToPage.bind(this, "/pages/commission/article/index")}>
            <View className='img-contant'>
              <Image className='img' src={six}></Image>
            </View>
            <View className='title'>文章中心</View>
          </View>
        </View>
      </View>
    </View>
  }
}

export default CommissionHome;
