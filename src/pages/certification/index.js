import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import uploadImg from '../../utils/uploadImg';

import id1 from '../../images/id1.jpg'
import id2 from '../../images/id2.jpg'
import idCard1 from '../../images/idCard1.jpg'
import idCard2 from '../../images/idCard2.jpg'
import './index.less'

class Certification extends Component {
  config = {
    navigationBarTitleText: '实名认证'
  }
  constructor() {
    super(...arguments)
    this.state = {
      realname: '', //姓名
      number: '', //身份证号码
      face: '', //身份证正面照
      back: '', //身份证反面照
      identity_pic_url1: '', //服务器返回的正面照路径
      identity_pic_url2: '', //服务器返回的反面照路径
    }
  }
  componentWillMount() { }
  componentDidMount() { }

  // 输入框
  onInput(type, e) {
    this.setState({
      [type]: e.detail.value
    })
  }

  //选择图片
  /* 
  type： 正面face 反面back
   */
  async chooseImage(type) {
    const self = this
    if (process.env.TARO_ENV === 'weapp') {
      Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          self.upload(type, tempFilePaths)
        }
      })
    } else if (process.env.TARO_ENV === 'h5') {
      var wx = require('m-commonjs-jweixin');
      wx.ready(function () {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            self.upload(type, localIds)
          }
        })
      })
    }
  }
  async upload(type, tempFilePaths) {
    await uploadImg(tempFilePaths).then(res => {
      if (type === 'face') {
        this.setState({
          identity_pic_url1: res[0].filename,
          [type]: res[0].url
        })
      } else if (type === 'back') {
        this.setState({
          identity_pic_url2: res[0].filename,
          [type]: res[0].url
        })
      }
    })
  }
  //提交
  submit() {
    const { realname, number, identity_pic_url1, identity_pic_url2 } = this.state
    if (realname === '') {
      Taro.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    }
    if (number === '') {
      Taro.showToast({
        title: '请输入身份证号码',
        icon: 'none'
      })
      return
    }
    if (identity_pic_url1 === '' || identity_pic_url2 === '') {
      Taro.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '正在提交',
      mask: true
    })
    Request.post(api.certification, {
      identity_realname: this.state.realname,
      identity_number: this.state.number,
      identity_pic_url1: this.state.identity_pic_url1,
      identity_pic_url2: this.state.identity_pic_url2,
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code === 0) {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }
  render() {
    const { realname, number, face, back } = this.state
    return (
      <View className='Certification'>
        <Navbar />
        <Menu />
        <View className='input_view'>
          <Text className='labelText'>真实姓名</Text>
          <Input className='input' type='text' placeholder='请输入你身份证的姓名' value={realname} onInput={this.onInput.bind(this, 'realname')} />
        </View>
        <View className='input_view'>
          <Text className='labelText'>身份证号</Text>
          <Input className='input' type='text' placeholder='填写后我们将加密处理' value={number} onInput={this.onInput.bind(this, 'number')} />
        </View>
        <View className='img_view'>
          {/* <Image src={rule} className='rule' /> */}
          <View className='title'>请上传身份证照片，补充实名认证信息</View>
          <View className='tip'>* 请上传原始比例清晰的身份证正反面，请勿进行裁剪、涂改，否则无法通过审核。</View>
          <View className='tip'>* 照片格式支持jpg,jpeg,png。</View>
          <View className='tip'>* 身份证照片信息将加密处理，仅用于清关使用。</View>
          <View className='id_card'>
            <Image src={face || id1} className='idCard' onClick={this.chooseImage.bind(this, 'face')} />
            <Image src={back || id2} className='idCard' onClick={this.chooseImage.bind(this, 'back')} />
          </View>
        </View>
        <View className='demo_view'>
          <View className='item'>
            <Image src={idCard1} className='idCard' />
            <Text>示例</Text>
          </View>
          <View className='item'>
            <Image src={idCard2} className='idCard' />
            <Text>示例</Text>
          </View>
        </View>
        <View className='submit' onClick={this.submit.bind(this)}>提交</View>
      </View>
    )
  }
}

export default Certification;
