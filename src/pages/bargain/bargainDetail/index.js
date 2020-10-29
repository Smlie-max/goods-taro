import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Button } from '@tarojs/components'
import ruleIcon from '../images/wenhao.png'
import bg from '../images/bg.png'
import rankBg from '../images/title1.png'
import { AtCountdown, AtProgress, AtLoadMore } from 'taro-ui'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Request from '../../../utils/request'
import { api } from '../../../utils/api'
import Modal from './modal'
import withShare from '../../../utils/withShare'
import withToken from '../../../utils/withToken'
import bindParent from '../../../utils/bindParent'
import shareConfig from '../../../utils/share'

import './index.less'
@withToken()
@withShare()
class bargainDetail extends Component {
  config = {
    navigationBarTitleText: '详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      showModal: true,
      detail: {},
      page: 1,
      bpid: '',
      list: [],
      loadStatus: 'loading',
      endtime: false, //倒计时
      shareMessage: {}, //分享信息
    }
  }
  componentWillMount() {
    this.setState({
      bgid: this.$router.params.bgid || '',
      bpid: this.$router.params.bpid || '',
    }, () => {
      this.loadList()
    })
  }

  componentDidMount(){
    bindParent(this.$router.params.shareFromUser) //绑定
    Request.post(api.bargainDetail, {
      bgid: this.$router.params.bgid || '',
      bpid: this.$router.params.bpid || '',
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data
        this.setState({
          detail: result.data,
          endtime: result.data.endtime,
          shareMessage: result.data.share
        }, () => {

          //小程序和h5分享
          this.$setShareTitle = () => `${this.state.shareMessage.share_title}`
          this.$setShareImageUrl = () => `${this.state.shareMessage.share_logo}`
          this.$setSharePath = () => `/pages/bargain/bargainDetail/index?bpid=${this.state.bpid}`
          shareConfig({
            title: `${this.state.shareMessage.share_title}`,
            imageUrl: `${this.state.shareMessage.share_logo}`,
            path: `/pages/bargain/bargainDetail/index?bpid=${this.state.bpid}`,
            desc: `${this.state.shareMessage.share_desc}`
          })
        })
      }
    )
  }

  loadList() {
    Request.post(api.bargainLog, {
      page: this.state.page,
      bpid: this.state.bpid,
    }).then(
      res => {
        const result = res.data
        const list = result.data.list
        if (result.code === 0) {
          if (list.length === 0) {
            this.setState({
              loadStatus: 'noMore'
            })
            return;
          }
          this.setState({
            list: this.state.list.concat(list),
            loadStatus: 'loading'
          })
          if (list.length === parseInt(result.data.total)) {
            this.setState({
              loadStatus: 'noMore'
            })
          }
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }

  loadMore = () => {
    if (this.state.loadStatus === 'noMore') {
      return
    }
    this.setState({
      page: this.state.page + 1,
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }
  //关闭弹窗
  onCloseMoadl() {
    this.setState({
      showModal: false
    })
  }
  //我也要砍
  goodsDetail() {
    Taro.redirectTo({
      url: '/pages/bargain/goodsDetail/index?bgid=' + this.state.detail.bgid
    })
  }
  //立即购买
  buy() {
    if (this.state.detail.can_order) {
      Taro.navigateTo({
        url: '/pages/bargain/orderPreview/index?bpid=' + this.state.detail.bpid
      })
    } else if (this.state.detail.is_order === '1') {
      Taro.navigateTo({
        url: '/pages/orderDetail/index?id=' + this.state.detail.order_id
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '该商品没到底价不能购买！',
        showCancel: false
      })
    }
  }
  //活动规则
  activeRule() {
    Taro.navigateTo({
      url: `/pages/article/index?type=1`
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
  render() {
    const { showModal, detail, list, loadStatus, endtime } = this.state
    return (
      <View className='BrandDetailWrap'>
        <Navbar />
        <Menu />
        <ScrollView
          className='bargainDetail'
          scrollY
          onScrollToLower={this.loadMore.bind(this)}>
          {
            showModal && detail.alert && detail.is_order == '0'
              ? <Modal
                title={detail.alert.title}
                content={detail.alert.subhead}
                btnText={detail.alert.btn}
                btnType={detail.alert.type}
                icon={detail.alert.icon}
                onCloseMoadl={this.onCloseMoadl.bind(this)}
              />
              : ('')
          }
          <Image src={bg} className='bg' mode='widthFix' />
          {/*规则*/}
          <View className='rule' onClick={this.activeRule.bind(this)}>
            <Image src={ruleIcon} className='ruleIcon' />
            <Text>活动规则</Text>
          </View>
          <View className='user-info'>
            <Image src={detail.avatar} className='avatar' />
            <View className='user'>
              <View className='name'>{detail.nickname}</View>
              <View className='desc'>我发现了一件好货，快来助我一臂之力</View>
            </View>
          </View>
          <View className='main'>
            {/* 砍价中 */}
            {
              detail.status == '0'
                ? <View className='status'>
                  <Text className='txt'>砍价距结束还剩</Text>
                  {
                    endtime &&
                    <AtCountdown
                      format={{ hours: ':', minutes: ':', seconds: '' }}
                      hours={Number(endtime[0])}
                      minutes={Number(endtime[1])}
                      seconds={Number(endtime[2])}
                      isCard
                    />
                  }
                </View>
                : <View />
            }
            {/* 砍价成功 */}
            {
              detail.status == '1'
                ? <View className='status_tips'>
                  <View className='tips'>恭喜砍价成功</View>
                </View>
                : <View />
            }
            {/* 砍价失败 */}
            {
              detail.status == '2'
                ? <View className='status_tips'>
                  <View className='tips'>砍价失败</View>
                </View>
                : <View />
            }
            <View className='goods-view'>
              <Image src={detail.thumb} className='goods-pic' mode='widthFix' />
            </View>
            <View className='goods-title'>{detail.title}</View>
            <View className='price-view'>
              <Text>底价 ￥{detail.end_price}</Text>
              <Text className='yuan'>￥{detail.marketprice}</Text>
            </View>
            <View className='percent-view'>
              <AtProgress percent={detail.ratio} strokeWidth={10} isHidePercent color='#1E3468' />
              <View className='percent-tips'>
                <Text className='left'>已砍 ￥{detail.bargain_price}</Text>
                <Text className='middle'>当前价 ￥{detail.now_price}</Text>
                <Text className='right'>￥{detail.marketprice}</Text>
              </View>
            </View>
            {/* 自己是发起人 */}
            {
              detail.oneself &&
              <block>
                {
                  detail.status === '0' &&
                  <View className='btn-view'>
                    <View className='btn buy' onClick={this.buy.bind(this)}>立即购买</View>
                    <Button className='btn' openType='share' onClick={this.shareBtnClick.bind(this)}>找人帮砍</Button>
                  </View>
                }
                {/* 未付款 */}
                {
                  detail.status === '1' && detail.is_order == '0'
                    ? < View className='btn-view'>
                      <View className='btn' onClick={this.buy.bind(this)}>立即以最终价付款</View>
                    </View>
                    : ('')
                }
                {/* 已付款 */}
                {
                  detail.status === '1' && detail.is_order == '1'
                    ? <View className='btn-view'>
                      <View className='btn'>已下单成功</View>
                    </View>
                    : ('')
                }
              </block>
            }
            {/* 自己不是发起人(是路人) */}
            {
              !detail.oneself &&
              <block>
                {
                  detail.status === '0' &&
                  <View className='btn-view'>
                    <View className='btn buy' onClick={this.goodsDetail.bind(this)}>我也要砍</View>
                    <Button className='btn' openType='share' onClick={this.shareBtnClick.bind(this)}>分享助力</Button>
                  </View>

                }
                {
                  detail.status === '1' &&
                  <View className='btn-view'>
                    <View className='btn buy' onClick={this.goodsDetail.bind(this)}>我也要砍</View>
                  </View>
                }
              </block>
            }

          </View>
          <Image src={rankBg} className='rank-bg' />
          {
            list.map((item) => {
              return (
                <View className='list' key={item}>
                  <Image src={item.avatar} className='thumb' />
                  <View className='help-info'>
                    <View className='help-left'>
                      <View className='name'>{item.nickname}</View>
                      <View className='help-txt'>{item.bargain_phrase}</View>
                    </View>
                    <View className='help-right'>砍掉￥{item.bargain_price}</View>
                  </View>
                </View>
              )
            })
          }
          <AtLoadMore
            status={loadStatus}
            moreText='上拉加载更多'
          />
        </ScrollView>
      </View >
    )
  }
}

export default bargainDetail;
