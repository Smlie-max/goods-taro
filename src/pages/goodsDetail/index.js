import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Button, Video } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Request from '../../utils/request';
import Navbar from '../../components/navbar';
import Loading from '../../components/loading';
import Remind from '../../components/remind';
import Like from '../../components/like';
import Menu from '../../components/menu';
import OptionLayout from '../../components/optionLayout';
import { AtCountdown } from "taro-ui";
import { api } from '../../utils/api';
import ParseComponent from '../../components/wxParse';
import Recommend from '../../components/recommend';
import withShare from '../../utils/withShare'
import withToken from '../../utils/withToken'
import bindParent from '../../utils/bindParent'
import { getLoginAndLabel } from '../../utils/common'
import * as actionCreators from '../cart/store/actionCreators';
import shareConfig from '../../utils/share'

import rightIcon from '../../images/choose-right.png';
import indexIcon from '../../images/index-icon.png';
import cartIcon from '../../images/goods-cart.png';
import collect from '../../images/like_icon.png';
import collect1 from '../../images/like_icon1.png';
import shareIcon from '../../images/share_icon.png';
import line from '../../images/title-line.png'
import down from '../../images/arrow.png'
import './index.less'
import shangjin from '../../images/shangjin.png'



@connect(({ cart }) => ({
  cart
}), (dispatch) => ({
  getCartGoodsNum() {
    dispatch(actionCreators.getCartData())
  }
}))

@withToken()
@withShare()

class GoodsDetail extends Component {

