import Taro, { Component } from '@tarojs/taro'
import { AtLoadMore, AtSearchBar } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Navbar from '../../components/navbar'
import Menu from '../../components/menu'
import Like from '../../components/like'
import FilterMask from './filterMask'
import Request from '../../utils/request';
import { api } from '../../utils/api';
import upIcon from '../../images/up.png';
import upNoIcon from '../../images/up_no.png';
import downIcon from '../../images/down.png';
import downNoIcon from '../../images/down_no.png';
import cartIcon from '../../images/car.png';
import none_icon from '../../images/search_icon.png'
import './index.less'
import shoukong from '../../images/null.png'

class SearchList extends Component {
  config = {
    navigationBarTitleText: '搜索'
  }
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      keywords: '',
      select: 1, //选择的类型 1为综合 2为销量 3为价格
      by: 'asc', //价格排序 1 为asc 2为desc
      showFilterMask: false,
      order: '',
      minprice: '', //最小价格
      maxprice: '', //最大价格
      brand_list: [],
      cate_list: [],
      brand: [], //选择的品牌id集合
      cate: [],//选择的分类id集合
      keywordsTips: '', //搜索词
      loadStatus: 'more'
    }
    this.page = 1; //页码
  }
  componentWillMount() {
    this.setState({
      keywords: this.$router.params.keywords,
      cate: this.state.cate.concat(this.$router.params.limitgoodcateids || [])
    }, () => {
      this.getList()
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getList() {
    Taro.showLoading({
      title: '正在加载'
    })
    this.page = 1;
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.search, {
        keywords: this.state.keywords,
        page: this.page,
        order: this.state.order,
        by: this.state.by,
        minprice: this.state.minprice,
        maxprice: this.state.maxprice,
        cate: JSON.stringify(this.state.cate),
        brand: JSON.stringify(this.state.brand)
      }).then(
        res => {
          Taro.hideLoading()
          const result = res.data
          if (result.code == 0) {
            this.page++;
            this.setState({
              list: result.data.list,
              cate_list: result.data.cate_list,
              brand_list: result.data.brand_list,
              priceMin: result.data.priceMin,
              priceMax: result.data.priceMax,
              loadStatus: 'more',
            })
            if (result.data.list.length == result.data.total) {
              this.setState({
                loadStatus: 'noMore',
                keywordsTips: this.state.keywords
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
  goodsDetail(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }

  changeType(current, type) {
    if (current === this.state.select && current !== 3) {
      return
    }
    this.setState({
      select: current,
      by: (this.state.by === 'asc' && current === 3) ? 'desc' : 'asc',
      order: type
    }, () => {
      this.getList()
    })
  }
  onShowFilterMask = () => {
    this.setState({
      showFilterMask: !this.state.showFilterMask
    })
  }
  getMoreList() {
    if (this.state.loadStatus != 'more') {
      return false;
    }
    this.setState({
      loadStatus: 'loading'
    }, () => {
      Request.post(api.search, {
        keywords: this.state.keywords,
        page: this.page,
        order: this.state.order,
        by: this.state.by,
        minprice: this.state.minprice,
        maxprice: this.state.maxprice,
        cate: JSON.stringify(this.state.cate),
        brand: JSON.stringify(this.state.brand)
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
  keywordsOnChange(keywords) {
    this.setState({
      keywords: keywords
    })
  }
  onActionClick() {
    if (!this.state.keywords) {
      Taro.showToast({
        title: '请输入关键字',
        icon: 'none',
        mask: true
      })
      return
    }
    this.setState({
      select: 1, //选择的类型 1为综合 2为销量 3为价格
      by: 'asc', //价格排序 1 为asc 2为desc
      showFilterMask: false,
      minprice: '',
      maxprice: '',
      cate: [],
      brand: []
    }, () => {
      this.getList()
    })
  }
  onConfirmSelect(data) {
    this.setState({
      minprice: data.priceMin || '',
      maxprice: data.priceMax || '',
      cate: data.cate,
      brand: data.brand
    }, () => {
      this.getList()
    })
  }
  render() {
    const {
      list,
      select,
      by,
      showFilterMask,
      loadStatus,
      keywords
    } = this.state

    return (
      <View className='searchListWrap'>
        <Menu />
        <Navbar bgColor='#1E3468' />
        {/* 搜索栏 */}
        <View className='search_bar'>
          <AtSearchBar
            value={keywords}
            onChange={this.keywordsOnChange.bind(this)}
            placeholder='最新时尚搭配'
            onActionClick={this.onActionClick.bind(this)}
          />
        </View>
        <View className='navbar'>
          <View className='nav'>
            <Text className={select === 1 ? 'active' : ''} onClick={this.changeType.bind(this, 1, '')}>综合</Text>
          </View>
          <View className='nav'>
            <Text className={select === 2 ? 'active' : ''} onClick={this.changeType.bind(this, 2, 'sales')}>销量</Text>
          </View>
          <View className='nav'>
            <Text className={select === 3 ? 'active' : ''} onClick={this.changeType.bind(this, 3, 'marketprice')}>价格</Text>
            <View className='select'>
              <Image src={by === 'asc' ? upIcon : upNoIcon} className='s_icon' />
              <Image src={by === 'desc' ? downIcon : downNoIcon} className='s_icon' />
            </View>
          </View>
          <View className='nav'>
            <Text onClick={this.onShowFilterMask.bind(this)}>筛选</Text>
          </View>
        </View>
        <ScrollView
          className='goods-list'
          scrollY
          scrollWithAnimation
          onScrollToLower={this.getMoreList.bind(this)}
        >
          {
            list.length > 0
              ? <block>
                {
                  list.map((item) => {
                    return (
                      <View
                        className='list'
                        key={item.id}
                        onClick={this.goodsDetail.bind(this, item.id)}
                      >
                        <View className='cover'>
                          <Image src={item.thumb} className='goods-pic' mode="widthFix"></Image>
                        </View>
                        <View   className="guding">
                      <Image src={shoukong}  className={item.total==0? 'xianshi' : 'yingchang'} />
                      </View>
                        <View className='desc'>{item.title}</View>
                        <View className='bottom'>
                          <View className='price-view'>
                            <View className='xian'>￥{item.marketprice}</View>
                            {/* <View className='yuan'>￥{item.productprice}</View> */}
                          </View>
                     
                          
                        </View>
                      </View>
                    )
                  })
                }
                <AtLoadMore status={loadStatus} moreText='上拉查看更多' />
              </block>
              : <View className='none_goods'>
                <Image src={none_icon} className='none_icon' />
                <View className='no_view'>
                  <Text>未找到“</Text>
                  < Text className='none_txt'>{this.state.keywordsTips}</Text>
                  <Text>”相关商品，别着急，下面有你喜欢的哦</Text>
                </View>
                <Like />
              </View>
          }
        </ScrollView>
        <FilterMask
          showFilterMask={showFilterMask}
          onShowFilterMask={this.onShowFilterMask}
          onConfirmSelect={this.onConfirmSelect.bind(this)}
          brandList={this.state.brand_list}
          cateList={this.state.cate_list}
          priceMin={this.state.priceMin}
          priceMax={this.state.priceMax}
        />
      </View>
    )
  }
}

export default SearchList; 