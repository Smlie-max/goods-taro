import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import withToken from '../../utils/withToken'
import withShare from '../../utils/withShare'
import bindParent from '../../utils/bindParent'
import ShoppRequest from '../../utils/shoppRequest'
import { api } from '../../utils/api';

import './index.less'

@withToken()
@withShare()

class conversionIndex extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      code: '',
      show: true,
      height: 0,      
    }
  }
  config = {
    navigationBarTitleText: '兑换页'
  }

  componentWillMount() { }

  componentDidMount() { 
    // 设置标题
    if (process.env.TARO_ENV === 'h5') {
      document.title = '兑换页'
    } else if (process.env.TARO_ENV === 'weapp') {
      Taro.setNavigationBarTitle({
        title: '兑换页'
      })
    }
    //该页面自动绑定（腾讯可可）
    bindParent(1761)
    //判断是否兑换过
    const that = this
    ShoppRequest.post(api.participation, {
      userid: Taro.getStorageSync('user_id'),
    }).then(res => {
      if (res.data.code == 0) {
        Taro.navigateTo({
          url: res.data.massege
        })
      }
    })
    // 设置h5时页面高度（防止输入时页面变形）
    // 一开始就获取可视化高度
    that.setState({
      height: Taro.getSystemInfoSync().windowHeight,
    })
  }


  onInput(e) {
    this.setState({
      code: e.target.value
    })
  }

  conversion() {
    if (this.state.code.length <= 0) {
      Taro.showToast({
        title: "兑换码不能为空",
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    ShoppRequest.post(api.verifyCode, {
      code: this.state.code,
      userid: Taro.getStorageSync('user_id'),
      token: Taro.getStorageSync('access_token'),
    }).then(res => {
      if (res.data.code == 0) {
        // if (process.env.TARO_ENV === 'h5') {
        //   location.href = 'https://shop.fdg1868.cn/h5/#/' + res.data.result.link
        // } else if (process.env.TARO_ENV === 'weapp') {
        Taro.navigateTo({
          url: res.data.result.link
        })
        // }
      } else {
        Taro.showToast({
          title: '兑换码无效',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

  showRule() {
    this.setState({
      show: !this.state.show
    })
  }

  render() {
    return (
      <View className="show">
        {
          (process.env.TARO_ENV === 'weapp' && this.state.show) ?
            <View className="weapp">
              <View className="fdg">
                <View className="headermain">
                  <View className="header">
                    <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/CYg6K1hGCY1z2D2uH9cYffimDFF9Tm.png" mode="widthFix" />
                  </View>
                  <View className="rulebtn">
                    <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/Epo7p7WTFXLFxZ7ywfX2PP8PXkL8w9.png" mode="widthFix" onClick={this.showRule.bind(this)} />
                  </View>
                  <View className="main">
                    <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/ppPDHd82WhKegKL8ks5sK8EeEWG8hT.png" mode="widthFix" />
                  </View>
                  <View className="center">
                    <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/E6Lj6Ce0vDaDiIa0KYJ8d660k0KJ0c.png" mode="widthFix" />
                  </View>
                </View>
                <View className="footer">
                  <View className='inputs'>
                    <View className="box">
                      <View className="name">输入兑换码</View>
                      <View className="inp">
                        <Input onInput={this.onInput.bind(this)} type='text' />
                      </View>
                    </View>
                    <View className='btn' onClick={this.conversion.bind(this)}>立即领取</View>
                  </View>
                </View>
              </View>
            </View>
            : ''
        }
        {
          (process.env.TARO_ENV === 'weapp' && !this.state.show) ?
            <View className="weapp">
              <View className="rule">
                <View class="headers">
                  <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/FJsg0YSKjGR202x9a6j0r5J0C6Sg2Y.png" mode="widthFix" />
                </View>
                <View className="mains">
                  <View class="returnbtn" onClick={this.showRule.bind(this)}>返回兑换</View>
                  <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/tf7OV8EnOXf1F5A7mx5F75XZMRNRrX.png" mode="widthFix" />
                </View>
                <View className="footers">
                  <Image src="https://shop.fdg1868.cn/attachment/images/1/2019/06/YHC26M6TqcqAt2h0Z1aM92q0TQM0z2.png" mode="widthFix"></Image>
                </View>
              </View>
            </View>
            : ''
        }
        {
          (process.env.TARO_ENV === 'h5' && this.state.show) ?
            <View className='paper-box' style={this.state.height>0?'height: '+this.state.height+'px':''}>
              <Image style="height: 100%;width: 100%;pointer-events: none;" src="https://shop.fdg1868.cn/attachment/images/1/2019/06/bM7I7iwz400ab2xL74X042DO2zIb19.png"></Image>
              <Image className="rulebtn" src="https://shop.fdg1868.cn/attachment/images/1/2019/06/eEnlKU3NZZKKL02Lkk28LFK68f30zJ.png" mode="widthFix" onClick={this.showRule.bind(this)}></Image>

              <View className='inputs'>
                <View className="box" style="border: 1px solid red;">
                  <View className="name">输入兑换码</View>
                  <View className="inp">
                    <Input onInput={this.onInput.bind(this)} type='text' />
                  </View>
                </View>
                <View className='btn' onClick={this.conversion.bind(this)}>立即领取</View>
              </View>
            </View>
            : ''
        }
        {
          (process.env.TARO_ENV === 'h5' && !this.state.show) ?
            <View className='paper-box'>
              <View className='rule'>
                <Image style="height: 100%;width: 100%;pointer-events: none;" src="https://shop.fdg1868.cn/attachment/images/1/2019/06/YY2Y99U6667878cgyA6F9L32c688l4.png" ></Image>
                <View class='returnbtn' style="position: absolute;width: 20%;height: 24px;text-align: center;line-height: 24px;top: 12%;right: 5%;display: block;
	border-radius: 5px;font-size: 12px;color: white;z-index: 1000;background: #ff3030;" onClick={this.showRule.bind(this)}>返回兑换</View>
              </View>
            </View>
            : ''
        }
      </View>
    )
  }
}

export default conversionIndex;