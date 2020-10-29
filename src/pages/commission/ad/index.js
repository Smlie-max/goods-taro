import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';


class Ad extends Component {
  config = {
    navigationBarTitleText: '推广二维码',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white',
  }

  constructor() {
    super(...arguments)
    this.state = {
      image: [],
      isOpened: false
    }
  }

  componentWillUnmount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中',
    })
    const that = this;
    const env = Taro.getEnv();
    let mode = "";
    if (env === "WEAPP") {
      mode = "wechat";
    } else {
      mode = "h5";
    }

    Request.post(api.IndexQrcode, { mode: mode }).then(res => {
      Taro.hideLoading()
      const data = res.data.data
      that.setState({
        image: data.code
      })
    })
  }

  componentDidHide() { }

  saveImg(index) {
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
                      url: that.state.image[index],
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
                  url: that.state.image[index],
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
  render() {
    const { image } = this.state
    return (
      <Swiper
        className='test-h'
        previous-margin='30px'
        next-margin='30px'
      >
        {
          image.map((item, index) => {
            return (
              <SwiperItem>
                <View className='commissionQrCode'>
                  {
                    image && <Image className='img' src={item + '?new=' + (Math.random() * 10)} onLongPress={this.saveImg.bind(this, index)} mode='widthFix' />
                  }
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
            )
          })
        }
      </Swiper>
    )
  }
}

export default Ad;
