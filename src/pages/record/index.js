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
    navigationBarTitleText: '我的足迹'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      loadStatus: 'more',
      edit: false, // 编辑模式
      allSelect: false, //全选
    }
    this.page = 1; //页码
  }
  componentWillMount() { }

  componentDidMount() {
    this.getList()
  }

  goToIndex() {
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }

  getList() {
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.myRecord, {
        page: this.page
      }).then(
        res => {
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
      Request.post(api.myRecord, {
        page: this.page
      }).then(
        res => {
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
  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }
  //编辑
  edit() {
    this.setState({
      edit: !this.state.edit
    })
  }
  //选择
  selectRow(time, id) {
    let list = this.state.list
    list.map((item) => {
      if (item.time === time) {
        item.row.map((row) => {
          if (row.id === id) {
            row.selected = !row.selected
          }
        })
      }
    })
    this.setState({
      list: list
    }, () => {
      let selectLength = 0
      let allLength = 0
      this.state.list.map((item) => {
        item.row.map((row) => {
          allLength = allLength + 1
          if (row.selected) {
            selectLength = selectLength + 1
          }
        })
      })
      if (selectLength === allLength) {
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
    const list = this.state.list
    const allSelect = this.state.allSelect
    if (allSelect) {
      list.map((item) => {
        item.row.map((row) => {
          row.selected = false
        })
      })
      this.setState({
        allSelect: false,
        list: list
      })
    } else {
      list.map((item) => {
        item.row.map((row) => {
          row.selected = true
        })
      })
      this.setState({
        allSelect: true,
        list: list
      })
    }
  }
  //删除
  cancelFollow() {
    const list = this.state.list
    let cancelArr = []
    list.map((item) => {
      item.row.map((row) => {
        if (row.selected) {
          cancelArr.push(row.id)
        }
      })
    })
    Request.post(api.myRecordRemove, {
      ids: JSON.stringify(cancelArr)
    }).then(
      res => {
        const result = res.data
        if (result.code === 0) {
          Taro.showToast({
            title: '删除成功',
            icon: 'none'
          })
          this.setState({
            edit: false, // 编辑模式
            allSelect: false, //全选
          }, () => {
            this.getList()
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
    const { list, edit, allSelect, loadStatus } = this.state
    return (
      <View className='MyRecord'>
        <Navbar />
        {/* <Menu /> */}
        <ScrollView
          className='scrollview'
          scrollY
          onScrollToLower={this.getMoreList.bind(this)}
        >
          {
            list.length > 0 &&
            <View className='follow-list'>
              <View className='edit' onClick={this.edit.bind(this)}>{edit ? '完成' : '编辑'}</View>
              {
                list.map((item, index) => {
                  return (
                    <View
                      className='list'
                      key={item}
                    >
                      <View className='time'>{item.time}</View>
                      {
                        item.row.map((lists) => {
                          return (
                            <View className='block' key={item.id}>
                              {
                                edit &&
                                <View>
                                  {
                                    lists.selected
                                      ? <Image src={defaultIcon2} className='defaultIcon' onClick={this.selectRow.bind(this, item.time, lists.id)} />
                                      : <Image src={defaultIcon1} className='defaultIcon' onClick={this.selectRow.bind(this, item.time, lists.id)} />
                                  }
                                </View>
                              }
                              <Image src={lists.thumb} className='goods-pic' onClick={this.goodsDetail.bind(this, lists.goodsid)} />
                              <View className='right' onClick={this.goodsDetail.bind(this, lists.goodsid)}>
                                <View className='top'>
                                  <Text className='desc'>{lists.title}</Text>
                                  <View className='store'>
                                    <Text>{lists.merchname}</Text>
                                  </View>
                                </View>
                                <View className='bottom'>
                                  <Text>￥{lists.marketprice}</Text>
                                  <Image src={carIcon} className='cart-icon' />
                                </View>
                              </View>
                            </View>
                          )
                        })
                      }
                    </View>
                  )
                })
              }
            </View>
          }
          {
            !list.length > 0 &&
            <View className='empty'>
              <View>你还没有浏览过任何商品，现在去逛逛~</View>
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
              <View className='btn' onClick={this.cancelFollow.bind(this)}>删除</View>
            </View>
          }
          <AtLoadMore
            status={loadStatus}
            moreText='上拉加载更多'
          />
        </ScrollView>
      </View>
    )
  }
}

export default MyFollow; 