import { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import heart from '../../../images/collect2.png'

import './index.less'

class ArticleGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }
  render() {
    const { list } = this.props
    return (
      <View className='ArticleGroups'>
        {
          list.map((item) => {
            return (
              <View
                className='ArticleBlock'
                onClick={this.articleDetail.bind(this, item.id)}
                key={item.id}
              >
                <View className='pic-view'>
                  <Image src={item.cover} className='img' lazyLoad/>
                </View>
                <View className='title'>{item.title}</View>
                <View className='info-view'>
                  <Image src={item.thumb} className='thumb' lazyLoad/>
                  <View className='name'>{item.username}</View>
                  <View className='like-view'>
                    <Image className='heart' src={heart} lazyLoad/>
                    <Text>{item.like}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
ArticleGroups.defaultProps = {
  list: [
    {
      id: 1,
      thumb: 'https://jdc.jd.com/img/80',
      title: '哈哈哈哈哈哈',
      username: '菜鸡',
      like: 20,
      cover:'http://jdc.jd.com/img/200'
    },
    {
      id: 2,
      thumb: 'https://jdc.jd.com/img/80',
      title: '哈哈哈哈哈哈',
      username: '菜鸡',
      like: 20,
      cover:'http://jdc.jd.com/img/200'
    },
    {
      id: 3,
      thumb: 'https://jdc.jd.com/img/80',
      title: '哈哈哈哈哈哈',
      username: '菜鸡',
      like: 20,
      cover:'http://jdc.jd.com/img/200'
    },
    {
      id: 4,
      thumb: 'https://jdc.jd.com/img/80',
      title: '哈哈哈哈哈哈',
      username: '菜鸡',
      like: 20,
      cover:'http://jdc.jd.com/img/200'
    },
  ]
}

export default ArticleGroups;
