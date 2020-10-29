import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ParseComponent from '../../components/wxParse'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import './index.less'

class Article extends Component {
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      article: ''
    }
  }
  componentWillMount() { }

  componentDidMount(){
    this.getDetail(this.$router.params.type)
  }

  /*
    type: 1--砍价 2--拼团 10--下单协议 11--充值协议
  */
  getDetail(type) {
    Request.post(api.getRules, {
      type: type
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          this.setState({
            article: result.data.description
          })
        }
        else {
          Taro.showToast({
            title: result.msg,
            icon: 'none'
          })
        }
      }
    )
  }
  render() {
    const { article } = this.state
    return (
      <View className='articleWrap'>
        {
          (process.env.TARO_ENV === 'weapp' && article)
            ? <ParseComponent parseData={article} />
            : ''
        }
        {
          (process.env.TARO_ENV === 'h5' && article)
            ? <View className='h5Parse'>
              <View dangerouslySetInnerHTML={{ __html: article }} />
            </View>
            : ('')
        }
      </View>
    )
  }
}

export default Article; 
