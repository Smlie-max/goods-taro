import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import collect1 from '../../images/collect1.png';
import collect2 from '../../images/collect2.png';
import ParseComponent from '../../components/wxParse'
import Recommend from '../../components/recommend';
import line from '../../images/title-line.png'

import './index.less'

class discoverArtDetail extends Component {
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments)
    this.state = {
      articleDetail: {},
      article: '',
      id: '',
      is_like: 0,
      like: 0,
      goodsList: []
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
    Request.post(api.articleDetail, {
      id: this.$router.params.id
    }).then(
      res => {
        Taro.hideLoading();
        const result = res.data;
        if (result.code === 0) {
          this.setState({
            articleDetail: result.data.info,
            article: result.data.info.content,
            is_like: result.data.info.is_like,
            like: result.data.info.like,
            goodsList: result.data.goods_list
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

  //点赞
  articleLike() {
    Request.post(api.articleLike, {
      id: this.state.id
    }).then(
      res => {
        const result = res.data;
        if (result.code === 0) {
          let is_like = this.state.is_like
          let like = this.state.like
          is_like = !is_like
          like = is_like ? like + 1 : like - 1
          this.setState({
            is_like: is_like,
            like: like
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
    const { articleDetail, article, is_like, like, goodsList } = this.state
    return (
      <View className='discoverArtDetail'>
        <Navbar />
        <Menu />
        {
          article
            ? <block>
              <View className='art-title'>{articleDetail.title}</View>
              <View className='art-time'>{articleDetail.art_date}</View>
              <View className='art-content'>
                {
                  (process.env.TARO_ENV === 'weapp' && article)
                    ? <ParseComponent parseData={article} />
                    : ''
                }
                {
                  (process.env.TARO_ENV === 'h5' && article)
                    ? <View dangerouslySetInnerHTML={{ __html: article }} />
                    : ''
                }
                <View className='like-view'>
                  <Image src={is_like ? collect2 : collect1} className='icon' onClick={this.articleLike.bind(this)} />
                  <Text>{like}</Text>
                </View>
              </View>
              {
                goodsList.length > 0 &&
                < View className='goods-recommend'>
                  <View className='title-block'>
                    <View className='en-title'>RECOMMEND</View>
                    <View className='cn-title'>
                      <Image className='line' src={line} />
                      <Text>相关商品</Text>
                    </View>
                  </View>
                  <Recommend list={goodsList} />
                </View>
              }
            </block>
            : ('')
        }
      </View>
    )
  }
}

export default discoverArtDetail;
