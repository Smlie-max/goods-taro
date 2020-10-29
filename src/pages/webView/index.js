import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import withShare from '../../utils/withShare'
import bindParent from '../../utils/bindParent'
import withToken from '../../utils/withToken'
import Request from '../../utils/request'
import { api } from '../../utils/api'
@withShare()
@withToken()

class WebViewPage extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      url: ''
    }
  }
  componentWillMount() {
    this.setState({
      url: this.$router.params.url
    })
  }
  componentDidMount() {
    bindParent(this.$router.params.shareFromUser) //绑定
    //分享
    Request.post(api.commonShare, {})
      .then(
        res => {
          const result = res.data.data;
          //分享
          this.$setShareTitle = () => `${result.title}`
          this.$setShareImageUrl = () => `${result.icon}`
          this.$setSharePath = () => `/pages/webView/index?url=${this.$router.params.url}`
        }
      )
  }
  render() {
    return <WebView src={this.state.url} />
  }
}

export default WebViewPage;
