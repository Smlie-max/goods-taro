import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Request from '../../utils/request'
import { api } from '../../utils/api'

import './noticeDetail.less'

class NoticeDetail extends Component {

  config = {
    navigationBarTitleText: '消息详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      detail: []
    }
  }
  componentWillMount() { }

  componentDidMount() { 
    this.getDetail()
  }

  getDetail() {
    Request.post(api.noticeDetail, {
      id: this.$router.params.id
    }).then(
      res => {
        const result = res.data
        if (result.code == 0) {
          this.setState({
            detail: result.data.info
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

  render() {
    const { detail } = this.state
    return (
      <View className='noticeDetailWrap'>
        <View className='title'>{detail.title}</View>
        <View className='time'>{detail.addtime}</View>
        <View className='content'>{detail.content}</View>
      </View>
    )
  }
}

export default NoticeDetail; 