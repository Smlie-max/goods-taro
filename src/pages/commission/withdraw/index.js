import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, Picker, Input } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';
import Loading from '../../../components/loading'
import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

import wechat from '../images/wechat.png'
import arrow from '../images/arrow.png'
import Menu from './../../../components/menu/index';

class WithDraw extends Component {
  config = {
    navigationBarTitleText: '提现',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white',
  }

  constructor() {
    super(...arguments)
    this.state = {
      TypeSelector: [], // 选择数组
      bankList: [],//银行显示数组
      typeId: 0, // 选择数组类型ID
      id: "1",
      abonus: "", // 提现金额
      banklist: [], // 银行列表
      way: [],  // 方式数组
      index: 0,//当前选择方式索引
      // 提现表单数据提交
      realname: '',//姓名
      alipay: '',// 支付宝账号
      alipay1: '', // 确认支付宝账号
      bankname: '',//银行名称
      reserved_mobile: '',//银行卡预留手机号
      bankcard: '',// 银行卡号
      bankcard1: '',// 确定银行卡号
      loadingShow: true
    }
  }
  componentWillMount() { }

  componentDidMount() {
    const that = this;
    Request.post(api.distributionAbonus, {}).then(res => {
      that.setState({
        loadingShow: false
      })
      let data = res.data.data;
      // 提现类型处理
      let Array = [];
      for (let i in data.way) {
        Array.push(data.way[i].name)
      }
      // 银行选择预处理
      let bankArr = [];
      for (let i in data.banklist) {
        bankArr.push(data.banklist[i].bankname)
      }
      that.setState({
        abonus: data.abonus,
        banklist: data.banklist,
        way: data.way,
        TypeSelector: Array,
        bankList: bankArr,
        bankname: bankArr[0]
      })
    })
  }

  onTypeChange = e => {
    // 改变选择的值
    // 清空之前输入的东西
    this.setState({
      index: e.detail.value,
      typeId: this.state.way[e.detail.value].id,
      realname: '',//姓名
      alipay: '',// 支付宝账号
      alipay1: '', // 确认支付宝账号
      reserved_mobile: '',//银行卡预留手机号
      bankcard: '',// 银行卡号
      bankcard1: ''// 确定银行卡号
    })
  }

  onBankChange(e) {
    const index = e.detail.value;
    this.setState({
      bankname: this.state.banklist[index].bankname
    })
  }
  agreement() {
    Taro.navigateTo({
      url: `/pages/article/index?type=${12}`
    })
  }
  // 输入事件改变
  onInput(key, e) {
    this.setState({
      [key]: e.detail.value
    }) 
  }

