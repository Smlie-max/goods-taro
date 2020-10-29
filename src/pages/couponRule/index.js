import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ParseComponent from '../../components/wxParse'

import Request from '../../utils/request';
import { api } from '../../utils/api';
import './index.less'

class CouponRule extends Component {
  config = {
    navigationBarTitleText: '活动详情'
  }
  constructor() {
    super(...arguments)
    this.state = {
      article: ''
    }
  }
  componentWillMount() { }

  componentDidMount() {
    this.getDetail()
  }

  getDetail() {
    Request.post(api.couponDescription, {}).then(
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
      <View className='CouponRule'>
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

export default CouponRule; 
