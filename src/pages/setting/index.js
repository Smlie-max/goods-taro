import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'
import Like from '../../components/like'
import { getLabelStatus } from '../../utils/common'
import './index.less'

class Setting extends Component {

  config = {
    navigationBarTitleText: '设置'
  }
  constructor() {
    super(...arguments)
  }

  handleClick(url) {
    if (url == 'userInfo') {
      getLabelStatus()
        .then((res) => {
          if (!res) return
          Taro.navigateTo({
            url: '/pages/' + url + '/index'
          })
        })
    } else {
      Taro.navigateTo({
        url: '/pages/' + url + '/index'
      })
    }
  }
  //清除缓存
  clearData() {
    Taro.showModal({
      title: '提示',
      content: '确定清除缓存数据吗？',
    }).then(res => {
      if (res.confirm) {
        Taro.removeStorageSync('access_token')
        Taro.removeStorageSync('is_login')
        Taro.removeStorageSync('is_label')
        Taro.removeStorageSync('userInfo')
        Taro.showToast({
          title: '清除成功！',
          icon: 'none',
          mask: true
        })
      }
    })
  }
  render() {
    return (
      <View className='settingWrap'>
        <Navbar />
        <Menu />
        <AtList class='list'>
          <AtListItem title='个人信息' arrow='right' onClick={this.handleClick.bind(this, 'userInfo')} />
          {/* <AtListItem title='我的实名认证' arrow='right' onClick={this.handleClick.bind(this, 'certification')} /> */}
          <AtListItem title='我的收货地址' arrow='right' onClick={this.handleClick.bind(this, 'address')} />
        </AtList>
        <AtList class='list'>
          <AtListItem title='清除缓存' arrow='right' onClick={this.clearData.bind(this)} />
        </AtList>
        <Like />
      </View>
    )
  }
}

export default Setting; 
