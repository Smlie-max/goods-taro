import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import getToken from '../../../utils/getToken';

import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import Cover from './cover';
import FormInfo from './formInfo';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import withShare from '../../../utils/withShare'
import withToken from '../../../utils/withToken'
import bindParent from '../../../utils/bindParent'
import shareConfig from '../../../utils/share'
import { getLoginAndLabel } from '../../../utils/common'

import bg from '../images/gift-bg.png'
import mailBg from '../images/mail-bg.png'
import mail from '../images/mail.png'
import paper from '../images/paper.png'
import top from '../images/top.png'
import getPic from '../images/get.png'
import './index.less'

@withToken()
@withShare()

class giftDetail extends Component {
  config = {
    navigationBarTitleText: '心享礼'
  }
  constructor(props) {
    super(props)
    this.state = {
      showFormMask: false,
      showReceive: false, //领取人信息弹
      showCover: true, //打开状态
      getSuccess: false, //领取成功
      shareMessage: {},
      id: '',
      list: '',
      member: '',
      address: '',
      status: '', //1、自己的，未被领取 2、自己的，已被领取 3、不是自己的，未领取 4.不是自己的，已领取 5、不是自己的，已被他人领取 6、不是自己的，已过期
    }
  }
  componentWillMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    this.setState({
      id: this.$router.params.id
    },()=>{
      if (Taro.getStorageSync('access_token') == '') {
        this.checkLogin()
      } else {
        this.getDetail()
      }
    })
  }

  componentDidMount() { }

  async checkLogin() {
    const res = await getToken()
    if (res == 'ok') {
      this.getDetail();
    }
  }

  getDetail() {
    Request.post(api.getGiftDetail, {
      id: this.state.id
    }).then(
      res => {
        const result = res.data
        if (result.code == 0) {
          this.setState({
            status: result.data.status,
            list: result.data.list,
            member: result.data.member,
            address: result.data.address ? result.data.address : '',
            shareMessage: result.data.share_info
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.icon}`
            this.$setSharePath = () => `/pages/gift/giftDetail/index?id=${this.state.id}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.icon}`,
              path: `/pages/gift/giftDetail/index?id=${this.state.id}`,
              desc: `${this.state.shareMessage.desc}`
            })
          })
        } else {
          Taro.showToast({
            title: result.msg,
            mask: true,
            icon: 'none'
          });
        }
      }
    )
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onShowFormMask() {
    getLoginAndLabel().then((res) => {
      if (!res) return
      this.setState({
        showFormMask: !this.state.showFormMask
      })
    })
  }
  goHome() {
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }
  onShowReceive() {
    this.setState({
      showReceive: !this.state.showReceive
    })
  }
  //领取
  getMySelf() {
    const that = this
    getLoginAndLabel().then((res) => {
      if (!res) return
      Taro.showModal({
        title: '提示',
        content: '确认自己领取吗?',
      }).then(res => {
        if (res.confirm) {
          Request.post(api.getGiftMySelf, {
            order_id: that.state.id
          }).then(
            res => {
              const result = res.data
              Taro.showToast({
                title: result.msg,
                mask: true,
                icon: 'none'
              });
              if(result.code === 0){
                that.getDetail()
              }
            }
          )
        }
      })
    })
  }
  //打开
  onShowCover() {
    this.setState({
      showCover: !this.state.showCover
    })
  }
  //分享提示
  shareBtnClick() {
    if (process.env.TARO_ENV === 'h5') {
      Taro.showToast({
        title: '请点击右上角分享哦',
        icon: 'none',
        duration: 2000
      })
    }
  }
  //禁止滑动
  preventTouchMove(e) {
    e.stopPropagation()
    e.preventDefault();
    return
  }
  // //领取成功弹窗
  // onShowSuccess() {
  //   this.setState({
  //     getSuccess: !this.state.getSuccess
  //   })
  // }
  // $setSharePath = () => `/pages/gift/giftDetail/index?id=${this.state.id}`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.icon}`

  render() {
    const { showFormMask, showReceive, status, list, member, address, showCover, getSuccess } = this.state
    return (
      <View className='giftDetail'>
        <Navbar />
        <Menu />
        {
          ((status == 3 || status == 4 || status == 5 || status == 6) && showCover) &&
          <Cover
            onShowCover={this.onShowCover.bind(this)}
            member={this.state.member}
            status={status}
          />
        }
        {
          showFormMask &&
          <FormInfo
            showFormMask={showFormMask}
            onShowFormMask={this.onShowFormMask.bind(this)}
            order_id={this.state.id}
          // onShowSuccess={this.onShowSuccess.bind(this)}
          />
        }
        {/* {
          getSuccess &&
          <GetSuccess />
        } */}
        <Image src={bg} className='bg' mode='widthFix' />
        {
          (status == 1 || status == 2 || !showCover) &&
          <View>
            <Image src={mailBg} className='mailBg'/>
            <Image src={mail} className='mail' />
            <View className='main'>
              <Image src={paper} className='paper' />
              <Image src={member.avatar} className='thumb' />
              <View className='tips1'>你准备的礼物</View>
              <View className='tips2'>礼物好有感觉，你的朋友一定很喜欢</View>
              <View className='total'>
                <Text className='txt'>礼物清单</Text>
                <View className='line'></View>
                <Text className='txt'>共 {list.length} 件礼物</Text>
              </View>
              <View className='gift-list'>
                {
                  list.map((item) => {
                    return (
                      <View className='list' key={item.id}>
                        <Image src={item.thumb} className='goods-pic' />
                        {
                          (status == 2 || status == 4) &&
                          <Image src={getPic} className='getPic' mode='widthFix' />
                        }
                        <View className='goods-info'>
                          <View className='goods-title'>{item.title}</View>
                          <View className='goods-counts'>x {item.total}</View>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </View>
          </View>
        }
        {
          status == 1 &&
          <View className='bottom-bar'>
            <Button className='btn' onClick={this.getMySelf.bind(this)}>自己签收</Button>
            <Button className='btn' open-type="share" onClick={this.shareBtnClick.bind(this)}>发送给好友</Button>
          </View>
        }
        {
          status == 2 &&
          <View className='bottom-bar'>
            <Button className='btn' style='width:90%' onClick={this.onShowReceive.bind(this)}>查看领取人信息</Button>
          </View>
        }
        {
          (status == 3 && !showCover) &&
          <View className='bottom-bar'>
            <Button className='btn' onClick={this.goHome.bind(this)}>我也要送礼</Button>
            <Button className='btn' onClick={this.onShowFormMask.bind(this)}>收下礼物</Button>
          </View>
        }
        {
          showReceive &&
          <View className='receive-info' onClick={this.onShowReceive.bind(this)} >
            <View className='receive-main'>
              <Image src={top} className='close' onClick={this.onShowReceive.bind(this)} />
              <View className='title'>收货信息</View>
              <View className='block' onClick={this.preventTouchMove.bind(this)}>
                <View className='block-item'>
                  <View className='item-title'>收货人姓名</View>
                  <View className='value'>{address.realname}</View>
                </View>
                <View className='block-item'>
                  <View className='item-title'>联系方式</View>
                  <View className='value'>{address.mobile}</View>
                </View>
                <View className='block-item' style='width:100%'>
                  <View className='item-title'>收货人地址</View>
                  <View className='value' style='width:100%'>{address.areas}{address.address}</View>
                </View>
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default giftDetail;
