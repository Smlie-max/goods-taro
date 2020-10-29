import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Form, Label, Input, Button, Textarea } from '@tarojs/components'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import AreaPicker from '../../components/areaPicker';

import select from '../../images/default2.png'
import noSelect from '../../images/default1.png'
import uploadImg from '../../utils/uploadImg';
import id1 from '../../images/id1.jpg'
import id2 from '../../images/id2.jpg'
import idCard1 from '../../images/idCard1.jpg'
import idCard2 from '../../images/idCard2.jpg'
import './index.less'

class Editaddress extends Component {

  config = {
    navigationBarTitleText: '收货地址'
  }
  constructor() {
    super(...arguments)
    this.state = {
      // selectorChecked: '',
      mobileInput: '',
      nameInput: '',
      idInput: '',
      isdefault: 0,
      // areaCode: '',
      id: 0,
      address: '',
      identity_pic_url1: '', //服务器返回的正面照路径
      identity_pic_url2: '', //服务器返回的反面照路径
      face: '', //身份证正面照
      back: '', //身份证反面照
      myAreas: '', //地区
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const address_id = this.$router.params.id
    if (address_id != '') {
      Request.post(api.getAddressInfo, {
        id: address_id,
      }).then(
        res => {
          const result = res.data
          const addressInfo = result.data.address
          if (result.code == 0) {
            this.setState({
              // selectorChecked: addressInfo.province + ' ' + addressInfo.city + ' ' + addressInfo.area,
              mobileInput: addressInfo.mobile,
              nameInput: addressInfo.realname,
              idInput: addressInfo.idcard,
              isdefault: addressInfo.isdefault,
              // areaCode: addressInfo.datavalue,
              id: addressInfo.id,
              address: addressInfo.address,
              myAreas: addressInfo.areas,
              face: addressInfo.identity_pic_url1,
              back: addressInfo.identity_pic_url2,
              identity_pic_url1: addressInfo.identity_pic_url1,
              identity_pic_url2: addressInfo.identity_pic_url2,
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
  }

  selectArea(myAreas) {
    this.setState({
      myAreas: myAreas
    })
  }
  // 输入框
  onInput(type, e) {
    this.setState({
      [type]: e.detail.value
    })
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
  submit() {
    if (this.state.nameInput === '') {
      Taro.showToast({
        title: '姓名不能为空！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(this.state.mobileInput))) {
      Taro.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.state.myAreas === '') {
      Taro.showToast({
        title: '请选择地区',
        icon: 'none'
      })
      return;
    }
    if (this.state.address === '') {
      Taro.showToast({
        title: '详细地址不能为空！',
        icon: 'none',
        mask: true
      })
      return
    }
    // if (this.state.identity_pic_url1 === '' || this.state.identity_pic_url2 === '') {
    //   Taro.showToast({
    //     title: '请上传图片',
    //     icon: 'none',
    //     mask: true
    //   })
    //   return
    // }
    Taro.showLoading({
      title: '正在提交',
      mask: true
    })
    Request.post(api.editAddress, {
      id: this.state.id,
      realname: this.state.nameInput,
      mobile: this.state.mobileInput,
      areas: this.state.myAreas,
      // datavalue: this.state.areaCode,
      isdefault: this.state.isdefault,
      idcard: this.state.idInput,
      address: this.state.address,
      identity_pic_url1: this.state.identity_pic_url1,
      identity_pic_url2: this.state.identity_pic_url2
    }).then(
      res => {
        const result = res.data
        Taro.hideLoading()
        if (result.code == 0) {
          Taro.showToast({
            title: result.msg,
            icon: 'success',
            mask: true
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
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
  setDefault() {
    if (this.state.isdefault == 0) {
      this.setState({
        isdefault: 1
      })
    } else {
      this.setState({
        isdefault: 0
      })
    }
  }
  render() {
    const {
      mobileInput,
      nameInput,
      idInput,
      isdefault,
      address,
      myAreas,
      face,
      back
    } = this.state
    return (
      <View className='editAddressWrap'>
        <Navbar />
        <Menu />
        <View className='input-view'>
          <Label className='label' for='name' key='1'>
            收货人
            </Label>
          <Input type='text' placeholder='请输入收货人' className='input' onInput={this.onInput.bind(this, 'nameInput')} value={nameInput} />
        </View>
        <View className='input-view'>
          <Label className='label' for='name' key='1'>
            手机号码
            </Label>
          <Input type='number' placeholder='请输入手机号码' className='input' onInput={this.onInput.bind(this, 'mobileInput')} value={mobileInput} />
        </View>
        <View className='input-view'>
          <Label className='label' for='name' key='1'>
            所在地区
            </Label>
          <AreaPicker myAreas={myAreas} onSelectArea={this.selectArea.bind(this)} />
        </View>
        <View className='textarea-view'>
          <Label className='label' for='name' key='1'>
            详细地址
            </Label>
          <Textarea placeholder='请输入详细地址' className='textarea' autoHeight onInput={this.onInput.bind(this, 'address')} value={address} />
        </View>
        <View className='input-view'>
          <Label className='label' for='name' key='1'>
            设为默认地址
            </Label>
          <View style='flex:1;text-align:right'>
            <Image src={isdefault == 0 ? noSelect : select} className='select-default' onClick={this.setDefault.bind(this)}></Image>
          </View>
        </View>
        <View className='input-view'>
          <Label className='label' for='name' key='1'>
            身份证号码
            </Label>
          <Input type='idcard' placeholder='请输入身份证号码(选填)' className='input' onInput={this.onInput.bind(this, 'idInput')} value={idInput} />
        </View>
        <View className='img_view'>
          {/* <Image src={rule} className='rule' /> */}
          <View className='title'>请上传身份证照片，补充实名认证信息(选填)</View>
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
        <Button className='add' onClick={this.submit.bind(this)}>保存</Button>
      </View>
    )
  }
}


export default Editaddress; 
