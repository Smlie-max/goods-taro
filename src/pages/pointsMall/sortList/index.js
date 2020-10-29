import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';
import CardList from '../component/cardList/cardList';
import TitleText from '../component/titleText/index';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';


class SortList extends Component {
  config = {
    navigationBarTitleText: '积分商城',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super(...arguments)
    this.state = {
      showList: [],
      type_list: [],
      id: "1",
      index: 0,
      nomore: false,
    }
  }

  // 读取路由参数
  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }

  componentDidMount() {
    this.getData(this.$router.params.id)
  }
  // 更新请求id
  changeId(id) {
    this.setState({
      id: id,
      index: 0,
      showList: [],
      nomore: false
    }, this.getData.bind(this, id))
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
  }

  getData(id) {
    const that = this;
    const nomore = this.state.nomore
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
    // 读取当前index 
    let index = this.state.index;
    index++;
    this.setState({
      index: index
    })
    Request.post(api.creditShopList, {
      cate: id,
      page: index
    }).then(
      res => {
        // 先判断是否要清空
        let newList = that.state.showList;
        // 取出请求回来的数组
        const info = res.data.data.list;
        if (info.length <= 0) {
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
        } else {
          for (let i in info) {
            newList.push(info[i])
          }
        }
        Taro.hideLoading();
        that.setState({
          showList: newList,
          type_list: res.data.data.cate_list
        })
      }
    )
  }

  render() {
    const { type_list, showList, id } = this.state

    return <View className="sortlist">
      <Navbar bgColor='#253C6D' />
      <View className="header-contant">
        {
          type_list.map((item, index) => {
            return (
              <View className="header-item" key="i" onClick={this.changeId.bind(this, item.id)}>
                <TitleText title={item.name} color="rgba(30,52,104,1);" type="false" ></TitleText>
              </View>
            )
          })
        }
      </View>
      <View className="line-contant">
        {
          type_list.map((item, index) => {
            return (
              <View className='item-contant' key={index}>
                {
                  id === item.id && <View className='item'></View>
                }
              </View>
            )
          })
        }
      </View>
      <ScrollView scrollY className="list-contant" onScrollToLower={this.getData.bind(this, id)}>
        {
          showList.map((item, index) => {
            let money = item.money;
            let credit = item.credit;
            let show = ""
            if (money > 0 && credit > 0) {
              show = "￥" + money + " + " + credit + "积分";
            } else {
              if (money > 0) {
                show = "￥" + money;
              }
              if (credit > 0) {
                show = credit + "积分";
              }
            }
            return <CardList key='two' imgSrc={item.thumb} goodsId={item.id} title={item.title} show={show}></CardList>
          })
        }
      </ScrollView>
    </View>
  }
}

export default SortList;
