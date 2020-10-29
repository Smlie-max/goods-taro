import Taro, { Component } from '@tarojs/taro'
import { View, Image, Input, Text, ScrollView } from '@tarojs/components'

import Request from '../../../utils/request';
import AreaPicker from '../../../components/areaPicker';
import { api } from '../../../utils/api';
import top from '../images/top.png'
import uploadImg from '../../../utils/uploadImg';
import id1 from '../../../images/id1.jpg'
import id2 from '../../../images/id2.jpg'
import idCard1 from '../../../images/idCard1.jpg'
import idCard2 from '../../../images/idCard2.jpg'
import rightIcon from '../../../images/right.png'
import './formInfo.less'

class FormInfo extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      name: '',
      idcard: '', //身份证
      realname: '', //收货人姓名
      mobile: '', //手机
      address: '', //详细地址
      myAreas: '', //地区
      identity_pic_url1: '', //服务器返回的正面照路径
      identity_pic_url2: '', //服务器返回的反面照路径
      face: '', //身份证正面照
      back: '', //身份证反面照
    }
  }

  onShowFormMask() {
    this.props.onShowFormMask()
  }

  selectArea(myAreas) {
    this.setState({
      myAreas: myAreas
    })
  }
  //获取输入的值
  onInput(inputType, e) {
    this.setState({
      [inputType]: e.detail.value
    })
  }
  //提交
  submitInfo() {
    if (!this.state.name || !this.state.idcard || !this.state.realname || !this.state.mobile || !this.state.myAreas || !this.state.address) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    if (this.state.identity_pic_url1 === '' || this.state.identity_pic_url2 === '') {
      Taro.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '领取中'
    })
    Request.post(api.getGift, {
      order_id: this.props.order_id,
      name: this.state.name,
      idcard: this.state.idcard,
      realname: this.state.realname,
      mobile: this.state.mobile,
      areas: this.state.myAreas,
      address: this.state.address,
      identity_pic_url1: this.state.identity_pic_url1,
      identity_pic_url2: this.state.identity_pic_url2
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        Taro.showToast({
          title: result.msg,
          mask: true,
          icon: 'none'
        });
        if (result.code === 0) {
          Taro.redirectTo({
            url: '/pages/gift/giftDetail/success?order_id=' + this.props.order_id
          })
        }
      }
    )
  }
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
  argeement() {
    Taro.navigateTo({
      url: `/pages/article/index`
    })
  }
  render() {
    const { name, idcard, realname, mobile, address, face, back } = this.state
    const { showFormMask } = this.props
    return showFormMask &&
      <View className='formInfo'>
        <View className='main'>
          <Image src={top} className='close' onClick={this.onShowFormMask.bind(this)} />
          <ScrollView
            scrollY
            className='scrollview'
          >
            <View className='title'>实名信息</View>
            <View className='block'>
              <View className='input-view'>
                <View className='input-title'>真实姓名</View>
                <Input placeholder='请输入姓名' value={name} type='text' onInput={this.onInput.bind(this, 'name')} />
              </View>
              <View className='input-view'>
                <View className='input-title'>身份证号</View>
                <Input placeholder='请输入身份证' value={idcard} type='idcard' onInput={this.onInput.bind(this, 'idcard')} />
              </View>
            </View>
            <View className='title'>收货信息</View>
            <View className='block'>
              <View className='input-view'>
                <View className='input-title'>收货人姓名</View>
                <Input placeholder='请输入收货人' value={realname} type='text' onInput={this.onInput.bind(this, 'realname')} />
              </View>
              <View className='input-view'>
                <View className='input-title'>联系方式</View>
                <Input placeholder='请输入收货手机号码' value={mobile} type='number' onInput={this.onInput.bind(this, 'mobile')} />
              </View>
              <View className='input-view' style='width:100%'>
                <View className='input-title'>收货人地区</View>
                <View className='area-view'>
                  <AreaPicker myAreas={myAreas} onSelectArea={this.selectArea.bind(this)} />
                </View>
              </View>
              <View className='input-view' style='width:100%'>
                <View className='input-title'>详细地址</View>
                <Input placeholder='请输入收货人地址' value={address} type='text' style='width:100%' onInput={this.onInput.bind(this, 'address')} />
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
            </View>
          </ScrollView>
          <View className='agreement'>
            <Text>提交即同意fdg的</Text>
            <Text style='color:#1E3468' onClick={this.argeement.bind(this)}>海外直邮隐私保护条款</Text>
          </View>
          <View className='formSubmit' onClick={this.submitInfo.bind(this)}>提交</View>
        </View>
      </View>
  }
}
FormInfo.defaultProps = {
}
export default FormInfo;
