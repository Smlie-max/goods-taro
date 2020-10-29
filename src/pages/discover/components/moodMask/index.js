import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'
import Request from '../../../../utils/request';
import { api } from '../../../../utils/api';
import close from '../../images/close.png'
import maskBg from '../../images/mood-mask-bg.jpg'
import './index.less'

class MoodMask extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      id: '',
      title: '',
      tagList: [],
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Request.post(api.moodList, {}).then(
      res => {
        const result = res.data;
        if (result.code === 0) {
          const newArr = this.sliceArr(result.data.list, 5)
          this.setState({
            tagList: newArr
            // tagList: result.data.list
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

  tagClick(id) {
    const tagList = this.state.tagList
    tagList.map((item) => {
      item.map((list) => {
        list.active = false
        if (list.id === id) {
          list.active = !list.active
          this.setState({
            id: list.id
          })
        }
      })
    })
    this.setState({
      tagList: tagList
    })
  }
  chooseMood() {
    Request.post(api.chooseMood, {
      id: this.state.id
    }).then(
      res => {
        const result = res.data;
        if (result.code === 0) {
          this.props.onCloseMoodMask()
          Taro.navigateTo({
            url: `/pages/discover/mood/index?id=${this.state.id}`
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
  //心情数组处理
  sliceArr(array, row) {
    const length = array.length
    let arr = array
    if (!length) {
      return []
    }
    let resIndex = 0
    let result = []
    let size = Math.ceil(length / row)
    while (resIndex < row) {
      result[resIndex] = arr.splice(0, size)
      resIndex = resIndex + 1
    }
    return result
  }
  render() {
    const { tagList } = this.state
    return (
      <View>
        <View className='MoodMask'>
          <View className='mood-main'>
            <Image src={maskBg} className='maskBg' mode='widthFix' />
            <View className='cn-title'>选择你的心情</View>
            <View className='en-title'>CHOOSE YOUR MOOD</View>
            <View className='mood-scrollview'>
              {
                tagList.length === 0 && <AtActivityIndicator mode='center' />
              }
              {
                tagList.map((item) => {
                  return (
                    <View className='list'>
                      {
                        item.map((list) => {
                          return (
                            <View
                              className={list.active ? 'tag active' : 'tag'}
                              key={list.id}
                              onClick={this.tagClick.bind(this, list.id)}
                            >
                              {list.title}
                            </View>
                          )
                        })
                      }
                    </View>
                  )
                })
              }
            </View>
            <View className='submit' onClick={this.chooseMood.bind(this)}>确定</View>
          </View>
          <Image src={close} className='close' onClick={this.props.onCloseMoodMask} />
        </View>
      </View>
    )
  }
}

export default MoodMask;
