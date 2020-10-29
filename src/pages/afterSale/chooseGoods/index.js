import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Navbar from '../../../components/navbar';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import Loading from '../../../components/loading';
import default1 from '../../../images/default1.png'
import default2 from '../../../images/default2.png'
import './index.less'

class ChooseGoods extends Component {
  config = {
    navigationBarTitleText: '选择售后商品'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      selectAll: false,
      loadingShow: true
    }
  }
  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    })
    Request.post(api.refundGoodsList, {
      id: this.$router.params.id
    }).then(
      res => {
        this.setState({
          loadingShow: false
        })
        Taro.hideLoading()
        const result = res.data
        if (result.code === 0) {
          this.setState({
            list: result.data
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

  selectItem(id) {
    let list = this.state.list
    let len = 0
    let listLen = list.length
    list.map((item) => {
      if (item.id == id) {
        item.selected = !item.selected
      }
      if (item.selected) {
        len = len + 1
      }
    })
    this.setState({
      list: list,
      selectAll: len == listLen ? true : false
    })
  }
  selectAllItem() {
    let list = this.state.list
    list.map((item) => {
      item.selected = this.state.selectAll ? false : true
    })
    this.setState({
      list: list,
      selectAll: !this.state.selectAll
    })
  }

  nextStep() {
    let list = this.state.list
    let ids = []
    list.map((item) => {
      if (item.selected) {
        ids.push(item.id)
      }
    })
    if (ids.length == 0) {
      Taro.showToast({
        title: "至少选择一个商品",
        icon: 'none'
      })
      return
    }
    Taro.redirectTo({
      url: `/pages/afterSale/formData/index?ids=${JSON.stringify(ids)}&id=${this.$router.params.id}`
    })
  }
  render() {
    const { list, selectAll } = this.state
    return (
      <View className='ChooseGoods'>
        <Navbar />
        <Loading show={this.state.loadingShow} title='加载中' />
        <View className='title_view'>
          <View className='title'>选择需要售后的商品</View>
          {
            selectAll
              ? <Image src={default2} className='icon' onClick={this.selectAllItem.bind(this)} />
              : <Image src={default1} className='icon' onClick={this.selectAllItem.bind(this)} />
          }
        </View>
        {
          list.map((item) => {
            return (
              <View className='list' key={item.id} onClick={this.selectItem.bind(this, item.id)}>
                <Image src={item.thumb} className='goods_pic' />
                <View className='goods_info'>
                  <View className='goods_name'>{item.title}</View>
                  <View className='goods_price'>￥{item.price}</View>
                  <View className='goods_options'>{item.optionname}</View>
                </View>
                {
                  item.selected
                    ? <Image src={default2} className='icon' />
                    : <Image src={default1} className='icon' />
                }
              </View>
            )
          })
        }
        <View className='next' onClick={this.nextStep.bind(this)}>下一步</View>
      </View>
    )
  }
}

export default ChooseGoods; 
