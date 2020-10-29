import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import { connect } from '@tarojs/redux'
import * as actionCreators from './store/actionCreators';
import { AtInputNumber } from "taro-ui";

import Like from '../../components/like'
import Trace from '../../components/trace'

import emptyIcon from '../../images/empty.png'
import select from '../../images/default2.png'
import noSelect from '../../images/default1.png'
import './index.less'

class Cart extends Component {

  config = {
    navigationBarTitleText: '购物车'
  }
  constructor() {
    super(...arguments)
    this.state = {
      count: 1,
      edit: false,
      editTxt: '编辑'
    }
  }

  componentDidShow() {
    this.props.getCartData()
  }

  linkTo(url) {
    Taro.redirectTo({
      url: `/pages/${url}/index`
    })
  }
  editShow() {
    this.setState({
      edit: !this.state.edit
    })
    if (this.state.editTxt == '编辑') {
      this.setState({
        editTxt: '完成'
      })
    } else {
      this.setState({
        editTxt: '编辑'
      })
    }
  }
  /*
    结算
    是否为心享礼订单 0--否 1--是
  */
  orderPreview(is_gift) {
    Taro.navigateTo({
      url: `/pages/orderPreview/index?is_cart=1&is_gift=${is_gift}`
    })
  }
  //加价购、营销
  /* 
    id:营销id
    typeid: 活动id
    type:营销类型
  */
  goToBuy(id, typeid) {
    Taro.navigateTo({
      url: `/pages/promotional/discount/index?id=${id}&typeid=${typeid}`
    })
  }
  //加价购
  addPrice(goodsid) {
    Taro.navigateTo({
      url: `/pages/promotional/addPrice/index?goodsid=${goodsid}`
    })
  }
  //商品详情
  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }
  home() {
    Taro.redirectTo({
      url: `/pages/index/index`
    })
  }
  render() {
    const { cartData } = this.props
    const { edit, editTxt } = this.state
    const merchList = cartData.merch
    return (
      <View className='cartWrap'>
        <Navbar />
        <Menu />
        {
          merchList.length > 0 &&
          <View className='cart-list'>
            <View className='edit'>
              <Text onClick={this.editShow.bind(this)}>{editTxt}</Text>
            </View>
            {
              merchList.map((item) => {
                return (
                  <View className='list' key={item.merchid}>
                    <View className='store-info'>
                      {edit
                        ? <Image
                          src={item.allDelSelect ? select : noSelect}
                          className='select-icon'
                          onClick={this.props.selectDelMerch.bind(this, item.merchid)}
                        />
                        : <Image
                          src={item.allselect ? select : noSelect}
                          className='select-icon'
                          onClick={this.props.goodsChoice.bind(this, '', item.merchid, '')}
                        />
                      }
                      <Text className='shop-name'>{item.merch_name}</Text>
                      <Text className='shop' onClick={this.home.bind(this)}>去逛逛 > </Text>
                      {/* <Text className='get-coupon'>领券</Text> */}
                    </View>
                    {
                      item.goods.map((list, list_index) => {
                        return (
                          <View key={`id${list_index}`} className='goods-block'>
                            {
                              list.goods_list.map((row) => {
                                return (
                                  <View className='goods' key={row.id}>
                                    {edit
                                      ? <View className='left' onClick={this.props.selectDelGoods.bind(this, item.merchid, list_index, row.id)}>
                                        <Image src={row.delSelected ? select : noSelect} className='select-icon' />
                                      </View>
                                      : <View>
                                        {
                                          row.stock === '0'
                                            ? <View className='no-stock'>无效</View>
                                            : <View className='left' onClick={this.props.goodsChoice.bind(this, row.id, '', '')}>
                                              <Image src={row.selected === '1' ? select : noSelect} className='select-icon' />
                                            </View>
                                        }
                                      </View>
                                    }
                                    <Image src={row.thumb} className='goods-pic' onClick={this.goodsDetail.bind(this, row.goodsid)} />
                                    <View className='goods-info'>
                                      <View className='goods-name' onClick={this.goodsDetail.bind(this, row.goodsid)}>{row.title}</View>
                                      <View className='goods-options'>{row.optiontitle}</View>
                                      {
                                        Number(row.taxes) > 0
                                          ? <View className='sui'>税费预计: ￥{row.taxes}</View>
                                          : <View className='sui' style='color:rgba(196,26,22,1);'>商品已包税</View>
                                      }
                                      {
                                        row.stock === '0'
                                          ? <View className='stock-tips'>商品暂时短缺</View>
                                          : <View className='goods-price'>
                                            <Text className='xian'>￥{row.marketprice}</Text>
                                            {/* <Text className='yuan'>￥{row.productprice}</Text> */}
                                            <AtInputNumber
                                              min={1}
                                              max={9999}
                                              step={1}
                                              value={Number(row.total)}
                                              onChange={this.props.changeCount.bind(this, row.id, row.totalmaxbuy)}
                                            />
                                          </View>
                                      }
                                    </View>
                                  </View>
                                )
                              })
                            }
                            {
                              list.type !== 'common'
                                ? <View className='goods-tip'>
                                  <Text className='title'>{list.title}</Text>
                                  <Text className='tip'>{list.tip}</Text>
                                  {
                                    list.type === 'addprice'
                                      ? <Text className='goBuy' onClick={this.addPrice.bind(this, list.id)}>再逛逛</Text> //加价购
                                      : <Text className='goBuy' onClick={this.goToBuy.bind(this, list.id, list.typeid)}>再逛逛</Text> //xy营销
                                  }
                                </View>
                                : ('')
                            }
                          </View>
                        )
                      })
                    }
                  </View>
                )
              })
            }
            <View className='bar-bottom'>
              <View className='bar-left'>
                {edit
                  ? <View onClick={this.props.selectDelAll.bind(this)} style='display:flex;align-items:center'>
                    <Image src={cartData.isDelCheckall ? select : noSelect} className='all-select'></Image>
                    <Text>全选</Text>
                  </View>
                  : <View onClick={this.props.goodsChoice.bind(this, '', '', '1')} style='display:flex;align-items:center'>
                    <Image src={cartData.ischeckall ? select : noSelect} className='all-select'></Image>
                    <Text>全选</Text>
                  </View>

                }
                {
                  !edit &&
                  <View className='total-view'>
                    <View>合计(不含税)</View>
                    <View style='margin-top:4px'>￥{cartData.totalprice}</View>
                  </View>
                }
              </View>
              {edit
                ? <View className='btn-view'>
                  <View className='btn' style='background:#959595' onClick={this.props.collectGoods.bind(this)}>移入收藏</View>
                  <View className='btn' onClick={this.props.removeGoods.bind(this)}>删除商品</View>
                </View>
                : <View className='btn-view'>
                  <View className='btn' style='background:#959595' onClick={this.orderPreview.bind(this, 1)}>我要送礼</View>
                  <View className='btn' onClick={this.orderPreview.bind(this, 0)}>结算</View>
                </View>
              }
            </View>
          </View>
        }
        {
          (merchList.length === 0 || merchList === '') &&
          <block>
            <View className='cart-empty'>
              <Image src={emptyIcon} className='empty-icon'></Image>
              <View className='empty-txt'>看时尚圈的达人都在挑什么</View>
              <View className='btn' onClick={this.linkTo.bind(this, 'index')}>去逛逛</View>
            </View>
            <Trace />
            <Like />
          </block>
        }
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    cartData: state.cart.cartData,
  }
}

const mapDispatchToProps = (dispatch) => ({
  getCartData() {
    dispatch(actionCreators.getCartData());
  },
  goodsChoice(id, merchid, allcheck) {
    dispatch(actionCreators.goodsChoice(id, merchid, allcheck));
  },
  changeCount(id, totalmaxbuy, value) {
    if (Number(value) > Number(totalmaxbuy)) {
      Taro.showToast({
        title: '商品达到最大数量',
        mask: true,
        icon: 'none',
        duration: 1400
      })
      value = totalmaxbuy
      setTimeout(() => {
        dispatch(actionCreators.changeCount(id, value));
      }, 1450)
    } else {
      dispatch(actionCreators.changeCount(id, value));
    }
  },
  selectDelMerch(merchid) {
    dispatch(actionCreators.selectDelMerch(merchid));
  },
  selectDelGoods(merchid, index, id) {
    dispatch(actionCreators.selectDelGoods(merchid, index, id));
  },
  selectDelAll() {
    dispatch(actionCreators.selectDelAll());
  },
  removeGoods() {
    dispatch(actionCreators.removeGoods());
  },
  collectGoods() {
    dispatch(actionCreators.collectGoods());
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
