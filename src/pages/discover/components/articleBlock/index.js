import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import star from '../../images/star.png'
import heart from '../../images/heart.png'
import './index.less'

class ArticleBlock extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  articleDetail(id) {
    Taro.navigateTo({
      url: `/pages/articleDetail/index?id=${id}`
    })
  }

  render() {
    const { data } = this.props
    return (
      <View className='ArticleBlock' onClick={this.articleDetail.bind(this, data.id)}>
        <View className='pic-view'>
          <Image src={data.thumb} className='img' />
          {/* <View className='top-view'>
            <Image src={star} className='star' />
            <Text className='top3'>TOP1</Text>
          </View> */}
        </View>
        <View className='title'>{data.title}</View>
        <View className='info-view'>
          <Image src={data.userheader} className='thumb' />
          <View className='name'>{data.username}</View>
          <View className='like-view'>
            <Image className='heart' src={heart} />
            <Text>{data.like}</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default ArticleBlock;
