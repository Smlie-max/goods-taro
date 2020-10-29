import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import { AtFloatLayout } from "taro-ui"
import Loading from '../../components/loading';

import rightIcon from '../../images/choose-right.png'
import './index.less'

class Invoice extends Component {
  config = {
    navigationBarTitleText: '申请发票'
  }
  constructor() {
    super(...arguments)
    this.state = {
      invoiceType: 1,
      showLayout: false,
      name: '', //企业抬头
      number: '', //企业税号
      id: '',//订单id
      invoice_type: [],
      order_info: {},
      loadingShow: true,
      pageShow: false
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }

  componentDidMount() {
    this.getDetail(this.$router.params.id)
  }

  getDetail(id) {
    Request.post(api.invoice, {
      id: id
    }).then(
      res => {
        const result = res.data
        this.setState({
          loadingShow: false
        })
        if (result.code === 0) {
          this.setState({
            invoice_type: result.data.invoice_type,
            order_info: result.data.order_info,
            pageShow: true
          })
        }
        else {
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false,
          }).then(res => {
            if (res.confirm) {
              Taro.navigateBack()
            }
          })
        }
      }
    )
  }
  chooseType(type) {
    this.setState({
      invoiceType: type
    })
    this.onShowLayout(false)
  }
  onShowLayout(isOpen) {
    this.setState({
      showLayout: isOpen
    })
  }
  onInput(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }
  submit() {
    const name = this.state.name
    const number = this.state.number
    const invoiceType = this.state.invoiceType
    if (invoiceType === 2) {
      if (name === '') {
        Taro.showToast({
          title: '请输入企业抬头',
          mask: true,
          icon: 'none'
        })
        return
      }
      if (number === '') {
        Taro.showToast({
          title: '请输入企业税号',
          mask: true,
          icon: 'none'
        })
        return
      }
    }
    Request.post(api.invoiceSubmit, {
      id: this.state.id,
      invoice_title: name,
      invoice_num: number,
      invoice_type: invoiceType
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
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
        else {
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
    const { invoiceType, showLayout, pageShow, invoice_type, order_info } = this.state
    return (
      <View className='Invoice'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <Loading show={this.state.loadingShow} title='加载中' />
        {
          pageShow
            ? <View>
              <View className='invoiceWrap'>
                <View className='barTop'>
                  <View className='item'>
                    <Text className='order-num-title'>订单编号</Text>
                    <Text className='order-price-title'>合计金额(不包括海外)</Text>
                  </View>
                  <View className='item'>
                    <View className='order-num'>{order_info.ordersn}</View>
                    <View className='order-price'>￥{order_info.price}</View>
                  </View>
                </View>
                <View className='main'>
                  <View className='item'>
                    <View className='item-label'>发票类型</View>
                    <View className='item-title'>电子增值税普通发票</View>
                  </View>
                  <View className='item' onClick={this.onShowLayout.bind(this, true)}>
                    <View className='item-label'>发票抬头类</View>
                    <View className='item-title'>{invoiceType === 1 ? '个人' : '企业'}</View>
                    <Image className='rightIcon' src={rightIcon} />
                  </View>
                  {
                    invoiceType === 2 &&
                    <View className='form-info'>
                      <View className='form-item'>
                        <View className='top'>
                          <Text>企业抬头</Text>
                          <Text className='tips'>必填</Text>
                        </View>
                        <Input placeholder='请输入企业抬头' type='text' onInput={this.onInput.bind(this, 'name')} className='input' />
                      </View>
                      <View className='form-item'>
                        <View className='top'>
                          <Text>企业税号</Text>
                          <Text className='tips'>必填</Text>
                        </View>
                        <Input placeholder='请输入企业税号' type='text' onInput={this.onInput.bind(this, 'number')} className='input' />
                      </View>
                    </View>
                  }
                  <View className='submit' onClick={this.submit.bind(this)}>提交申请</View>
                  <View className='notice'>部分海外商品不支持开票，请知晓</View>
                </View>
              </View>
              <AtFloatLayout
                isOpened={showLayout}
                title="选择发票抬头"
                onClose={this.onShowLayout.bind(this, false)}
              >
                <View className='type-view'>
                  {
                    invoice_type.map((item) => {
                      return (
                        <View
                          className={item.id === invoiceType ? 'invoice-type active' : 'invoice-type'}
                          onClick={this.chooseType.bind(this, item.id)}
                          key={item.id}
                        >
                          {item.name}
                        </View>
                      )
                    })
                  }
                </View>
              </AtFloatLayout>
            </View>
            : <View />
        }

      </View>
    )
  }
}

export default Invoice; 
