import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Button, Form } from '@tarojs/components'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import closeIcon from '../../images/cha.png';
import './index.less'

class Remind extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      realname: '', //姓名
      mobile: '', //手机号码
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  //预约输入
  /* 
    type: 输入类型
  */
  onRemindInput(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }
  onTouchMove(e) {
    e.stopPropagation()
    return
  }
  //提交
  formSubmit(e) {
    if (!this.state.realname) {
      Taro.showToast({
        title: '请输入姓名！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(this.state.mobile))) {
      Taro.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        mask: true
      })
      return
    }
    Request.post(api.seckillbooking, {
      taskid: this.props.taskid, //任务ID 
      roomid: this.props.roomid, //会场ID
      timeid: this.props.timeid, //	时间ID
      goodsid: this.props.goodsid, //商品ID
      realname: this.state.realname, //姓名
      mobile: this.state.mobile, //手机号码
      form_id: e.detail.formId || ''
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
          this.props.onShowRemind(this, true)
        }else{
          Taro.showToast({
            title: result.msg,
            icon: 'none',
            mask: true
          })
          this.props.onShowRemind(this, true)
        }
      }
    )
  }
  render() {
    const { showRemind } = this.props
    return (
      <View className='Remind' onTouchMove={this.onTouchMove.bind(this)}>
        <View className={showRemind ? 'remind-mask isActive' : 'remind-mask'}>
          <Form className={showRemind ? 'remind-main isActive' : 'remind-main'} onSubmit={this.formSubmit.bind(this)} reportSubmit={true} >
            <Image src={closeIcon} className='closeIcon' onClick={this.props.onShowRemind.bind(this, false)} />
            <View className='title'>闪购资格预约登记</View>
            <View className='tips'>恭喜您抢到预约名额</View>
            <View className='tips'> 请填写以下信息进行预约</View>
            <View className='input-area'>
              <View className='input-view'>
                <View className='label'>
                  <Text>姓</Text>
                  <Text>名</Text>
                </View>
                <Input type='text' value={this.state.realname} onInput={this.onRemindInput.bind(this, 'realname')} />
              </View>
              <View className='input-view'>
                <View className='label'>
                  <Text>手</Text>
                  <Text>机</Text>
                  <Text>号</Text>
                  <Text>码</Text>
                </View>
                <Input type='number' maxLength='11' value={this.state.mobile} onInput={this.onRemindInput.bind(this, 'mobile')} />
              </View>
            </View>
            <Button className='remind-btn' formType='submit' onClick={this.formSubmit.bind(this)}>确定预约</Button>
          </Form>
        </View>
      </View>
    )
  }
}
export default Remind; 