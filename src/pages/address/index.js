import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Image } from '@tarojs/components'
import * as actionCreators from './store/actionCreators';
import Request from '../../utils/request';
import { api } from '../../utils/api';
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'

import delIcon from '../../images/del-icon.png';
import editIcon from '../../images/edit.png';
import default1 from '../../images/default1.png';
import default2 from '../../images/default2.png';
import './index.less'

class Address extends Component {

  config = {
    navigationBarTitleText: '收货地址'
  }
  constructor() {
    super(...arguments)
    this.state = {
      status: ''
    }
  }

  componentWillMount() {
    this.setState({
      status: this.$router.params.status
    })
  }

  componentDidShow() {
    this.props.getAddressList();
  }

  setDefaultAddress(id) {
    Request.post(api.defaultAddress, {
      id: id
    }).then(
      res => {
        const result = res.data
        if (result.code == 0) {
          Taro.showToast({
            title: '设置成功',
            icon: 'none',
            mask: true
          })
          this.props.getAddressList();
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
  showModal(id) {
    Taro.showModal({
      title: '提示',
      content: '确认删除吗?',
    })
      .then(res => {
        if (res.confirm) {
          this.delAddress(id)
        }
      })
  }
  delAddress(id) {
    Request.post(api.delAddress, {
      id: id
    }).then(
      res => {
        const result = res.data
        if (result.code == 0) {
          Taro.showToast({
            title: '删除成功',
            icon: 'none',
            mask: true
          })
          this.props.getAddressList();
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

  editAddress(id) {
    Taro.navigateTo({
      url: `/pages/editAddress/index?id=${id}`
    })
  }
  handleAddress(id) {
    if (this.state.status == 'order') {
      this.props.choiceAddress(id)
    }
  }
  render() {
    const { addressList } = this.props
    return (
      <View className='addressWrap'>
        <Navbar />
        <Menu />
        {
          addressList.map((item) => {
            return (
              <View className='list' key={item.id}>
                <View onClick={this.handleAddress.bind(this, item.id)}>
                  <View className='name-view'>
                    <Text>{item.realname}</Text>
                    <Text>{item.mobile}</Text>
                  </View>
                  <View className='address'>{item.province}{item.city}{item.area}{item.address}</View>
                </View>
                <View className='bottom'>
                  <View className='default-address' onClick={this.setDefaultAddress.bind(this, item.id)}>
                    {
                      (item.isdefault == 0) &&
                      <Image src={default1} className='default-icon' ></Image>
                    }
                    {
                      (item.isdefault == 1) &&
                      <Image src={default2} className='default-icon' ></Image>
                    }
                    <Text>设为默认</Text>
                  </View>
                  <View className='del-address'>
                    <View className='block' style='margin-right:15px' onClick={this.editAddress.bind(this, item.id)}>
                      <Image src={editIcon} className='edit-icon'></Image>
                      <Text style='margin-left:10px'>编辑</Text>
                    </View>
                    <View className='block' onClick={this.showModal.bind(this, item.id)}>
                      <Image src={delIcon} className='del-icon'></Image>
                      <Text style='margin-left:10px'>删除</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        }
        <View className='add' onClick={this.editAddress.bind(this, '')}>添加新地址</View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    addressList: state.address.addressList
  }
}

const mapDispatchToProps = (dispatch) => ({
  getAddressList() {
    dispatch(actionCreators.getAddressList());
  },
  choiceAddress(id) {
    dispatch(actionCreators.choiceAddress(id));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(Address); 
