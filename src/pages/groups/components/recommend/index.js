import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import Request from '../../../../utils/request';
import { api } from '../../../../utils/api';
import recommendIcon from '../../images/recommend-title.png'
import refreshIcon from '../../images/reset.png'
import './index.less'
class GroupsRecommend extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      id: ''
    }
  }
  componentDidMount(){
    this.groupsRecommend()
  }

  //推荐凑团
  groupsRecommend() {
    Request.post(api.groupsRecommend, {
      goods_id: this.$router.params.id
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code == 0) {
          this.setState({
            list: result.data.list,
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
  //加入团
  joinTeam(teamid) {
    Taro.navigateTo({
      url: '/pages/groups/goodsDetail/index?teamid=' + teamid
    })
  }
  render() {
    const { list } = this.state
    return (
      <View className='GroupsRecommend'>
        {
          list.length > 0 &&
          <View className='recommend-view' key={item.teamid}>
            <Image className='recommendIcon' src={recommendIcon} mode='widthFix' />
            {
              list.map((item) => {
                return (
                  <View className='recommend-list' key={item.teamid}>
                    <View className='avatar-view'>
                      <Image src={item.avatar} className='thumb' />
                      <Text className='leader'>团</Text>
                    </View>
                    <View className='team-info'>
                      <View className='info-top'>{item.nickname} 还差 {item.few_count} 人成团</View>
                      <View className='time-view'>
                        <Text>剩余</Text>
                        <AtCountdown
                          format={{ hours: ':', minutes: ':', seconds: '' }}
                          hours={Number(item.last_time[0])}
                          minutes={Number(item.last_time[1])}
                          seconds={Number(item.last_time[2])}
                        />
                        <Text>结束</Text>
                      </View>
                    </View>
                    <View className='join' onClick={this.joinTeam.bind(this, item.teamid)}>加入TA</View>
                  </View>
                )
              })
            }
            <View className='refresh' onClick={this.groupsRecommend}>
              <Image src={refreshIcon} className='refreshIcon' />
              <Text>换一批</Text>
            </View>
          </View>
        }
      </View>
    )
  }
}
GroupsRecommend.defaultProps = {
}
export default GroupsRecommend;