  config = {
    navigationBarTitleText: '商品详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loadingShow: true,
      bannerHeight: 250,
      isFavorite: false, //是否收藏
      thumbs: [], //轮播
      id: '',
      info: {}, //商品详情
      getComments: '',// 评论是否开启
      shop: '', //门店详情
      content: '',
      goodsOptions: [], //后台返回的所有可选的规格的组合（数组）
      goodsSpecs: [], //规格数组
      finlSelect: '', //选择的最终属性id数组的拼接起来的标识
      finlPrice: '', //选择规格后的单价
      final: [], //选择的最终属性id数组
      optionsTxt: '', //已选择的属性名称
      count: 1, //数量
      optionid: '', //选择的规格id
      stock: '0', //库存
      withOutOptions: false,
      showLayout: false,
      buyNow: false,
      is_addprice: 0, //是否为加价购商品 0不是 1是 默认0
      selectOptionsBtn: false, //选择规格按钮触发的弹窗
      seckillinfo: {}, //秒杀信息
      showRemind: false, //预约显示
      similarity_goods: [], //推荐商品
      showOffSaleMask: false, //显示下架提示
      shareMessage: {}, //分享
      optiosReady: false,
      original: 0,
      is_plus:'',
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id,
    })
  }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    this.props.getCartGoodsNum() //购物车数量
    this.getGoodsInfo(this.$router.params.id); //商品详情
    this.huiyuan();
  }

  //获取商品详情  
  getGoodsInfo(goodsId) {
    Request.post(api.getGoodsInfo, {
      id: goodsId,
      is_addprice: this.state.is_addprice
    }).then(
      res => {
        this.setState({
          loadingShow: false
        })
        const result = res.data
        if (result.code === 0) {
          this.setState({
            thumbs: result.data.thumbs,
            info: result.data.goods,
            content: result.data.goods.content,
            getComments: result.data.getComments,
            shop: result.data.shop,
            isFavorite: result.data.isFavorite,
            seckillinfo: result.data.seckillinfo,
            is_booking: result.data.seckillinfo.is_booking,
            similarity_goods: result.data.similarity_goods,
            showOffSaleMask: result.data.goods.status === '0' ? true : false,
            shareMessage: result.data.share
          }, () => {
            this.getGoodsOption(this.$router.params.id); //商品规格

            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.imgUrl}`
            this.$setSharePath = () => `/pages/goodsDetail/index?id=${this.state.info.id}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.imgUrl}`,
              path: `/pages/goodsDetail/index?id=${this.state.info.id}`,
              desc: `${this.state.shareMessage.desc}`
            })
          })
        } else {
          setTimeout(() => {
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
          }, 300);
        }
      }
    )
  }
//是否是会员
  huiyuan(){
    var that=this;
    Request.post(api.memberIndex, {
    
    }).then(
      res => {
      // console.info(res)
      that.setState({
        is_plus:res.data.data.member.is_plus
      })
      }
    )
  }
  //获取商品规格
  getGoodsOption(goodsId) {
    Request.post(api.goodsOptions, {
      id: goodsId
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          if (result.data.specs) {
            this.setState({
              stock: this.state.info.total,
              goodsOptions: result.data.options,
              goodsSpecs: result.data.specs
            }, () => {
              this.setState({
                optiosReady: true
              })
            })
          } else {
            this.setState({
              stock: this.state.info.total,
              withOutOptions: true,
              finlPrice: this.state.info.marketprice
            }, () => {
              this.setState({
                optiosReady: true
              })
            })
          }
        }
      }
    )
  }

  linkTo(url) {
    Taro.redirectTo({
      url: '/pages/' + url + '/index'
    })
  }
  onShowLayout(buyNow) {
    this.setState({
      showLayout: true,
      selectOptionsBtn: false,
      buyNow: buyNow
    })
  }
  //原价购买 original
  originalPrice() {
    this.setState({
      showLayout: true,
      selectOptionsBtn: false,
      buyNow: true,
      original: 1
    })
  }
  //加入购物车,购买
  addCart(buyNow) {
    let { optionid, goodsSpecs, count, seckillinfo, info, original } = this.state
    let stock = null
    if (goodsSpecs.length !== 0) {
      stock = this.state.stock
      if (optionid === '') {
        Taro.showToast({
          title: '请选择规格！',
          icon: 'none'
        })
        return
      }
    } else {
      stock = info.total
    }
    if (Number(count) > Number(stock)) {
      Taro.showToast({
        title: '库存不足！',
        icon: 'none',
        mask: true
      })
      return
    }
    if (buyNow) {
      const skill = seckillinfo ? '1' : '0'
      getLoginAndLabel()
        .then((res) => {
          if (!res) return
          this.setState({
            showLayout: false
          })
          Taro.navigateTo({
            url: `/pages/orderPreview/index?is_cart=0&id=${this.state.id}&optionid=${this.state.optionid}&total=${this.state.count}&skill=${skill}&original=${original}`
          })
        })
    } else {
      getLoginAndLabel()
        .then((res) => {
          if (!res) return
          Taro.showLoading({
            title: '正在加入购物车'
          })
          Request.post(api.pushCart, {
            id: this.state.id,
            total: this.state.count,
            optionid: this.state.optionid,
            is_addprice: this.state.is_addprice
          }).then(
            res => {
              const result = res.data
              Taro.hideLoading()
              if (result.code === 0) {
                this.setState({
                  showLayout: false
                }, () => {
                  Taro.showToast({
                    title: '加入购物车成功',
                    icon: 'none',
                    mask: true
                  })
                  this.props.getCartGoodsNum()
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
        })
    }
  }
  imageLoad(e) {
    if (process.env.TARO_ENV === 'h5') {
      this.setState({
        bannerHeight: 'auto'
      })
    } else if (process.env.TARO_ENV === 'weapp') {
      const res = Taro.getSystemInfoSync();
      const imgwidth = e.detail.width
      const imgheight = e.detail.height
      const ratio = imgwidth / imgheight
      this.setState({
        bannerHeight: res.screenWidth / ratio + 'px'
      })
    }
  }
  //收藏商品
  goodsCollect() {
    Request.post(api.collectGoods, {
      goods_id: this.state.id
    }).then(
      res => {
        const result = res.data
        const isFavorite = this.state.isFavorite
        if (result.code === 0) {
          this.setState({
            isFavorite: !isFavorite
          })
        }
        Taro.showToast({
          title: result.msg,
          icon: 'none',
          mask: true
        })
      }
    )
  }
  //页面选择规格按钮
  clickSelectOptions() {
    if (this.state.info.status === '0') {//已下架
      return
    }
    this.setState({
      selectOptionsBtn: true
    }, () => {
      this.setState({
        showLayout: true
      })
    })
  }
  //关闭选择规格弹窗
  closeLayout() {
    this.setState({
      showLayout: false
    })
  }
  //评价列表
  evaluateList() {
    Taro.navigateTo({
      url: `/pages/evaluateList/index?id=${this.state.id}`
    })
  }
  //预约
  /* 
  *isRemind: 是否已填写预约
  */
  onShowRemind(isRemind) {
    const { showRemind, seckillinfo } = this.state
    if (isRemind) {
      seckillinfo.is_booking = 1
    }
    this.setState({
      showRemind: !showRemind,
      seckillinfo: seckillinfo
    })
  }
  onTouchMove(e) {
    e.stopPropagation()
    return
  }
  kaitong(){
    Taro.navigateTo({
      url:"../member/index?id=1"
    })
  }
  //显示隐藏下架提示
  onShowOffSale() {
    const showOffSaleMask = this.state.showOffSaleMask
    this.setState({
      showOffSaleMask: !showOffSaleMask
    })
  }
  //更新选择规格信息
  updateSelect(selectedOption) {
    this.setState({
      optionid: selectedOption.optionid,
      count: selectedOption.count,
      stock: selectedOption.stock
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
  // $setShareTitle = () => `${this.state.info.title}`
  // $setShareImageUrl = () => `${this.state.info.thumb}`
  // $setSharePath = () => `/pages/goodsDetail/index?id=${this.state.info.id}`

  render() {
    const {
      bannerHeight,
      isFavorite,
      thumbs,
      info,
      shop,
      content,
      goodsSpecs,
      optionsTxt,
      showLayout,
      selectOptionsBtn,
      buyNow,
      seckillinfo,
      showRemind,
      similarity_goods,
      showOffSaleMask,
      is_plus
    } = this.state
    const style = `height:${bannerHeight}`
    return (
      <block>
        <Loading show={this.state.loadingShow} title='加载中' />
        {
          info.id
            ? <View className='goods-wrap'>
              <Navbar />
              <Menu />
              {/* 预约组件 */}
              {
                (showRemind && seckillinfo) &&
                <Remind
                  showRemind={showRemind}
                  onShowRemind={this.onShowRemind.bind(this)}
                  taskid={seckillinfo.taskid}
                  roomid={seckillinfo.roomid}
                  timeid={seckillinfo.timeid}
                  goodsid={info.id}
                />
              }
              <Swiper
                className='swiper'
                circular
                style={style}
              >
                {
                  info.video &&
                  <SwiperItem>
                    <Video
                      src={info.video}
                      controls={true}
                      id='video'
                      className='goods-video'
                    />
                  </SwiperItem>
                }
                {
                  thumbs.map((item, index) => {
                    return (
                      <SwiperItem key={index}>
                        <Image src={item} mode='widthFix' className='goods-pic' onload={this.imageLoad.bind(this)}></Image>
                      </SwiperItem>
                    )
                  })
                }
              </Swiper>
              {
                seckillinfo &&
                <View className='info'>
                  <View className='left'>
                    <View className='xian'>￥{seckillinfo.price}</View>
                    <View className='yuan'>
                      <View style='text-decoration: line-through;'>￥{info.productprice}</View>
                      {
                        seckillinfo.status === 0 &&
                        <View className='total'>仅剩{seckillinfo.total}件</View>
                      }
                    </View>
                  </View>
                  {
                    seckillinfo.status === 0 &&
                    <View className='right'>
                      <View className='tips'>本场结束还剩</View>
                      <AtCountdown
                        format={{ hours: ':', minutes: ':', seconds: '' }}
                        hours={Number(seckillinfo.endtime[0])}
                        minutes={Number(seckillinfo.endtime[1])}
                        seconds={Number(seckillinfo.endtime[2])}
                        isCard
                      />
                    </View>
                  }
                  {
                    seckillinfo.status === 1 &&
                    <Text className='time'>{seckillinfo.starttime}准时开始</Text>
                  }
                </View>
              }
              <View className='goods-name'>{info.title}</View>
              <View className='goods-desc'>{info.subtitle}</View>
              <View className='goods-price'>
                <Text className='xian'>{info.marketprice}</Text>
                <Text style="color:#000">会员价￥{info.vipprice}</Text>
                {/* <Text style='text-decoration: line-through;'>￥{info.productprice}</Text> */}
                <View className='like_share'>
                  <Image src={isFavorite ? collect1 : collect} className='collect' onClick={this.goodsCollect.bind(this)} />
                  <Button className='share-btn' open-type='share' onClick={this.shareBtnClick.bind(this)}>
                    <Image src={shareIcon} className='btn' />
                  </Button>
                </View>
              </View>
              <View className='dispatchprice'>
                <View className='sf'>
                <View className="sj">
                <Image src={shangjin} className="shangjin"></Image>  
                </View>

                {
                  is_plus==0?
                  <View>
                 <View className="sjtitle">
                开通赏金卡会员，可免邮免税
                </View>
                <View className="guding">
                <View className="ktsj"  onClick={this.kaitong.bind(this)}>立即开通</View> 
                <View className="jiantou">></View> 
                </View>
                  </View>
                  : <View>
                    <View className="menberclass">
                  会员专属特权，下单确认收货后可获得赏金
                   </View>
                  </View>
                }
                </View>
              </View>
              <View className='item-list' onClick={this.clickSelectOptions.bind(this)}>
                <Text>选择</Text>
                <View className='choose-right'>
                  <Text>{optionsTxt === '' ? '规格' : optionsTxt}</Text>
                  <Image src={rightIcon} className='rightIcon'></Image>
                </View>
              </View>
              <View className='item-list' onClick={this.evaluateList.bind(this, info.id)}>
                <Text>评价</Text>
                <View className='choose-right'>
                  <View>评价({info.commentCount})</View>
                  <Image src={rightIcon} className='rightIcon'></Image>
                </View>
              </View>
              <View className='item-list' >
                <Text>说明</Text>
                <View className="chtlt">
                <View className='choose-tit'>
                正品保证
                </View>
                <View className='choose-tit'>
                品质无忧
                </View>
                <View className='choose-tit'>
                订单满488包邮
                </View>
                </View>
              </View>
              <View className='store' >
              
              </View>
              <View className="goods_detail">
              图文详情
              </View>
              <View>
                {
                  (process.env.TARO_ENV === 'weapp' && content != '')
                    ? <ParseComponent parseData={content} />
                    : ('')
                }
                {
                  (process.env.TARO_ENV === 'h5' && content !== '')
                    ? <View className='h5Parse'>
                      <View dangerouslySetInnerHTML={{ __html: content }} />
                    </View>
                    : ('')
                }
              </View>
              {
                seckillinfo.status === 0 &&
                <View className='bar-bottom'>
                  <View className='bar-list' onClick={this.linkTo.bind(this, 'index')}>
                    <Image src={indexIcon} className='bar-icon'></Image>
                    <Text>商城</Text>
                  </View>
                  <View className='bar-list' onClick={this.linkTo.bind(this, 'cart')}>
                    <Image src={cartIcon} className='bar-icon'></Image>
                    <Text>购物车</Text>
                  </View>
                  <View className='bar-btn' onClick={this.onShowLayout.bind(this, true)}>立即购买</View>
                </View>
              }
              {
                seckillinfo.status === 1 &&
                <View className='bar-bottom'>
                  <View className='bar-btn yuan' onClick={this.originalPrice.bind(this)}>原价购买</View>
                  {
                    seckillinfo.is_booking
                      ? <View className='bar-btn remind'>已预约</View>
                      : <View className='bar-btn remind' onClick={this.onShowRemind.bind(this, false)}>提醒我({seckillinfo.starttime}开始)</View>
                  }
                </View>
              }
              {
                !seckillinfo &&
                <View className='bar-bottom'>
                  <View className='bar-list' onClick={this.linkTo.bind(this, 'index')}>
                    <Image src={indexIcon} className='bar-icon'></Image>
                    <Text>商城</Text>
                  </View>
                  <View className='bar-list' onClick={this.linkTo.bind(this, 'cart')}>
                    <Image src={cartIcon} className='bar-icon'></Image>
                    <Text>购物车</Text>
                    {
                      this.props.cart.cartData.total > 0 &&
                      <View className='num'>{this.props.cart.cartData.total}</View>
                    }
                  </View>
                  {
                    info.status === '0'
                      ? <View className='bar-btn offSale-btn'>商品已下架</View>
                      : <View style='display:flex;align-item:center;flex:1'>
                        <View className='bar-btn addCart' onClick={this.onShowLayout.bind(this, false)}>加入购物车</View>
                        {
                          !this.state.is_addprice
                            ? <View className='bar-btn' onClick={this.onShowLayout.bind(this, true)}>立即购买</View>
                            : ('')
                        }
                      </View>
                  }
                </View>
              }
              {/* 选择规格组件 */}
              {
                this.state.optiosReady &&
                <OptionLayout
                  isOpened={showLayout}
                  onClose={this.closeLayout.bind(this)}
                  specsData={goodsSpecs}
                  optionsData={this.state.goodsOptions}
                  goodsInfo={info}
                  buyNow={buyNow}
                  selectOptionsBtn={selectOptionsBtn}
                  onUpdateSelect={this.updateSelect.bind(this)}
                  onAddCart={this.addCart.bind(this)}
                />
              }
              {
                similarity_goods.length > 0 &&
                < View className='goods-recommend'>
                  <View className='title-block'>
                    <View className='en-title'>RECOMMEND</View>
                    <View className='cn-title'>
                      <Image className='line' src={line} />
                      <Text>相似推荐</Text>
                    </View>
                  </View>
                  <Recommend
                    list={similarity_goods}
                  />
                </View>
              }
              <Like />
              {/* 商品已下架 */}
              {
                (info.status === '0' && similarity_goods.length > 0) &&
                <View className='offSale' onTouchMove={this.onTouchMove.bind(this)}>
                  <View className={showOffSaleMask ? 'mask mask_active' : 'mask'} />
                  <View className={showOffSaleMask ? 'main main_active' : 'main'}>
                    <View className='title' onClick={this.onShowOffSale.bind(this)}>
                      <Text>商品已下架，您可能会喜欢</Text>
                      <Image src={down} className={showOffSaleMask ? 'down' : 'up'} />
                    </View>
                    <Recommend list={similarity_goods} />
                  </View>
                </View>
              }
            </View>
            : ('')
        }
      </block>
    )
  }
}


export default GoodsDetail; 