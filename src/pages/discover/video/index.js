import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import line from '../images/line.png'
import playBtn from '../images/play-btn.png'
import likeIcon from '../images/like.png'
import msgIcon from '../images/msg.png'

import './index.less'

class DiscoverVideo extends Component {
  config = {
    navigationBarTitleText: '视频列表'
  }
  constructor() {
    super(...arguments)
    this.state = {
      categoryList: [1, 2, 3],
      banner: '',
      cate_list: [],
      fashion: [],
      recommend: [],
      brand: []
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Request.post(api.disVideoList, {}).then(
      res => {
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            banner: result.data.adv,
            cate_list: result.data.cate_list,
            fashion: result.data.fashion,
            recommend: result.data.recommend,
            brand: result.data.brand
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

  videoDetail(id) {
    Taro.navigateTo({
      url: '/pages/discover/video/videoDetail?id=' + id
    })
  }
  render() {
    const { cate_list, banner, brand, fashion, recommend } = this.state
    return (
      <View className='DiscoverVideo'>
        <Navbar />
        <Menu />
        {
          banner && <Image src={banner.thumb} className='banner' mode='widthFix' />
        }
        <View className='category'>
          {
            cate_list.length > 0 &&
            cate_list.map((item) => {
              return (
                <Image src={item.thumb} className='category-list' mode='widthFix' key={item.id} />
              )
            })
          }
        </View>
        {/* 今日推荐 */}
        {
          recommend.length > 0 &&
          <View className='recommend'>
            <View className='en-title'>Recommended today</View>
            <View className='cn-title'>
              <Image className='line' src={line} />
              <Text>今日推荐</Text>
            </View>
            {
              recommend.map((item) => {
                return (
                  <View className='video-block' key={item.id} onClick={this.videoDetail.bind(this, item.id)}>
                    <View className='video-cover'>
                      <Image className='cover' src={item.thumb} mode='widthFix' />
                      <View className='mask'>
                        <Image className='playBtn' src={playBtn} />
                      </View>
                    </View>
                    <View className='bottom'>
                      <Text className='title'>{item.title}</Text>
                      <View className='show-item' style='margin-right: 10px;'>
                        <Image className='icon' src={likeIcon} />
                        <Text>{item.like_num}</Text>
                      </View>
                      <View className='show-item'>
                        <Image className='icon' src={msgIcon} />
                        <Text>{item.play_num}</Text>
                      </View>
                    </View>
                  </View>
                )
              })
            }
          </View>
        }
        {/* 品牌街 */}
        {
          brand.length > 0 &&
          <View className='brand-street'>
            <View className='en-title'>BRAND STREET</View>
            <View className='cn-title'>
              <Image className='line' src={line} />
              <Text>品牌街</Text>
            </View>
            <View className='video-list'>
              {
                brand.map((item) => {
                  return (
                    <View className='video-main' key={item.id} onClick={this.videoDetail.bind(this, item.id)}>
                      <View className='video-cover'>
                        <Image className='cover' src={item.thumb} />
                        <View className='mask'>
                          <Image className='playBtn' src={playBtn} />
                        </View>
                      </View>
                      <View className='title'>{item.title}</View>
                    </View>
                  )
                })
              }
            </View>
            <View className='more'>查看更多</View>
          </View>
        }
        {/* 时尚达人都在看 */}
        {
          fashion.length > 0 &&
          <View className='fashion'>
            <View className='en-title'>Fashionistas are watching</View>
            <View className='cn-title'>
              <Image className='line' src={line} />
              <Text>时尚达人都在看</Text>
            </View>
            <View className='video-list'>
              {
                fashion.map((item) => {
                  return (
                    <View className='video-main' key={item.id} onClick={this.videoDetail.bind(this, item.id)}>
                      <View className='video-cover'>
                        <View className='mask'>
                          <Image className='playBtn' src={playBtn} />
                        </View>
                        <Image className='cover' src={item.thumb} />
                      </View>
                      <View className='title'>{item.title}</View>
                    </View>
                  )
                })
              }
            </View>
            {/* <View className='more'>查看更多</View> */}
          </View>
        }
      </View>
    )
  }
}

export default DiscoverVideo;
