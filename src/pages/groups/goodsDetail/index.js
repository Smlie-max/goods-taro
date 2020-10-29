import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Button } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import Navbar from '../../../components/navbar'
import Request from '../../../utils/request';
import Menu from '../../../components/menu';
import Loading from '../../../components/loading';

import { api } from '../../../utils/api';
import ParseComponent from '../../../components/wxParse';
import GroupsRecommend from '../components/recommend'
import withShare from '../../../utils/withShare'
import withToken from '../../../utils/withToken'
import bindParent from '../../../utils/bindParent'
import shareConfig from '../../../utils/share'
import { getLoginAndLabel } from '../../../utils/common'

import ruleIcon1 from '../images/rule1.png'
import ruleIcon2 from '../images/rule2.png'
import detailIcon from '../images/detail-icon.png'
import shareIcon from '../images/share.png'
import defaultIcon from '../../../images/default.png'
import orderIcon from '../images/icon1.png'
import './index.less'

@withToken()
@withShare()

class GroupsGoodsDetail extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      bannerHeight: 250, //轮播图默认高度
      current: 1,
      goodsDetail: {},
      rules: '',
      shareMessage: {},
      recommend: [],
      id: '',
      teamid: '',
      team_info: '',
      isTeam: false, //是否为团
      loadingShow: true, //loading
      ready: false
    }
  }
  config = {
    navigationBarTitleText: '拼团'
  }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    if (this.$router.params.id) {
      this.setState({
        id: this.$router.params.id
      }, () => {
        this.getDetail()
      })
    } else if (this.$router.params.teamid) {
      this.setState({
        teamid: this.$router.params.teamid,
        isTeam: true
      }, () => {
        this.getGroupsDetail()
      })
    }
  }

  getDetail() {
    // Taro.showLoading({
    //   title: '加载中'
    // })
    Request.post(api.groupsDetail, {
      id: this.state.id
    }).then(
      res => {
        // Taro.hideLoading()
        this.setState({
          loadingShow: false,
          ready: true
        })
        const result = res.data;
        if (result.code === 0) {
          if (process.env.TARO_ENV === 'h5') {
            document.title = result.data.goods.title || 'FDG滴蕉蕉'
          } else if (process.env.TARO_ENV === 'weapp') {
            Taro.setNavigationBarTitle({
              title: result.data.goods.title || 'FDG滴蕉蕉'
            })
          }
          this.setState({
            goodsDetail: result.data.goods,
            rules: result.data.rules,
            shareMessage: result.data.shopshare
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.imgUrl}`
            this.$setSharePath = () => `/pages/groups/goodsDetail/index?${this.state.teamid ? 'teamid' : 'id'}=${this.state.teamid ? this.state.teamid : this.state.id}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.imgUrl}`,
              path: `/pages/groups/goodsDetail/index?${this.state.teamid ? 'teamid' : 'id'}=${this.state.teamid ? this.state.teamid : this.state.id}`,
              desc: `${this.state.shareMessage.desc}`
            })
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
  //拼团详情
  getGroupsDetail() {
    // Taro.showLoading({
    //   title: '加载中'
    // })
    Request.post(api.teamDetail, {
      teamid: this.state.teamid
    }).then(
      res => {
        // Taro.hideLoading()
        this.setState({
          loadingShow: false
        })
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            goodsDetail: result.data.goods,
            rules: result.data.rules,
            team_info: result.data.team_info,
            id: result.data.goods.id,
            shareMessage: result.data.shopshare
          }, () => {
            //小程序和h5分享
            this.$setShareTitle = () => `${this.state.shareMessage.title}`
            this.$setShareImageUrl = () => `${this.state.shareMessage.imgUrl}`
            this.$setSharePath = () => `/pages/groups/goodsDetail/index?${this.state.teamid ? 'teamid' : 'id'}=${this.state.teamid ? this.state.teamid : this.state.id}`
            shareConfig({
              title: `${this.state.shareMessage.title}`,
              imageUrl: `${this.state.shareMessage.imgUrl}`,
              path: `/pages/groups/goodsDetail/index?${this.state.teamid ? 'teamid' : 'id'}=${this.state.teamid ? this.state.teamid : this.state.id}`,
              desc: `${this.state.shareMessage.desc}`
            })
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
  changeTab(current) {
    this.setState({
      current: current
    })
  }
  //开团 
  /*
    id: 团购商品ID
    // type: 1--团购 2--单独购买
    is_order: 0--预览 1--下单
    aid: 地址ID
    // heads: 0--参团 1--开团
  */
  setGroups() {
    getLoginAndLabel()
      .then((res) => {
        if (!res) return
        Taro.showLoading({
          title: '加载中'
        })
        Request.post(api.orderSubmit, {
          ggid: this.state.id,
          is_group: 1, //拼团订单
          is_order: 0,
          teamid: this.state.teamid
        }).then(
          res => {
            Taro.hideLoading()
            const result = res.data
            if (result.code === 0) {
              Taro.navigateTo({
                url: `/pages/groups/orderPreview/index?id=${this.state.id}&teamid=${this.state.teamid}`
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
  //拼团首页
  groupsIndex() {
    Taro.navigateTo({
      url: `/pages/groups/groups/index`
    })
  }
  //重新开团
  goodsDetail() {
    Taro.navigateTo({
      url: `/pages/groups/goodsDetail/index?id=${this.state.id}`
    })
  }
  lookDetail() {
    Taro.navigateTo({
      url: `/pages/orderDetail/index?id=${this.state.team_info.order_id}`
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

  //直接购买跳到正常购买流程
  normalBuy() {
    Taro.navigateTo({
      url: `/pages/orderPreview/index?id=${this.state.goodsDetail.goodsid}&optionid=''&total=1`
    })
  }
  // onShareAppMessage(res) {
  //   let id = ''
  //   let type = ''
  //   if (this.state.teamid !== '') {
  //     id = this.state.teamid
  //     type = 'teamid'
  //   } else if (this.state.id !== '') {
  //     id = this.state.id
  //     type = 'id'
  //   }
  //   return {
  //     title: this.state.share.title,
  //     path: `/pages/groups/goodsDetail/index?${type}=${id}`,
  //     imageUrl: this.state.share.imgUrl
  //   }
  // }
  // $setSharePath = () => `/pages/groups/goodsDetail/index?${this.state.teamid ? 'teamid' : 'id'}=${this.state.teamid ? this.state.teamid : this.state.id}`
  // $setShareTitle = () => `${this.state.shareMessage.title}`
  // $setShareImageUrl = () => `${this.state.shareMessage.imgUrl}`

  render() {
    const {
      current,
      goodsDetail,
      rules,
      id,
      teamid,
      team_info,
      isTeam,
      bannerHeight,
      ready
    } = this.state
    const style = `height:${bannerHeight}`
    const numbers = [...Array(team_info.few_count).keys()]
    return (
      <View className='GroupsGoodsDetail'>
        <Loading show={this.state.loadingShow} title='加载中' />
        <Navbar />
        <Menu />
        <Swiper
          className='swiper'
          circular
          autoplay
          style={style}
        >
          {
            goodsDetail.thumb_url &&
            goodsDetail.thumb_url.map((item) => {
              return (
                <SwiperItem key={item}>
                  <Image className='swiper-img' src={item} mode='widthFix' onLoad={this.imageLoad.bind(this)} />
                </SwiperItem>
              )
            })
          }
        </Swiper>
        <View className='goods-info'>
          <View className='goods-title'>{goodsDetail.title}</View>
          <View className='goods-desc'>{goodsDetail.description}</View>
          <View className='price-view'>
            <Text className='xian'>￥{goodsDetail.groupsprice}</Text>
            <Text className='yuan'>￥{goodsDetail.price}</Text>
          </View>
        </View>
        {
          (teamid && team_info) &&
          <View className='groups-view'>
            {
              team_info.success === 0
                ? <block>
                  <View className='title'>已开团，还差 {team_info.few_count} 人即可成团</View>
                  <AtCountdown
                    format={{ hours: ':', minutes: ':', seconds: '' }}
                    hours={team_info.few_time[0]}
                    minutes={team_info.few_time[1]}
                    seconds={team_info.few_time[2]}
                    isCard
                  />
                </block>
                : <View />
            }
            {
              (team_info.is_join && team_info.success === 1) &&
              <View className='title'>恭喜你，团已满员</View>
            }
            {
              (!team_info.is_join && team_info.success === 1)
                ? <View className='title'>团已满员</View>
                : <View />
            }
            {
              team_info.success === -1
                ? <View className='title' style='color:#D73B3B'>未在规定时间完成，拼团失败</View>
                : <View />
            }
            <View className='team-view'>
              {
                team_info.user_list
                  ? team_info.user_list.map((item, index) => {
                    return (
                      <View className='member' key={item.user_id}>
                        <View className='avatar-view'>
                          <Image src={item.avatar || defaultIcon} className='thumb' />
                          {
                            index === 0 && <Text className='leader'>团</Text>
                          }
                        </View>
                        <Text>{item.nickname || ''}</Text>
                      </View>
                    )
                  })
                  : ('')
              }
              {
                numbers.map((index) => {
                  return (
                    <Button className='member share-btn' key={index} openType='share' onClick={this.shareBtnClick.bind(this)}>
                      <View className='avatar-view'>
                        <Image src={shareIcon} className='share' />
                      </View>
                      <Text>邀请</Text>
                    </Button>
                  )
                })
              }
            </View>
          </View>
        }
        {
          !isTeam
            ? <Button className='btn' onClick={this.setGroups.bind(this, 1, 1)}>{goodsDetail.groupnum}人成团 我要开团</Button>
            : <View />
        }
        {
          (isTeam && !team_info.is_join && team_info.success === 0)
            ? <Button className='btn' onClick={this.setGroups.bind(this, 1, 0)}>加入团购</Button>
            : <View />
        }
        {
          (isTeam && team_info.is_join && team_info.success === 0)
            ? <Button className='btn' openType='share' onClick={this.shareBtnClick.bind(this)}>立即邀请好友</Button>
            : <View />
        }
        {
          (isTeam && team_info.is_join && team_info.success === 1)
            ? <View className='success'>
              <Text style='color:#1E3468'>拼团成功，</Text>
              <Text>商家将尽快为您们发货</Text>
            </View>
            : <View />
        }
        {
          (isTeam && !team_info.is_join && team_info.success === 1)
            ? <View className='success' onClick={this.groupsIndex.bind(this)}>查看更多团</View>
            : <View />
        }
        {
          (isTeam && !team_info.is_join && team_info.success === -1)
            ? <View className='success' onClick={this.groupsIndex.bind(this)}>查看更多团</View>
            : <View />
        }
        {
          (isTeam && team_info.is_join && team_info.success === -1)
            ? <View className='success' onClick={this.goodsDetail.bind(this)}>重新开团</View>
            : <View />
        }
        {ready && <GroupsRecommend goods_id={id} />}
        <View className='tabbar'>
          <View className={current === 1 ? 'active tab' : 'tab'} onClick={this.changeTab.bind(this, 1)}>
            <Image src={current === 1 ? ruleIcon1 : ruleIcon2} className='ruleIcon' mode='widthFix'></Image>
            <Text>拼团玩法</Text>
          </View>
          <View className={current === 2 ? 'active tab' : 'tab'} onClick={this.changeTab.bind(this, 2)}>
            <Text>商品介绍</Text>
          </View>
        </View>
        {
          current === 1
            ? <View className='tabsPane'>
              <View>
                {
                  (process.env.TARO_ENV === 'weapp' && rules !== '')
                    ? <ParseComponent parseData={rules} />
                    : ('')
                }
                {
                  (process.env.TARO_ENV === 'h5' && rules !== '')
                    ? <View className='h5Parse'>
                      <View dangerouslySetInnerHTML={{ __html: rules }} />
                    </View>
                    : ('')
                }
              </View>
            </View>
            : <View className='tabsPane'>
              <Image src={detailIcon} className='detailIcon' />
              <View>
                {
                  (process.env.TARO_ENV === 'weapp' && goodsDetail.content)
                    ? <ParseComponent parseData={goodsDetail.content} />
                    : ('')
                }
                {
                  (process.env.TARO_ENV === 'h5' && goodsDetail.content)
                    ? <View className='h5Parse'>
                      <View dangerouslySetInnerHTML={{ __html: goodsDetail.content }} />
                    </View>
                    : ('')
                }
              </View>
            </View>
        }
        {/* <Image src={moreIcon} className='moreIcon' mode='widthFix' /> */}
        {/* <GoodGroups /> */}
        {/* 导航栏 */}
        <View className='bottom-tabbar'>
          {
            (!isTeam && goodsDetail.single === '1')
              ? <View className='tab' onClick={this.normalBuy.bind(this)}>
                <Text>￥{goodsDetail.singleprice} 直接购买</Text>
              </View>
              : <View />
          }
          {
            !isTeam
              ? <View className='tab right' style='background:#1E3468;color:#fff' onClick={this.setGroups.bind(this, 1, 1)}>
                <Text>{goodsDetail.groupnum}人成团</Text>
              </View>
              : <View />
          }
          {
            (isTeam && !team_info.is_join && team_info.success === 0)
              ? <View className='tab right' style='background:#1E3468;color:#fff' onClick={this.setGroups.bind(this, 1, 0)}>
                <Text>加入团购</Text>
              </View>
              : <View />
          }
          {
            (isTeam && team_info.is_join && team_info.success === 0)
              ? <View className='tab right' style='background:#1E3468;color:#fff'>
                <Button openType='share' className='share-btn' onClick={this.shareBtnClick.bind(this)}>立即邀请好友</Button>
              </View>
              : <View />
          }
          {
            (isTeam && team_info.is_join && team_info.success === 1)
              ? <View className='tab right' style='background:#fff;color:#1E3468'>
                <View style='flex：1'>
                  <Text>拼团成功，</Text>
                  <Text style='color:#565656'>商家将尽快为您们发货</Text>
                </View>
                <View className='look_detail' onClick={this.lookDetail.bind(this)}>
                  <Image src={orderIcon} className='orderIcon' />
                  <View style='line-height:1.2'>查看订单</View>
                </View>
              </View>
              : <View />
          }
          {
            (isTeam && !team_info.is_join && team_info.success === 1)
              ? <View className='tab right' style='background:#1E3468;color:#fff' onClick={this.groupsIndex.bind(this)}>查看更多团</View>
              : <View />
          }
          {
            (isTeam && team_info.is_join && team_info.success === -1)
              ? <View className='tab right' style='background:#fff;color:#D73B3B'>拼团失败</View>
              : <View />
          }
          {
            (isTeam && !team_info.is_join && team_info.success === -1)
              ? <View className='tab right' style='background:#fff;color:#D73B3B' onClick={this.groupsIndex.bind(this)}>查看更多团</View>
              : <View />
          }
        </View>
      </View>
    )
  }
}

export default GroupsGoodsDetail;
