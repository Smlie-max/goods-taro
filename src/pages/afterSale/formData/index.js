import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Textarea } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import uploadImg from '../../../utils/uploadImg';
import Loading from '../../../components/loading';
import delIcon from '../../../images/close.png'
import plus from '../../../images/plus.png'

import './index.less'

class FormData extends Component {
  config = {
    navigationBarTitleText: '申请退款'
  }
  constructor() {
    super(...arguments)
    this.state = {
      goods_list: [],
      total_price: 0,
      remark: '',
      images: [],
      loadingShow: true, //loading
    }
  }
  componentWillMount() { }

  componentDidMount() {
    const ids = this.$router.params.ids
    const id = this.$router.params.id
    Request.post(api.refund, {
      id: id,
      ids: ids,
      submit: 0
    }).then(
      res => {
        this.setState({
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          this.setState({
            goods_list: result.data.goods_list,
            total_price: result.data.total_price
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

  choose(current) {
    this.setState({
      current: current
    })
  }
  remarkChange(event) {
    this.setState({
      remark: event.target.value
    })
  }
  //选择图片
  async chooseImage() {
    const self = this
    if (this.state.images.length >= 9) {
      Taro.showToast({
        title: '最多添加9张！',
        icon: 'none'
      })
      return
    }
    if (process.env.TARO_ENV === 'weapp') {
      Taro.chooseImage({
        count: 9 - this.state.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          self.upload(tempFilePaths)
        }
      })
    } else if (process.env.TARO_ENV === 'h5') {
      var wx = require('m-commonjs-jweixin');
      wx.ready(function () {
        wx.chooseImage({
          count: 9 - self.state.images.length,
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            self.upload(localIds)
          }
        })
      })
    }
  }
  //删除图片
  delImage(index) {
    let images = this.state.images
    images.splice(index, 1)
    this.setState({
      images: images
    })
  }
  async upload(tempFilePaths) {
    let images = this.state.images
    await uploadImg(tempFilePaths).then(res => {
      images = images.concat(res)
      this.setState({
        images: images
      })
    })
  }
  //提交
  submit() {
    Taro.showLoading({
      title: '正在提交'
    })
    const images = this.state.images
    let imgList = []
    images.map((item) => {
      imgList.push(item.filename)
    })
    Request.post(api.refund, {
      id: this.$router.params.id,
      ids: this.$router.params.ids,
      submit: 1,
      remark: this.state.remark,
      images: JSON.stringify(imgList)
    }).then(
      res => {
        const result = res.data
        Taro.hideLoading()
        if (result.code === 0) {
          Taro.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false,
          }).then(res => {
            if (res.confirm) {
              Taro.redirectTo({
                url: `/pages/afterSale/afterSaleDetail/index?id=${result.data.refund_id}`
              })
            }
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
  render() {
    const { goods_list, total_price, images } = this.state
    return (
      <View className='FormData'>
        <Loading show={this.state.loadingShow} title='加载中' />
        <Navbar />
        <View className='big-title'>确认商品</View>
        {
          goods_list.map((item) => {
            return (
              <View className='goods' key={item.id}>
                <Image src={item.thumb} className='goods-pic' />
                <View className='goods-right'>
                  <View className='goods-title'>
                    <Text className='desc'>{item.title}</Text>
                    <Text className='money'>￥{item.price}</Text>
                  </View>
                  {/*<View className='way'>
                    <Text>【到店自提】</Text>
                    <Text>税费 ￥10.00</Text>
                  </View> */}
                  <View className='options'>
                    <Text>{item.optionname}</Text>
                    <Text>x{item.total}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }
        <View className='after-type'>
          <View className='title'>退款</View>
          <View className='money'>
            <Text>退款金额</Text>
            <Text>￥{total_price}</Text>
          </View>
        </View>
        <View className='words'>
          <View className='title'>退款说明</View>
          {/* <Textarea className='words-detail' placeholder='填写退款说明' /> */}
          <Textarea
            value={this.state.remark}
            onInput={this.remarkChange.bind(this)}
            placeholder='填写退款说明'
            className='words-detail'
            autoHeight
            maxlength={150}
          />
          <View class="wordCount" style='font-size: 14px;color: #1E3468;text-align: right;margin-bottom: 10px;'>{parseInt(this.state.remark.length)}/150</View>
          <View className='title'>上传凭证(选填)</View>
          <View className='voucher'>
            {
              images.map((item, index) => {
                return (
                  <View className='img-view' key={item}>
                    <Image src={delIcon} className='delIcon' onClick={this.delImage.bind(this, index)} />
                    <Image src={item.url} className='plus' />
                  </View>
                )
              })
            }
            <Image src={plus} className='plus' onClick={this.chooseImage.bind(this)} />
          </View>
        </View>
        <View className='next' onClick={this.submit.bind(this)}>提交</View>
      </View>
    )
  }
}

export default FormData; 
