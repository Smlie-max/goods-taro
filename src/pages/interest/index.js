import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import selectIcon from '../../images/gou.png'
import './index.less'

class Interest extends Component {

  config = {
    navigationBarTitleText: '选择兴趣标签'
  }
  constructor(props) {
    super(props)
    this.state = {
      list: []
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

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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
    const arr = [];
    this.state.list.map((item) => {
      if (item.select) {
        arr.push(item.id)
      }
    })
    Request.post(api.saveInterest, {
      groupid: arr
    }).then(
      res => {
        const result = res.data
        Taro.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
    )
  }
  render() {
    const { list } = this.state

    return (
      <View className='interestWrap'>
        <Navbar />
        <Menu />
        <View className='tips'>可多选，至少选一项</View>
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

export default Interest; 