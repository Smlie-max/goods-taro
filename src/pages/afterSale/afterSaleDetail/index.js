import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Loading from '../../../components/loading';
import phoneIcon from '../../../images/mobile-icon.png'
import addressIcon from '../../../images/address-icon.png'

import './index.less'

class AfterSaleDetail extends Component {
  config = {
    navigationBarTitleText: '售后详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      detail: {},
      goods_list: [],
      refundaddress: {},
      imgs: [],
      loadingShow: true
    }
  }
  componentDidShow() {
    Request.post(api.refundDetail, {
      id: this.$router.params.id
    }).then(
      res => {
        this.setState({
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          this.setState({
            detail: result.data,
            goods_list: result.data.goods_list,
            refundaddress: result.data.refundaddress,
            imgs: result.data.imgs
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

  expressInfo() {
    Taro.navigateTo({
      url: `/pages/afterSale/expressInfo/index?id=${this.$router.params.id}`
    })
  }

  render() {
    const { detail, goods_list, refundaddress, imgs, } = this.state
    return (
      <View className='AfterSaleDetail'>
        <Navbar bgColor='#1E3468' />
        <Loading show={this.state.loadingShow} title='加载中' />
        <View className='top'>
          <View className='left'>
            <View>{detail.status_str}</View>
            <View className='time'>{detail.createtime}</View>
          </View>
          <View className='right'>
            <View>售后单号</View>
            <View className='num'>{detail.refundno}</View>
          </View>
        </View>
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
                  {/* <View className='way'>【到店自提】</View> */}
                  <View className='options'>
                    <Text>{item.optionname}</Text>
                    <Text>x {item.total}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }
        <View className='after-type'>
          <View className='title'>{detail.rtype_str}</View>
          <View className='money'>
            <Text>退款金额</Text>
            <Text>￥{detail.applyprice}</Text>
          </View>
        </View>
        <View className='reason-view'>
          {
            detail.content
              ? <block>
                <View className='title'>退货退款说明</View>
                <View className='reason'>{detail.content}</View>
              </block>
              : <View />
          }
          {
            imgs.length > 0
              ? <block>
                <View className='title'>图片凭证</View>
                <View className='voucher-view'>
                  {
                    detail.imgs.map((item, index) => {
                      return (
                        <Image src={item} className='img' key={index} />
                      )
                    })
                  }
                </View>
              </block>
              : <View />
          }
          {/* rtype:0--未发货状态的退款 1--已收货状态的退款 */}
          {/* <Button className='service'>联系客服</Button> */}
          {/* <View className='error'>退款失败，如有疑问，请联系客服</View> */}
          {
            detail.rtype == 0
              ? <block>
                {/* 申请中 */}
                {
                  detail.status == 0 && <Button className='service' open-type='contact'>联系客服</Button>
                }
                {/* 退款成功 */}
                {
                  detail.status == 1 && <Button className='service' open-type='contact'>联系客服</Button>
                }
                {/* 申请失败 */}
                {
                  detail.status == -1 &&
                  <block>
                    <Button className='service' open-type='contact'>联系客服</Button>
                    <View className='error'>退款失败，如有疑问，请联系客服</View>
                  </block>
                }
              </block>
              : <View />
          }
          {
            detail.rtype == 1
              ? <block>
                {/* 申请中 */}
                {
                  detail.status == 0 && <Button className='service' open-type='contact'>联系客服</Button>
                }
                {/* 退款成功 */}
                {
                  detail.status == 1 && <Button className='service' open-type='contact'>联系客服</Button>
                }
                {/* 手动退款 */}
                {
                  detail.status == 2 && <Button className='service' open-type='contact'>联系客服</Button>
                }
                {/* 退款失败 */}
                {
                  detail.status == -1 &&
                  <block>
                    <Button className='service' open-type='contact'>联系客服</Button>
                    <View className='error'>退款失败，如有疑问，请联系客服</View>
                  </block>
                }
                {/* 未填写收货信息 */}
                {
                  detail.status == 3 &&
                  <block>
                    <Button className='service' onClick={this.expressInfo.bind(this)}>填写退货信息</Button>
                    <View className='error'>申请通过，请填写退货订单信息</View>
                  </block>
                }
                {/* 已填写收货信息 */}
                {
                  detail.status == 4 && <Button className='service' open-type='contact'>联系客服</Button>
                }
              </block>
              : <View />
          }
        </View>
        {
          refundaddress
            ? <View className='address_view'>
              <View className='title'>退货至以下地址</View>
              <View className='item'>
                <Image src={phoneIcon} className='icon' />
                <Text className='txt'>{refundaddress.name}</Text>
                <Text className='txt'>{refundaddress.mobile}</Text>
              </View>
              <View className='item'>
                <Image src={addressIcon} className='icon' />
                <Text className='txt'>{refundaddress.address}</Text>
              </View>
              <View className='title'>退货订单信息</View>
              {
                detail.rexpresscom
                  ? <View className='express_info'>
                    <View className='item'>
                      <View className='title'>快递公司</View>
                      <View className='txt'>{detail.rexpresscom}</View>
                    </View>
                    <View className='item'>
                      <View className='title'>物流单号</View>
                      <View className='txt'>{detail.rexpresssn}</View>
                    </View>
                  </View>
                  : <View className='no_express_info'>待填写</View>
              }
            </View>
            : <View />
        }
      </View>
    )
  }
}

export default AfterSaleDetail; 
