import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView, Input } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Menu from './../../../components/menu/index';


class Detail extends Component {
  config = {
    navigationBarTitleText: '提现明细'
  }

  constructor(props) {
    super(props)
    this.state = {
      detailId: 0,
      info:{}
    }
  }

  componentWillMount(){ }

  componentDidMount() {
    const params = this.$router.params
    this.setState({
      detailId: params.id
    },()=>{
      // 获取id详情
      const id = this.state.detailId;
      const that = this;
      Request.post(api.distributionAbonusDetail, {
        id: id
      }).then(res => {
        const data = res.data.data;
        this.setState({
          info: data.info,
          order_list: data.order_list
        })
      })
    })
  }

  render() {
    const { info, order_list } = this.state
    return <View className="main">
      <Navbar bgColor='#253C6D' />
      <Menu></Menu>
      <View className='main-contant'>
        
      </View>
    </View>
  }
}

export default Detail;
