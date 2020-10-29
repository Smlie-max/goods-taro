import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import * as actionCreators from './store/actionCreators';
import line from '../../images/title-line.png'
import './index.less'
import shoukong from '../../images/null.png'

@connect(({ like }) => ({
  likeList:like.likeList
}), (dispatch) => ({
  changeLikelistData() {
    dispatch(actionCreators.getLikeList())
  }
}))

class Like extends Component {

  componentWillMount() { }

  componentDidMount() {
    const likeList = this.props.likeList
    if (likeList.length === 0) {
      this.props.changeLikelistData();
    }
  }

  goodsDetail(id) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}`
    })
  }

  render() {
    const { likeList } = this.props
    return (
      <View>
        {
         likeList.length > 0 &&
          <View className='likeWrap'>
            <View className='title-block'>
              <View className='en-title'>YOU MAY ALSO LIKE</View>
              <View className='cn-title'>
                <Image className='line' src={line} />
                <Text>猜你喜欢</Text>
              </View>
            </View>
            <View className='like-list'>
              {
                likeList.map((item) => {
                  return (
                    <View className="bbb">
                    <View
                      className='like-item-block'
                      key={item.id}
                      onClick={this.goodsDetail.bind(this, item.id)}
                    >
                      <Image src={item.thumb} className='goods-pic-block' />
                      <View   className="guding">
                      <Image src={shoukong}  className={item.total==0? 'xianshi' : 'yingchang'} />
                      </View>
                      <View className='goods-name-block'>{item.title}</View>
                      <View className='goods-price-block'>￥{item.marketprice}</View>
                    </View>
                    </View> 
                  )
                })
              }
            </View>
          </View>
        }
      </View>
    )
  }
}

export default Like 