  // 提交数据
  onSubmitData() {
    const that = this;
    const typeId = this.state.typeId;
    let data = {}
    const abonus = this.state.abonus;
    let num = Number(abonus);

    // 判断提现金额,如果为0就无法提取
    if (num <= 1) {
      Taro.showToast({
        title: '提现额度不得低于1元',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    Taro.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })

    switch (typeId) {
      case 1:
        data = {
          typeid: 1
        }
        break;
      case 2: data = {
        typeid: 2,
        realname: that.state.realname,
        alipay: that.state.alipay,
        alipay1: that.state.alipay1
      }
        break;
      case 3: data = {
        typeid: 3,
        realname: that.state.realname,
        bankname: that.state.bankname,
        reserved_mobile: that.state.reserved_mobile,
        bankcard: that.state.bankcard,
        bankcard1: that.state.bankcard1
      }
        break;
    }
    // 输入检测机制
    if (this.state.alipay1 !== this.state.alipay) {
      Taro.showToast({
        title: '支付宝账号不一致',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 银行卡输入检测
    if (this.state.bankcard !== this.state.bankcard1) {
      Taro.showToast({
        title: '银行卡不一致',
        icon: 'none',
        duration: 2000
      })
      return
    }

    Request.post(api.distributionAbonusWithdraw, data).then(res => {
      if (res.data.code === 0) {
        Taro.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        // 成功之后跳转
        Taro.navigateTo({
          url: '/pages/commission/withdrawSuccess/index'
        })
      } else {
        Taro.showToast({
          title: '提现失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  render() {
    const { abonus, banklist, way, index, loadingShow } = this.state
    return (
      loadingShow
        ? <Loading show={this.state.loadingShow} title='加载中' />
        : <View className="WithDrawMain">
          <Navbar bgColor='#253C6D' />
          <Menu></Menu>
          <View className='bgc'></View>
          <View className='bgc-color'></View>
          <View className='main-contant'>
            <View className='money-contant'>
              <View className='title'>提款金额</View>
              <View className='des'>可提现佣金(¥)</View>
              <View className='value' >¥{abonus}</View>
            </View>
            <View className='input'>¥{abonus}</View>
            <View className='choose-contant'>
              <Picker className='choose-box' mode='selector' range={this.state.TypeSelector} onChange={this.onTypeChange}>
                <View className='choose-row'>
                  <View className='title' >提现到</View>
                  <Image className='icon' src={way[index].icon}></Image>
                  <View className='type'>{way[index].name}</View>
                  <Image className='arrow' src={arrow}></Image>
                </View>
              </Picker>
              {
                way[index].id === 3 && <View className="label-contant">
                  <View className='label-row'>
                    <View className='key'>身份证姓名</View>
                    <Input className='value' type='text' placeholder='请输入身份证姓名' value={this.state.realname} onInput={this.onInput.bind(this, "realname")} />
                  </View>
                  <View className='label-row'>
                    <View className='key'>开户银行</View>
                    <Picker className='value' mode='selector' range={this.state.bankList} onChange={this.onBankChange}>
                      <View>{this.state.bankname}</View>
                    </Picker>
                  </View>
                  <View className='label-row'>
                    <View className='key'>银行卡账户</View>
                    <Input className='value' type='number' placeholder='请输入卡号' value={this.state.bankcard} onInput={this.onInput.bind(this, "bankcard")} />
                  </View>
                  <View className='label-row'>
                    <View className='key'>请确定银行账户</View>
                    <Input className='value' type='number' placeholder='请输再次输入卡号' value={this.state.bankcard1} onInput={this.onInput.bind(this, "bankcard1")} />
                  </View>
                  <View className='label-row'>
                    <View className='key'>预留手机号码</View>
                    <Input className='value' type='number' maxLength='13' placeholder='请输入手机号码' value={this.state.reserved_mobile} onInput={this.onInput.bind(this, "reserved_mobile")} />
                  </View>
                </View>
              }
              {
                way[index].id === 2 && <View className="label-contant">
                  <View className='label-row'>
                    <View className='key'>姓名</View>
                    <Input className='value' type='text' placeholder='请输入姓名' value={this.state.realname} onInput={this.onInput.bind(this, "realname")} />
                  </View>
                  <View className='label-row'>
                    <View className='key'>支付宝账号</View>
                    <Input className='value' type='number' placeholder='请输入支付宝账号' value={this.state.alipay} onInput={this.onInput.bind(this, "alipay")} />
                  </View>
                  <View className='label-row'>
                    <View className='key'>确定支付宝账户</View>
                    <Input className='value' type='number' placeholder='请再次输入支付宝账号' value={this.state.alipay1} onInput={this.onInput.bind(this, "alipay1")} />
                  </View>
                </View>
              }
              <View className='button' onClick={this.onSubmitData.bind(this)}>
                提交申请
        </View>
            </View>
          </View>
           
        <View className='agreement'>
          <Text>提现即视为同意</Text>
          <Text onClick={this.agreement.bind(this)}>《FDG会员-用户协议》</Text>
        </View>
        </View>
        
    )
  }
}

export default WithDraw;
