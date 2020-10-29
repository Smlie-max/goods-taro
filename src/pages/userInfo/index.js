import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'
import './index.less'

class Userinfo extends Component {

  config = {
    navigationBarTitleText: '个人资料'
  }
  constructor() {
    super(...arguments)
    this.state = {
      avatar: '',
      nickname: '',
      // province: '',
      // city: '',
      // area: '',
      desc: '',
      myAreas: '',
      birthday: '',
      gender: '0', //性别 0--未知 1--男 2--女
      is_identity: 0, //是否已实名认证 0--未认证 1--已认证
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentDidShow() {
    this.getUserInfo()
  }

  getUserInfo() {
    Request.post(api.getMemberInfo, {}).then(
      res => {
        const result = res.data
        if (result.code == 0) {
          this.setState({
            avatar: result.data.avatar,
            nickname: result.data.nickname,
            desc: result.data.desc,
            // province: result.data.province,
            // city: result.data.city,
            // area: result.data.area,
            myAreas: result.data.areas,
            birthday: result.data.birthday,
            gender: result.data.gender,
            genderCode: result.data.gender,
            is_identity: result.data.is_identity //是否已实名认证 0--未认证 1--已认证
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
  myInterest() {
    Taro.navigateTo({
      url: '/pages/interest/index'
    })
  }
  //修改资料
  editUserInfo(editType, value) {
    if (editType === 'address' && value !== '') {
      Taro.showToast({
        title: '地区不能修改！',
        icon: 'none'
      })
      return
    }
    if (editType === 'birthday' && value !== '') {
      Taro.showToast({
        title: '生日不能修改！',
        icon: 'none'
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/editUserInfo/index?editType=${editType}&value=${value}`
    })
  }
  //账号安全
  rebind() {
    Taro.navigateTo({
      url: `/pages/reBind/index`
    })
  }
  render() {
    const { avatar, nickname, desc, birthday, gender, is_identity, myAreas } = this.state
    return (
      <View className='UserInfoWrap'>
        <Navbar />
        <Menu />
        <View className='thumb-view'>
          <Image src={avatar} class='thumb'></Image>
        </View>
        <AtList class='list'>
          <AtListItem title='昵称' extraText={nickname} arrow='right' onClick={this.editUserInfo.bind(this, 'nickname', nickname)} />
          <AtListItem title='个性签名' extraText={desc === '' ? '未设置' : desc} arrow='right' onClick={this.editUserInfo.bind(this, 'desc', desc)} />
          <AtListItem title='所在地区' extraText={myAreas === '' ? '未设置' : myAreas} arrow='right' onClick={this.editUserInfo.bind(this, 'address', myAreas)} />
          <AtListItem title='生日' extraText={birthday === '' ? '未设置' : birthday} arrow='right' onClick={this.editUserInfo.bind(this, 'birthday', birthday)} />
          {gender === '0' &&
            <AtListItem title='性别' extraText='未设置' arrow='right' onClick={this.editUserInfo.bind(this, 'gender', gender)} />
          }
          {gender === '1' &&
            <AtListItem title='性别' extraText='男' arrow='right' onClick={this.editUserInfo.bind(this, 'gender', gender)} />
          }
          {gender === '2' &&
            <AtListItem title='性别' extraText='女' arrow='right' onClick={this.editUserInfo.bind(this, 'gender', gender)} />
          }
          <AtListItem title='实名认证' extraText={is_identity === '0' ? '未认证' : '已认证'} arrow='right' />
          <AtListItem title='账号安全' arrow='right' onClick={this.rebind.bind(this)} />
          <AtListItem title='感兴趣标签' arrow='right' onClick={this.myInterest.bind(this)} />
        </AtList>
      </View>
    )
  }
}

export default Userinfo; 
