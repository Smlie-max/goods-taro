import Taro, { Component } from '@tarojs/taro'
import ParseComponent from '../../components/wxParse'
import Request from '../../utils/request'
import { api } from '../../utils/api'
import ShoppRequest from '../../utils/shoppRequest'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { View, Text, Image, Button } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import card2 from '../../images/card2.jpg'
import buyCard from '../../images/buy-card.png'
import benefitsPic from '../../images/member-qy.png'
import namedPng from '../../images/front.png'
import './index.less'
class Member extends Component {
  config = {
    navigationBarTitleText: '会员中心'
  }
  constructor() {
    super(...arguments)
    this.state = {
      userInfo: {},
      info: {},
      onSale: 0, // 是否参与-100优惠
      staust: false,
      // image: '',
      isOpened: false,
      imgurlList: [],
    }
  }
  componentWillMount() {
    this.setState({
      userInfo: Taro.getStorageSync('userInfo'),
      onSale: this.$router.params.onSale
    })
  }

  componentDidMount() {
    // Taro.showLoading({
    //   title: '加载中',
    // })
    // const that = this;
    // const env = Taro.getEnv();
    // let mode = "";
    // if (env === "WEAPP") {
    //   mode = "wechat";
    // } else {
    //   mode = "h5";
    // }

    // Request.post(api.IndexQrcode, { mode: mode }).then(res => {
    //   Taro.hideLoading()
    //   const data = res.data.data
    //   that.setState({
    //     image: data.code
    //   })
    // })

    this.gethaibao();
   
  }

  gethaibao() {
    ShoppRequest.post(api.gethuodong, {
      type: 9
    }).then(res => {
      if (res.data.code === 0) {
        const that=this
        const result = res.data.result;
        const  imgurl = [];
        for (const i in result) {
          imgurl.push(result[i].img)
        }
        that.setState({
          imgurlList:imgurl
        })
 
      }
    })
  }



