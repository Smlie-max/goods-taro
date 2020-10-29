import Taro, { Component } from '@tarojs/taro'

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Menu from '../../components/menu'
import Navbar from '../../components/navbar'
import Like from '../../components/like'
import { AtLoadMore } from 'taro-ui'
import Request from '../../utils/request';
import { api } from '../../utils/api';

import carIcon from '../../images/car.png'
import defaultIcon1 from '../../images/default1.png'
import defaultIcon2 from '../../images/default2.png'
import './index.less'

class MyFollow extends Component {

  config = {
    navigationBarTitleText: '我的关注'
  }
  constructor() {
    super(...arguments)
    this.state = {
      data: [],
      page: 1,
      loadStatus: 'loading',
      edit: false, // 编辑模式
      allSelect: false, //全选
      current: 0, //类型 0--商品 1--品牌 默认0
      ready: false
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this.setState({
      data: [],
      page: 1,
      loadStatus: 'loading',
      ready: false
    }, () => {
      this.loadList()
    })
  }

  componentDidHide() { }

  goToIndex() {
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }
  loadList() {
    Request.post(api.followList, {
      page: this.state.page,
      type: this.state.current
    }).then(
      res => {
        this.setState({
          ready: true
        })
        const result = res.data
        const list = result.data.list
        if (result.code === 0) {
          if (list.length === 0) {
            this.setState({
              loadStatus: 'noMore'
            })
            return;
          }
          this.setState({
            data: this.state.data.concat(list),
            loadStatus: 'loading',
          })
          if (list.length === parseInt(result.data.total)) {
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
  }
  loadMore = () => {
    if (this.state.loadStatus == 'noMore') {
      return
    }
    this.setState({
      page: this.state.page + 1,
      loadStatus: 'loading'
    }, () => {
      this.loadList()
    })
  }
  //编辑
  edit() {
    this.setState({
      edit: !this.state.edit
    })
  }
  //选择
  selectRow(id) {
    let data = this.state.data
    data.map((item) => {
      if (item.id === id) {
        item.selected = !item.selected
      }
    })
    this.setState({
      data: data
    }, () => {
      let selectLength = 0
      this.state.data.map((item) => {
        if (item.selected) {
          selectLength = selectLength + 1
        }
      })
      if (selectLength === this.state.data.length) {
        this.setState({
          allSelect: true
        })
      } else {
        this.setState({
          allSelect: false
        })
      }
    })
  }
  //全选
  allSelect() {
    const data = this.state.data
    const allSelect = this.state.allSelect
    if (allSelect) {
      data.map((item) => {
        item.selected = false
      })
      this.setState({
        allSelect: false,
        data: data
      })
    } else {
      data.map((item) => {
        item.selected = true
      })
      this.setState({
        allSelect: true,
        data: data
      })
    }
  }
  //取消关注
  cancelFollow() {
    const followList = this.state.data
    let cancelArr = []
    followList.map((item) => {
      if (item.selected) {
        cancelArr.push(item.id)
      }
    })
    if (cancelArr.length === 0) {
      Taro.showToast({
        title: '请选择',
        icon: 'none',
        mask: true
      })
      return
    }
    Request.post(api.cancelMyFollow, {
      ids: JSON.stringify(cancelArr)
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          Taro.showToast({
            title: '取消成功',
            icon: 'none'
          })
          this.setState({
            data: [],
            page: 1,
            loadStatus: 'loading',
            edit: false, // 编辑模式
            allSelect: false, //全选
          }, () => {
            this.loadList()
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
  }
  changeTab(current) {
    if (current === this.state.current) return
    this.setState({
      current: current,
      data: [],
      page: 1,
      loadStatus: 'loading',
      ready: false
    }, () => {
      this.loadList()
    })
  }
  //查看详情
  lookDetail(id) {
    if (this.state.current === 0) {
      Taro.navigateTo({
        url: '/pages/goodsDetail/index?id=' + id
      })
    } else {
      Taro.navigateTo({
        url: '/pages/brandDetail/index?id=' + id
      })
    }
  }
  render() {
    const { data, edit, allSelect, current, ready, loadStatus } = this.state
    return (
      <View className='MyFollow'>
        <Navbar bgColor='#1E3468' />
        <Menu />
        <View className='top-navbar'>
          <View className='tab'>
            <View className={current === 0 ? 'bar active' : 'bar'} onClick={this.changeTab.bind(this, 0)}>商品</View>
          </View>
          <View className='tab'>
            <View className={current === 1 ? 'bar active' : 'bar'} onClick={this.changeTab.bind(this, 1)}>品牌</View>
          </View>
        </View>
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.loadMore}>
          {
            data.length > 0 &&
            <View className='follow-list'>
              <View className='edit' onClick={this.edit.bind(this)}>{edit ? '完成' : '编辑'}</View>
              {
                data.map((item) => {
                  return (
                    <View
                      className='list'
                      key={item.id}
                    >
                      {
                        edit &&
                        <View>
                          {
                            item.selected
                              ? <Image src={defaultIcon2} className='defaultIcon' onClick={this.selectRow.bind(this, item.id)} />
                              : <Image src={defaultIcon1} className='defaultIcon' onClick={this.selectRow.bind(this, item.id)} />
                          }
                        </View>
                      }
                      <Image src={item.thumb} className='goods-pic' onClick={this.lookDetail.bind(this, item.goodsid)} />
                      <View className='right' onClick={this.lookDetail.bind(this, item.goodsid)} >
                        <View className='top'>
                          <Text className='desc'>{item.title}</Text>
                          <View className='store'>
                            <Text>{item.merchname}</Text>
                          </View>
                        </View>
                        {
                          current === 0 &&
                          <View className='bottom'>
                            <Text>￥{item.marketprice}</Text>
                            <Image src={carIcon} className='cart-icon' />
                          </View>
                        }
                      </View>
                    </View>
                  )
                })
              }
              <AtLoadMore
                status={loadStatus}
                moreText='上拉加载更多'
              />
            </View>
          }
          {
            (data.length === 0 && ready) &&
            <View className='empty'>
              <View>你还没有关注，现在去逛逛~</View>
              <View className='go' onClick={this.goToIndex.bind(this)}>去逛逛~</View>
              <Like />
            </View>
          }
          {
            edit &&
            <View className='bottomBar'>
              <View className='left' onClick={this.allSelect.bind(this)}>
                {allSelect
                  ? <Image src={defaultIcon2} className='defaultIcon' onClick={this.selectRow.bind(this)} />
                  : <Image src={defaultIcon1} className='defaultIcon' onClick={this.selectRow.bind(this)} />
                }
                <Text>全选</Text>
              </View>
              <View className='btn' onClick={this.cancelFollow.bind(this)}>取消关注</View>
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

export default MyFollow; 