import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView, Input } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';


import wechat from '../images/wechat.png'
import arrow from '../images/arrow.png'
import Tabs from '../component/tabs';
import Empty from '../../../components/empty';

class MyTeam extends Component {
  config = {
    navigationBarTitleText: '我的团队',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white',
  }

  constructor() {
    super(...arguments)
    this.state = {
      showList: [],
      type_list: [],
      typeId: "1",
      index: 1,
      nomore: false,
      total: 0
    }
  }

  componentDidMount() {
    const that = this;
    Request.post(api.distributionMyTeam, {}).then(
      res => {
        let type_list = res.data.data
        for (let i in type_list) {
          type_list[i].check = "false"
        }
        type_list[0].check = "true"
        //数据预处理 
        that.setState({
          type_list: type_list,
          typeId: type_list[0].id
        })
        that.update(type_list[0].id)
      }
    )
  }

  changeID(id) {
    let type_list = this.state.type_list;
    for (let i in type_list) {
      type_list[i].check = "false"
    }
    type_list[id].check = "true"
    this.setState({
      typeId: type_list[id].id,
      type_list: type_list,
      showList: []
    }, this.update.bind(this))

  }

  update() {
    const that = this;
    const nomore = this.state.nomore;
    let typeId = this.state.typeId;
    // 获取当前需要请求的页数
    let index = this.state.index;
    // 获取当前展示数组
    let showList = this.state.showList;
    // 如果没有更多的数据停止
    if (nomore) {
      Taro.showToast({
        title: '没有更多的数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    Request.post(api.distributionTeamList, { typeid: typeId, page: index }).then(
      res => {
        let info = res.data.data;
        // 请求成功之后页数加一
        index++;
        if (info.list.length > 0) {
          // 拼接数组
          showList = showList.concat(info.list);
        } else {
          // 没有更多数据了
          Taro.showToast({
            title: '没有更多的数据了',
            icon: 'none',
            duration: 2000
          })
          // 拒绝再次请求
          that.setState({
            nomore: true
          })
          return
        }
        Taro.hideLoading();
        that.setState({
          total: info.total,
          showList: showList,
          page: index
        })
      })
  }

  render() {
    const { type_list, showList, total } = this.state
    return <View className="main" >
      <Navbar bgColor='#253C6D' />
      <Tabs titleArry={type_list} onchange={this.changeID.bind(this)}></Tabs>
      <View className="total-contant">
        <View className='total'>
          共 {total} 名推客
        </View>
      </View>
      <ScrollView className='menu-contant' scrollY onScrollToLower={this.update.bind(this)}>
        {
          showList.map((item, index) => {
            return <View className='item' key={item}>
              <View className='row'>
                <View className='title-contant'>
                  <View className='name'>{item.username}</View>
                  <View className='time-contant'>
                    <View className='title'>加入时间</View>
                    <View className='value'>{item.aagenttime}</View>
                  </View>
                </View>
                <View className='avatar' >
                  <Image src={item.thumb} className='img'></Image>
                </View>
                <View className='level-contant'>{item.levelname}</View>
              </View>
              <View className="bottom-row">
                <View className='lattice'>
                  <View className='title'>推广</View>
                  <View className='value'>{item.gener_people}</View>
                </View>
                <View className='lattice'>
                  <View className='title'>订单</View>
                  <View className='value'>{item.total_order}</View>
                </View>
                <View className='consumption'>
                  <View className='title'>消费（¥）</View>
                  <View className='value'>{item.abonus}</View>
                </View>
              </View>
            </View>
          })
        }
        {
          showList.length <= 0 && <Empty title="没有数据"></Empty>
        }
      </ScrollView>
    </View>
  }
}

export default MyTeam;