  componentDidShow() {
    this.getInfo()
  }
  open() {
    if (this.state.info.is_data == 0) {
      Taro.showModal({
        title: '提示',
        content: '开通会员需要填写资料,是否前去填写?',
        success: function (res) {
          if (res.confirm) {
            //点击确定
            Taro.navigateTo({
              url: '/pages/fillMemberData/index'
            })
          }
        },
      })
    } else {
      /*
      *order_id:订单ID
      *pay_type:支付方式 1--微信支付 2--余额支付 3--银联支付
      *type:支付环境 1--微信 2--小程序
      */
      const self = this;
      //小程序支付
      if (process.env.TARO_ENV === 'weapp') {
        Taro.showLoading({ title: '请求中' })
        Request.post(api.buyPlus, {
          id: this.$router.params.id,
          onSale: this.$router.params.onSale //1:参与-100
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            if (result.code === 0) {
              const that = this
              Request.post(api.payPlus, {
                id: this.$router.params.id,
                order_id: result.data.order_id,
                pay_type: 1,
                type: 2
              }).then(
                res => {
                  const result1 = res.data
                  const payData = result1.data
                  if (result1.code === 0) {
                    Taro.requestPayment({
                      'timeStamp': payData.timeStamp,
                      'nonceStr': payData.nonceStr,
                      'package': payData.package,
                      'signType': 'MD5',
                      'paySign': payData.paySign,
                      'complete': function (res) {
                        if (res.errMsg == 'requestPayment:ok') {
                          Taro.showModal({
                            title: '提示',
                            content: '支付成功',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                Taro.navigateBack()
                              }
                              // 支付成功之后出现关注弹窗，未测试
                              that.setState({
                                staust: true,
                              })
                            }
                          });

                        } else {
                          Taro.showModal({
                            title: '提示',
                            content: '支付失败',
                            showCancel: false
                          });
                        }
                      }
                    });
                  } else {
                    Taro.showToast({
                      title: result1.msg,
                      icon: 'none',
                      mask: true
                    })
                  }
                }
              )
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
      //公众号支付
      if (process.env.TARO_ENV === 'h5') {
        var wx = require('m-commonjs-jweixin');
        Taro.showLoading({ title: '请求中' })
        Request.post(api.buyPlus, {
          id: this.$router.params.id,
          onSale: this.$router.params.onSale //判断是否优惠-100
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            if (result.code === 0) {
              const that = this
              Request.post(api.payPlus, {
                id: this.$router.params.id,
                order_id: result.data.order_id,
                pay_type: 1,
                type: 1
              }).then(
                res => {
                  const result1 = res.data
                  const payData = result1.data
                  if (result1.code === 0) {
                    wx.chooseWXPay({
                      timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                      nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                      package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                      signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                      paySign: payData.paySign, // 支付签名
                      success: function (res) {
                        // 支付成功后的回调函数
                        if (res.errMsg == "chooseWXPay:ok") {
                          //支付成功
                          Taro.showModal({
                            title: '提示',
                            content: '支付成功',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                Taro.navigateBack()
                              }
                              // 支付成功之后出现关注弹窗，未测试
                              this.setState({
                                staust: true,
                              })
                            }
                          });

                        } else {
                          Taro.showToast({
                            title: '支付失败',
                            icon: 'none',
                            mask: true
                          });
                        }
                      },
                      cancel: function (res) {
                        //支付取消
                        Taro.showToast({
                          title: '支付取消',
                          icon: 'none',
                          mask: true
                        });
                      }
                    });
                  } else {
                    Taro.showToast({
                      title: result1.msg,
                      icon: 'none',
                      mask: true
                    })
                  }
                }
              )
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
    }
  }
  //协议
  agreement() {
    Taro.navigateTo({
      url: `/pages/article/index?type=${12}`
    })
  }

  getInfo() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.plusDetail, {
      id: this.$router.params.id
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            info: result.data
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

  staust() {
    this.setState(prevState => ({
      staust: !prevState.staust,
    }))
  }
  //取消弹出层
  mistake() {
    Taro.setStorageSync('staust', false)
    this.setState({
      staust: false,
    })
  }
  saveImg(item) {
    const that = this;
    Taro.showModal({
      title: '提示',
      content: '确定要保存图片吗？',
      success(res) {
        if (res.confirm) {
          Taro.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                Taro.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success: () => {
                    Taro.downloadFile({
                      url: item,
                      success: res => {
                        Taro.saveImageToPhotosAlbum({
                          filePath: res.tempFilePath,
                          success: () => {
                            Taro.showToast({
                              title: '保存成功',
                              icon: 'success',
                              mask: true
                            })
                          }
                        })
                      }
                    })
                  },
                  fail: () => {
                    that.setState({
                      isOpened: true
                    })
                  }
                })
              } else {
                Taro.downloadFile({
                  url: item,
                  success: res => {
                    Taro.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: () => {
                        Taro.showToast({
                          title: '保存成功',
                          icon: 'success',
                          mask: true
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
  closeActionSheet() {
    this.setState({
      isOpened: false
    })
  }

  //文章详情
  articleDetail(id) {
    if (id !== '0') {
      Taro.navigateTo({
        url: `/pages/articleDetail/index?id=${id}`
      })
    }
  }
  render() {
    const { userInfo, info, onSale, image, staust, imgurlList} = this.state
    return (
      <View className='member-wrap'>
        <Navbar />
        <Menu />
        <View className='card-view'>
          <Image src={info.pic_url} className='card1' mode='widthFix' />
          <Image src={card2} className='card2' />
          {
            info.is_plus === 0 &&
            <View>
              <View className='name-view'>
                {/* <Image src={heartIcon} className='heartIcon' /> */}
                亲爱的 {userInfo.nickName}
              </View>
              <View className='bottom'>
                <View style='float:right' className='buy' onClick={this.open.bind(this)}>立即开通</View>
              </View>
            </View>
          }
          {
            info.is_plus === 1 &&
            <View>
              <View className='member-info'>
                <Image src={userInfo.avatarUrl} className='thumb' />
                <View className='info'>
                  <View className='member-name'>{userInfo.nickName} </View>
                  <View className='member-time'>
                    <Text>{info.endtime}</Text>
                    <Text>{info.title}到期</Text>
                  </View>
                </View>
              </View>
              <View className='bottom'>
                <View className='plus_no'>{info.plus_no}</View>
                <View style='float:right' className='buy' onClick={this.open.bind(this)}>续费></View>
              </View>
            </View>
          }
        </View>
        {
          info.is_plus === 0 &&
          <View className='buy-view'>
            <Image src={buyCard} className='buy-card'></Image>
            <View className='b-right'>
              <View>{info.title}</View>
              <View className='qy'>开通钻石卡享受会员{info.equity_list.length}大权益</View>
              <View className='price'>
                <Text style='fontSize:24px;margin-right:10px'>￥{onSale == 0 ? info.marketprice : info.marketprice - 100}/{info.unit}</Text>
                <Text style='fontSize:23px;text-decoration: line-through;color:#B9B9B9'>￥{info.productprice}</Text>
              </View>
              <View className='btn' onClick={this.open.bind(this)}>立即开通</View>
            </View>
          </View>
        }
        <Image src={benefitsPic} className='benefits-pic' mode='widthFix' />
        <View className='scrollview'>
          {
            info.equity_list &&
            info.equity_list.map((item) => {
              return (
                <View
                  className='list'
                  key={item.id}
                >
                  <View className='qy' onClick={this.articleDetail.bind(this, item.art_id)}>
                    <Image src={item.icon} className='icon'></Image>
                    <View className='title'>{item.title}</View>
                  </View>
                </View>
              )
            })
          }
        </View>
        <View className='member-detail'>
          {
            (process.env.TARO_ENV === 'weapp' && info.detail)
              ? <ParseComponent parseData={info.detail} />
              : ('')
          }
          {
            (process.env.TARO_ENV === 'h5' && info.detail)
              ? <View className='h5Parse'>
                <View dangerouslySetInnerHTML={{ __html: info.detail }} />
              </View>
              : ('')
          }
        </View>
        {
          info.is_plus === 0 ?
            <View className='btn' onClick={this.open.bind(this)}>立即开通</View> :
            <View className='btn' onClick={this.open.bind(this)}>立即续费</View>
        }

        <View className='agreement'>
          <Text>支付即视为同意</Text>
          <Text onClick={this.agreement.bind(this)}>《FDG会员-用户协议》</Text>
        </View>

        {(staust) ?
          <View>
            <Swiper
              className='test-h'
            >
              {
                imgurlList.map((item) => {
                  
                  return (
                    <SwiperItem>
                      
                      <View className='commissionQrCode'>
                        
                           <Image className='imgs' src={item} onLongPress={this.saveImg.bind(this,item)} mode='widthFix' />
                        
                        <AtActionSheet
                          cancelText='取消'
                          title='检测到您没打开保存到相册的权限，是否去设置打开？'
                          isOpened={this.state.isOpened}
                        >
                          <AtActionSheetItem onClick={this.closeActionSheet.bind(this)}>
                            <Button openType='openSetting' className='openSetting'>去授权</Button>
                          </AtActionSheetItem>
                        </AtActionSheet>
                      </View>
                    </SwiperItem>
                  )}
                  )
              }
            </Swiper>
            <Image className="mistake" onClick={this.mistake.bind(this)} src={namedPng} />
          </View>
          :
          <View></View>
        }
      </View>
    )

  }
}

export default Member