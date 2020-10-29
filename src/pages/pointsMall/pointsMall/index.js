import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';
import Menu from '../../../components/menu';
import CardList from '../component/cardList/cardList';
import TitleText from '../component/titleText/index';

// 图片引用
import banner from '../images/banner.png';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';



class PointsMall extends Component {
  config = {
    navigationBarTitleText: '积分商城',
    navigationBarBackgroundColor: '#253C6D',
    navigationBarTextStyle: 'white'
  }
  constructor() {
    super(...arguments)
    this.state = {
      info: {},
      listOne: [],
      listTwo: [],
      indexTwo: 1,
      avtar: ""
    }
  }
  componentWillMount() { }

  componentDidMount() {
    const that = this;
    // 请求参数,客户参数
    Request.post(api.pointsMall, {}).then(
      res => {
        const info = res.data.data;
        that.setState({
          info: info
        })

      }
    )
    // 获取上边框
    that.getData('listOne', "1", 1);
    // 获取下边框
    that.getData('listTwo', "2", 1);
    // 读取头像
    const data = Taro.getStorageSync('userInfo')
    console.log(data)
    this.setState({
      avtar: data.avatarUrl
    })
  }

  getData(name, id, page) {
    const that = this;
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    Request.post(api.creditShopList, {
      cate: id,
      page: page
    }).then(
      res => {
        Taro.hideLoading();
        that.setState({
          [name]: res.data.data.list
        })
      }
    )
  }

  // 跳转
  jumpToDetail(id) {
    Taro.navigateTo({
      url: `/pages/pointsMall/productDetail/index?id=${id}`
    })
  }

  // 跳转到积分明细
  jumpToPointIntegral() {
    Taro.navigateTo({
      url: `/pages/pointsMall/pointIntegral/index`
    })
  }

  // 订单明细
  jumpToOrderIntegral() {
    Taro.navigateTo({
      url: `/pages/pointsMall/orderIntegral/index`
    })
  }

  // 跳转到sortlsit
  getMoreSortlsit(id) {
    Taro.navigateTo({
      url: `/pages/pointsMall/sortList/index?id=${id}`
    })
  }

  //点击测试
  loadmore() {
    let index = this.state.indexTwo;
    index++;
    this.getData('listTwo', "2", index);
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { info, listOne, listTwo, avtar } = this.state;
    return (
      info.category &&
      <View className='pointsMall'>
        <Navbar bgColor='#253C6D' />
        <Menu></Menu>
        <View className="header-bgc">
          <Image src={banner} mode='widthFix' className='banner' />
          <View className="card-bgc">
            <View className="card">
              <View className="card-top">
                <View className="info-contant">
                  <View className="title-contant">
                    <TitleText title="积分商城" color="rgba(255, 255, 255, 1);" type="true" />
                  </View>
                  <View className="number-contant">
                    {info.credit}
                  </View>
                </View>
                <View className="avtar-contant">
                  <Image className='avtar' src={avtar}></Image>
                </View>
              </View>
              <View className="card-button">
                <View className="button-item" onClick={this.jumpToPointIntegral.bind(this)}>积分明细</View>
                <View className="button-item" onClick={this.jumpToOrderIntegral.bind(this)}>兑换订单</View>
              </View>
            </View>
            <View className="boutique-contant">
              <TitleText title={info.category[0].name} color="rgba(255, 255, 255, 1);" type="true" />
            </View>
          </View>
          <View className="button-contant" onClick={this.getMoreSortlsit.bind(this, "1")}>
            + MORE
          </View>
        </View>
        <View className="main-contant" >
          <View className='scrollview'>
            {
              listOne.map((item, index) => {
                return (<View className='scroll-item' key='one' onClick={this.jumpToDetail.bind(this, item.id)}>
                  <Image src={item.thumb} className='scroll-item-image'></Image>
                  <View className="item-name">
                    {item.title}
                  </View>
                  <View className='money-contant'>
                    {
                      item.money > 0 ? "￥" + item.money : " "
                    }
                    {
                      item.money > 0 && item.credit > 0 ? " + " : ""
                    }
                    {
                      item.credit > 0 ? item.credit + "积分" : ""
                    }
                  </View>
                </View>)
              })
            }
          </View>
          <View className="offer">
            <View className="offer-title-contant">
              <View className="image-contant">
                <TitleText title={info.category[1].name} color="rgba(30,52,104,1);" type="false" />
              </View>
              <View className="space-contant">
              </View>
              <View className="button-contant" onClick={this.getMoreSortlsit.bind(this, "2")}>
                + MORE
              </View>
            </View>
            <View className="list-contant">
              {
                listTwo.map((item, index) => {
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
                  return <CardList key='two' imgSrc={item.thumb} title={item.title} show={show} goodsId={item.id}></CardList>
                })
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default PointsMall;
