import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import rightIcon from '../../../images/choose-right.png'
import close from '../../../images/cha.png'
import './index.less'

class ExpressInfo extends Component {
  config = {
    navigationBarTitleText: '填写信息'
  }
  constructor() {
    super(...arguments)
    this.state = {
      showMask: false,
      expressList: [],
      expressid: '', //快递id
      expresssn: '', //快递单号
      expressName: ''
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.expressList, {}).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            expressList: result.data.list
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
        }
      }
    )
  }
  onShowMask() {
    this.setState(prevState => ({
      showMask: !prevState.showMask
    }))
  }

  chooseExpress(id, name) {
    this.setState({
      expressid: id,
      expressName: name,
      showMask: false
    })
  }

  expresssn(e) {
    this.setState({
      expresssn: e.detail.value
    })
  }

  submit() {
    const { expressid, expresssn } = this.state
    if (expressid == '') {
      Taro.showToast({
        title: '请选择快递公司',
        icon: 'none'
      })
      return
    }
    if (expresssn == '') {
      Taro.showToast({
        title: '请填写快递单号',
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '正在提交'
    })
    Request.post(api.fillExpress, {
      id: this.$router.params.id,
      expressid: expressid,
      expresssn: expresssn
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1400)
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
        }
      }
    )
  }

  render() {
    const { showMask, expressList, expressName } = this.state
    return (
      <View className='ExpressInfo'>
        <Navbar bgColor='#1E3468' />
        <View className='item'>
          <View className='title'>快递公司</View>
          <View className='row' onClick={this.onShowMask.bind(this)}>
            <Text>{expressName || '选择快递公司'}</Text>
            <Image src={rightIcon} className='rightIcon' />
          </View>
        </View>
        <View className='item'>
          <View className='title'>快递单号</View>
          <View className='row'>
            <Input className='input' placeholder='填写快递单号' type='text' onInput={this.expresssn.bind(this)} />
          </View>
        </View>
        <View className='next' onClick={this.submit.bind(this)}>确定</View>
        {/* 快递选择 */}
        < View className={showMask ? 'layoutCover layoutShow' : 'layoutCover'} >
          <View className='layoutMask' onClick={this.onShowMask.bind(this)}></View>
          <View className='layoutMain'>
            <View className='layoutHeader'>
              <Image src={close} className='close' onClick={this.onShowMask.bind(this)} />
            </View>
            <View className='layoutBody'>
              {
                expressList.map((item) => {
                  return (
                    <View className='list' key={item.id} onClick={this.chooseExpress.bind(this, item.id, item.name)}>{item.name}</View>
                  )
                })
              }
            </View>
          </View>
        </View >
      </View>
    )
  }
}

export default ExpressInfo; 
