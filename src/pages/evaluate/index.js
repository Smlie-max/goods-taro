import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Textarea } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import uploadImg from '../../utils/uploadImg';
import Navbar from '../../components/navbar'
import face0 from './images/0.png'
import face1 from './images/1.png'
import face2 from './images/2.png'
import face3 from './images/3.png'
import face4 from './images/4.png'
import face5 from './images/5.png'
import plus from './images/plus.png'
import delIcon from './images/close.png'
import './index.less'

class OrderRedPacket extends Component {
  config = {
    navigationBarTitleText: '评价'
  }
  constructor() {
    super(...arguments)
    this.state = {
      service_level: 0, //店铺服务评分
      express_level: 0, //店铺物流评分
      goodsInfo: [],
      comments: [], //评论数组
      id: '',
      maxUpload: 9,
      rateList: [
        {
          id: 1,
          img: face1,
          txt: '失望'
        },
        {
          id: 2,
          img: face2,
          txt: '一般'
        },
        {
          id: 3,
          img: face3,
          txt: '还不错'
        },
        {
          id: 4,
          img: face4,
          txt: '满意'
        },
        {
          id: 5,
          img: face5,
          txt: '特别喜欢'
        },
      ]
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }

  componentDidMount() {
    this.getGoodsList(this.$router.params.id)
  }
  //店铺评分
  /*
    type: 评分类型 -- 服务、物流
    value: 分数
   */
  storeChange(type, value) {
    this.setState({
      [type]: value
    })
  }
  //获取商品列表
  getGoodsList(id) {
    Request.post(api.getCommentList, {
      id: id
    }).then(
      res => {
        const result = res.data
        let goodsInfo = result.data
        if (result.code === 0) {
          goodsInfo.map((item) => {
            item.datum = []
            item.images = []
          })
          this.setState({
            goodsInfo: goodsInfo
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
  //商品评分
  goodsRate(id, value) {
    const goodsInfo = this.state.goodsInfo
    goodsInfo.map((item) => {
      if (item.id == id) {
        item.rate = value + 1 //商品评分
      }
    })
    this.setState({
      goodsInfo: goodsInfo
    })
  }
  //评价内容
  words = (id, e) => {
    const goodsInfo = this.state.goodsInfo
    goodsInfo.map((item) => {
      if (item.id == id) {
        item.content = e.detail.value //商品评价
      }
    })
    this.setState({
      goodsInfo: goodsInfo
    })
  }
  //选择图片
  async chooseImage(id) {
    const goodsInfo = this.state.goodsInfo
    const self = this
    //所在数组
    let targetArr = goodsInfo.find((item) => {
      return item.id === id
    })
    if (targetArr.datum.length >= 9) {
      Taro.showToast({
        title: '最多添加9张！',
        icon: 'none'
      })
      return
    }
    // Taro.chooseImage({
    //   count: this.state.maxUpload - targetArr.datum.length,
    //   sizeType: ['compressed'],
    //   sourceType: ['album', 'camera'],
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths
    //     self.upload(id, tempFilePaths)
    //     // targetArr.datum = targetArr.datum.concat(tempFilePaths)
    //     // self.setState({
    //     //   goodsInfo: goodsInfo
    //     // })
    //   }
    // })
    if (process.env.TARO_ENV === 'weapp') {
      Taro.chooseImage({
        count: self.state.maxUpload - targetArr.datum.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          self.upload(id, tempFilePaths)
        }
      })
    } else if (process.env.TARO_ENV === 'h5') {
      var wx = require('m-commonjs-jweixin');
      wx.ready(function () {
        wx.chooseImage({
          count: self.state.maxUpload - targetArr.datum.length,
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            self.upload(id, localIds)
          }
        })
      })
    }
  }
  //删除图片
  delImage(id, index) {
    const goodsInfo = this.state.goodsInfo
    // //所在数组
    let targetArr = goodsInfo.find((item) => {
      return item.id === id
    })
    // targetArr.datum.splice(index, 1)
    targetArr.images.splice(index, 1)
    // return
    this.setState({
      goodsInfo: goodsInfo
    })
  }
  async upload(id, tempFilePaths) {
    const goodsInfo = this.state.goodsInfo
    let targetArr = goodsInfo.find((item) => {
      return item.id === id
    })
    await uploadImg(tempFilePaths).then(res => {
      // targetArr.datum = targetArr.datum.concat(tempFilePaths)
      targetArr.images = targetArr.images.concat(res)
      this.setState({
        goodsInfo: goodsInfo
      })
    })
  }
  //提交评分
  submitComment() {
    let comments = []
    const goodsInfo = this.state.goodsInfo
    goodsInfo.map((item) => {
      let obj = {}
      let imaList = []
      obj.goodsid = item.goodsid
      obj.level = item.rate
      obj.content = item.content
      // obj.images = item.images.filename
      item.images.map((row) => {
        imaList.push(row.filename)
      })
      obj.images = imaList
      comments.push(obj)
    })
    const noLevel = comments.find(item => {
      return !item.level
    })
    const noContent = comments.find(item => {
      return !item.content
    })
    if (noLevel) {
      Taro.showToast({
        title: '请评分',
        icon: 'none',
        mask: true
      })
      return
    }
    if (noContent) {
      Taro.showToast({
        title: '请输入评价内容',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!this.state.service_level || !this.state.express_level) {
      Taro.showToast({
        title: '请评价服务',
        icon: 'none',
        mask: true
      })
      return
    }
    Taro.showLoading({
      title: '正在上传'
    })
    Request.post(api.submitComment, {
      orderid: this.state.id,
      service_level: this.state.service_level,
      express_level: this.state.express_level,
      comments: JSON.stringify(comments)
    }).then(
      res => {
        Taro.hideLoading();
        const result = res.data
        Taro.showToast({
          title: result.msg,
          icon: 'none'
        })
        if (result.code === 0) {
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      }
    )
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { goodsInfo, rateList } = this.state
    return (
      <View className='evaluateWrap'>
        <Navbar />
        {
          goodsInfo.map((item) => {
            return (
              <View className='goods-block' key={item.id}>
                <View className='top'>
                  <Image src={item.thumb} className='goods-pic' />
                  <Text>商品评分</Text>
                  <View className='goods-rate'>
                    {
                      rateList.map((list, index) => {
                        return (
                          <View key={list}>
                            {
                              index <= item.rate - 1
                                ? <Image src={rateList[item.rate - 1].img} className='face' onClick={this.goodsRate.bind(this, item.id, index)} />
                                : <Image src={face0} className='face' onClick={this.goodsRate.bind(this, item.id, index)} />
                            }
                          </View>
                        )
                      })
                    }
                  </View>
                  <Text className='e-txt'>{rateList[item.rate - 1] ? rateList[item.rate - 1].txt : ''}</Text>
                </View>
                <Textarea autoHeight className='textarea' placeholder='评价超过25个字就有机会获得积分哦~' onInput={this.words.bind(this, item.id)} style="resize:none;" />
                <View className='images-video'>
                  {
                    item.images &&
                    item.images.map((datum_list, datum_index) => {
                      return (
                        <View className='img-view' key={datum_list}>
                          <Image src={delIcon} className='delIcon' onClick={this.delImage.bind(this, item.id, datum_index)} />
                          <Image src={datum_list.url} className='plus' />
                        </View>
                      )
                    })
                  }
                  <Image src={plus} className='plus' onClick={this.chooseImage.bind(this, item.id)} />
                </View>
              </View>
            )
          })
        }
        {
          goodsInfo.length > 0 &&
          <block>
            <View className='store-rate'>
              <View className='title'>店铺评分</View>
              <View className='service'>
                <Text className='txt'>服务态度</Text>
                <AtRate
                  value={this.state.service_level}
                  onChange={this.storeChange.bind(this, 'service_level')}
                />
              </View>
              <View className='express'>
                <Text className='txt'>物流服务</Text>
                <AtRate
                  value={this.state.express_level}
                  onChange={this.storeChange.bind(this, 'express_level')}
                />
              </View>
            </View>
            <View className='submit' onClick={this.submitComment.bind(this)}>提交</View>
          </block>
        }
      </View>
    )
  }
}

export default OrderRedPacket; 
