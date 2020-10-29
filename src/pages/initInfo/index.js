import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import AreaPicker from '../../components/areaPicker';

import { api } from '../../utils/api';
import Request from '../../utils/request';
import './index.less'
import part1 from '../../images/part1.png'
import part2 from '../../images/part2.png'
import selectIcon from '../../images/gou.png'
class Login extends Component {
  config = {
    navigationBarTitleText: '完善资料'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      myAreas: '', //地区
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.interestList, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data

        if (result.code == 0) {
          this.setState({
            list: result.data
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

  selectArea(myAreas) {
    this.setState({
      myAreas: myAreas
    })
  }

  onSelect(id) {
    var list = this.state.list
    list.map((item) => {
      if (item.id == id) {
        item.select = !item.select;
        this.setState({
          list: list
        })
      }
    })
  }
  onSave() {
    if (this.state.myAreas === '请选择地区') {
      Taro.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return;
    }
    const arr = [];
    this.state.list.map((item) => {
      if (item.select) {
        arr.push(item.id)
      }
    })
    Request.post(api.initInfo, {
      groupid: arr,
      areas: this.state.myAreas,
      // datavalue: this.state.areas
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          Taro.setStorageSync('is_label', true) //是否已填资料
          Taro.showToast({
            title: result.msg,
            mask: true
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        } else {
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false
          }).then(res => {
            if (res.confirm) {
              Taro.navigateBack()
            }
          })
        }
      }
    )
  }
  render() {
    const { list, myAreas } = this.state
    return (
      <View className='initInfoWrap'>
        <View className='part'>
          <Image src={part1} className='part-pic1' mode='widthFix'></Image>
          <View className='title'>不容错过每一场精彩的线下活动</View>
          <View className='picker'>
            <AreaPicker myAreas={myAreas} onSelectArea={this.selectArea.bind(this)} />
          </View>
        </View>
        <View className='part'>
          <Image src={part2} className='part-pic2' mode='widthFix'></Image>
          <View className='title'>选择专属你的个性定制，为你推荐更多精品</View>
        </View>
        <View className='interest-list'>
          {
            list.map((item) => {
              return (
                <View
                  className='list'
                  key={item.id}
                  onClick={this.onSelect.bind(this, item.id)}
                >
                  <Image src={item.pic_url} className={item.select ? 'active pic' : 'pic'} ></Image>
                  <View>{item.groupname}</View>
                  {
                    item.select &&
                    <Image src={selectIcon} className='selectIcon'></Image>
                  }
                </View>
              )
            })
          }
        </View>
        <View className='save' onClick={this.onSave.bind(this)}>保存</View>
      </View>
    )
  }
}

export default Login; 