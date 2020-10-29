import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Video, ScrollView } from '@tarojs/components'
import Navbar from '../../../components/navbar'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import collect1 from '../../../images/collect1.png'
import collect2 from '../../../images/collect2.png'

import './videoDetail.less'

class VideoDetail extends Component {
  config = {
    navigationBarTitleText: '视频详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      goodsList: [],
      videoInfo: {},
      id: ''
    }
  }
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }
  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.disVideoDetail, {
      id: this.$router.params.id
    }).then(
      res => {
        Taro.hideLoading();
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            videoInfo: result.data.info,
            goodsList: result.data.goods_list,
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

  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  //点赞视频
  videoLike() {
    Request.post(api.videoLike, {
      id: this.state.id
    }).then(
      res => {
        const result = res.data;
        if (result.code === 0) {
          const videoInfo = this.state.videoInfo
          videoInfo.is_like = !videoInfo.is_like
          videoInfo.like_num = result.data.like_num
          this.setState({
            videoInfo: videoInfo
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
  render() {
    const { goodsList, videoInfo } = this.state
    return (
      <View className='VideoDetail'>
        <Navbar />
        <View className='video-view'>
          <Video
            src={videoInfo.link}
            controls={true}
            autoplay={false}
            poster={videoInfo.thumb}
            initialTime='0'
            id='video'
            loop={false}
            muted={false}
            className='video'
          />
        </View>
        <View className='video-info'>
          <Text className='video-title'>{videoInfo.title}</Text>
          <View className='like-view'>
            <Image src={videoInfo.is_like ? collect2 : collect1} className='likeIcon' onClick={this.videoLike.bind(this)} />
            <Text>{videoInfo.like_num}</Text>
          </View>
        </View>
        <View className='video-desc'>{videoInfo.desc}</View>
        {
          goodsList.length > 0
            ? <View className='title'>相关产品（{goodsList.length}）</View>
            : <View />
        }
        <ScrollView
          className='goods-view'
          scrollX
        >
          {
            goodsList.map((item) => {
              return (
                <View className='goods' key={item.id} onClick={this.goodsDetail.bind(this, item.id)}>
                  <Image src={item.thumb} className='goods-pic' mode='widthFix' />
                  <View className='goods-title'>{item.title}</View>
                  <View className='price-view'>
                    <Text className='xian'>￥{item.productprice}</Text>
                    {/* <Text className='yuan'>￥{item.marketprice}</Text> */}
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }
}

export default VideoDetail;
