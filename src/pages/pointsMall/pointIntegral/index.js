import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'

import './index.less'
import Navbar from './../../../components/navbar/index'
import { AtLoadMore } from 'taro-ui'

import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Menu from './../../../components/menu/index';

class PointIntegral extends Component {
  config = {
    navigationBarTitleText: '积分明细',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.creditGetList, {
        page: this.page
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          if (result.code == 0) {
            this.page++;
            this.setState({
              list: result.data.list,
              loadStatus: 'more'
            })
            if (result.data.list.length == result.data.total) {
              this.setState({
                loadStatus: 'noMore'
              })
            }
          } else {
            Taro.showToast({
              title: result.msg,
              icon: 'none',
              mask: true
            })
          }
        }
      )
    })
  }
  getMoreList() {
    if (this.state.loadStatus != 'more') {
      return false;
    }
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.creditGetList, {
        page: this.page
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          if (result.code == 0) {
            if (result.data.list.length == 0) { //没有更多数据
              this.setState({
                loadStatus: 'noMore'
              })
              return;
            }
            this.page++;
            const list = this.state.list
            this.setState({
              list: list.concat(result.data.list),
              loadStatus: 'more'
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
    })
  }


  render() {
    const { list, loadStatus } = this.state
    return <View className='powerIntegral' >
      <Navbar bgColor='#253C6D'></Navbar>
      <Menu></Menu>
      <ScrollView className='scrollView' scrollY onScrollToLower={this.getMoreList.bind(this)}>
        {
          list.map((item) => {
            return <View className='card-contant' key={item}>
              {/* <Image className='img' src={item.thumb}></Image> */}
              <View className='name-contant'>
                <View className='name'>{item.title}</View>
                <View className='time'>{item.createtime}
                </View>
              </View>
              <View className='point'>{item.credit} 积分</View>
            </View>
          })
        }
        <AtLoadMore status={loadStatus} moreText='上拉查看更多' />
      </ScrollView>
    </View>
  }
}

export default PointIntegral