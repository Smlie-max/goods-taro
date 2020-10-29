import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Menu from '../../../components/menu'
import HotArea from '../../../components/hotArea'
import ArticleBlock from '../components/articleBlock'
import MoodMask from '../components/moodMask'
import Request from '../../../utils/request'
import { api } from '../../../utils/api'
import Loading from '../../../components/loading'
import withToken from '../../../utils/withToken'
import withShare from '../../../utils/withShare'
import shareConfig from '../../../utils/share'
import bindParent from '../../../utils/bindParent'
import playBtn from '../images/play-btn.png'
import line from '../images/line.png'
import './index.less'
@withToken()
@withShare()

class Discover extends Component {
  config = {
    navigationBarTitleText: '蕉蕉发现'
  }
  constructor() {
    super(...arguments)
    this.state = {
      showMoodMask: false,
      data: [],
      loadingShow: true
    }
  }

  componentWillMount() { }

  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    Request.post(api.discoverIndex, {}).then(
      res => {
        this.setState({
          loadingShow: false
        })
        const result = res.data;
        if (result.code == 0) {
          this.setState({
            data: result.data,
          })
        } else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
    //分享
    Request.post(api.commonShare, {})
      .then(
        res => {
          const result = res.data.data;
          //小程序和h5分享
          this.$setShareTitle = () => `${result.title}`
          this.$setShareImageUrl = () => `${result.icon}`
          this.$setSharePath = () => `/pages/discover/index/index?`
          shareConfig({
            title: `${result.title}`,
            imageUrl: `${result.icon}`,
            path: `/pages/discover/index/index?`,
            desc: `${result.desc}`
          })
        }
      )
  }

  videoDetail(id) {
    Taro.navigateTo({
      url: `/pages/discover/video/videoDetail?id=${id}`
    })
  }
  videoList() {
    Taro.navigateTo({
      url: `/pages/discover/video/index`
    })
  }
  onShowMoodMask() {
    Taro.showLoading()
    Request.post(api.checkMood, {}).then(
      res => {
        const result = res.data
        Taro.hideLoading()
        if (result.code === 0) {
          Taro.navigateTo({
            url: `/pages/discover/mood/index?id=${result.data.id}`
          })
        } else {
          const showMoodMask = this.state.showMoodMask
          this.setState({
            showMoodMask: !showMoodMask
          })
        }
      }
    )
  }
  onCloseMoodMask() {
    this.setState({
      showMoodMask: false
    })
  }
  render() {
    const { data, showMoodMask } = this.state
    return (
      <View className='Discover'>
        <Navbar />
        <Menu />
        <Loading show={this.state.loadingShow} title=' ' />
        {
          showMoodMask && <MoodMask onCloseMoodMask={this.onCloseMoodMask.bind(this)} />
        }
        {
          data.map((item) => {
            return (
              <View key={item.type_id}>
                <View className='title-block'>
                  <View className='en-title'>{item.en_title}</View>
                  <View className='cn-title'>
                    <Image className='line' src={line} />
                    <Text>{item.title}</Text>
                  </View>
                </View>
                {/* 视频板块 */}
                {
                  item.type_id === '1' &&
                  <View className='video-block'>
                    <View className='video-view'>
                      {
                        item.items.map((list) => {
                          return (
                            <View className='video-main' key={list.id} onClick={this.videoDetail.bind(this, list.id)}>
                              <View className='mask'>
                                <Image className='cover' src={list.thumb} />
                                <Image className='play-btn' src={playBtn} />
                              </View>
                              <View className='desc'>{list.title}</View>
                            </View>
                          )
                        })
                      }
                    </View>
                    <View className='more' onClick={this.videoList.bind(this)}> > </View>
                  </View>
                }
                {/* 心情板块 */}
                {
                  item.type_id === '2' &&
                  <View className='my-mood' onClick={this.onShowMoodMask.bind(this)}>
                    <HotArea data={item.data} bgImg={item.imgurl} />
                  </View>
                }
                {/* 今日话题板块 */}
                {
                  item.type_id === '3' &&
                  <View>
                    <HotArea data={item.data} bgImg={item.imgurl} />
                    <View className='input-view'>
                      <Input className='input' placeholder='我也要说' />
                      <View className='submit'> > </View>
                    </View>
                  </View>
                }
                {/* 热门推荐 */}
                {
                  item.type_id === '4' &&
                  <HotArea data={item.data} bgImg={item.imgurl} />
                }
                {/* 精选活动 */}
                {
                  item.type_id === '5' &&
                  <HotArea data={item.data} bgImg={item.imgurl} />
                }
                {/* 口袋精品店 */}
                {
                  item.type_id === '6' &&
                  <HotArea data={item.data} bgImg={item.imgurl} />
                }
                {/* 精选活动 */}
                {
                  item.type_id === '7' &&
                  <HotArea data={item.data} bgImg={item.imgurl} />
                }
                {/* 达人说 */}
                {
                  item.type_id === '8' &&
                  <View className='article-view'>
                    {
                      item.items.map((list) => {
                        return (
                          <ArticleBlock data={list} key={list.id} />
                        )
                      })
                    }
                  </View>
                }
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default Discover;
