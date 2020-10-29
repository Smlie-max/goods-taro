import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import close from '../../images/cha.png'

import './index.less'

class OptionLayout extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      showLayout: false,
      goodsInfo: {}, //商品详情
      goodsOptions: [], //后台返回的所有可选的规格的组合（数组）
      goodsSpecs: [], //规格数组 
      selectImg: '', //选择的规格的图片
      finlSelect: '', //选择的最终属性id数组的拼接起来的标识
      finlPrice: '', //选择规格后的单价
      final: [], //选择的最终属性id数组
      optionsTxt: '', //已选择的属性名称
      count: 1, //数量
      optionid: '', //选择的规格id
      stock: '0', //库存
      withOutOptions: false,
    }
  }
  componentWillMount() {
    this.setState({
      goodsOptions: this.props.optionsData || [],
      goodsSpecs: this.props.specsData || [],
      goodsInfo: this.props.goodsInfo || {},
      withOutOptions: this.props.withOutOptions || false,
      stock: this.props.goodsInfo.total || 0
    })
  }
  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   goodsOptions: nextProps.optionsData || [],
    //   goodsSpecs: nextProps.specsData || [],
    //   goodsInfo: nextProps.goodsInfo || {},
    //   withOutOptions: nextProps.withOutOptions || false,
    //   stock: nextProps.goodsInfo.total || 0
    // })
  }
  //关闭弹窗
  onClose(e) {
    e.stopPropagation()
    this.props.onClose()
  }
  //选择规格
  selectOptions(pid, cid) {
    // pid 父级属性
    // cid 子级属性
    let { goodsSpecs, goodsOptions, finlSelect, finlPrice, final, optionsTxt, optionid, stock, count } = this.state
    goodsSpecs.map((item, index) => {
      if (item.id == pid) {
        item.items.map((list) => {
          list.select = false
          if (list.id == cid) {
            this.setState({
              selectImg: list.thumb
            })
            if (final.indexOf(list.id) == -1 && !item.selectId) {
              final.push(list.id)
            }
            if (item.selectId) {
              final.splice(index, 1, list.id)
            }
            item.selectId = list.id;
            list.select = true
          }
        })
        this.setState({
          goodsSpecs: goodsSpecs
        })
      }
    })
    finlSelect = this.permute([], final)
    //规格全部已选择
    if (final.length == goodsSpecs.length) {
      goodsOptions.map((options) => {
        if (finlSelect == options.specs) {
          finlPrice = options.marketprice //售价
          optionsTxt = options.title //规格
          optionid = options.id //规格id
          stock = options.stock //库存
          // if (Number(count) > Number(stock)) {
          //   count = (Number(stock) === 0 ? 1 : count)
          // }
          count = 1
        }
      })
      this.setState({
        finlPrice: finlPrice,
        optionsTxt: optionsTxt,
        optionid: optionid,
        finlSelect: finlSelect,
        stock: stock,
        count: count
      }, () => {
        let selectedOption = {
          count: this.state.count,
          optionid: this.state.optionid,
          stock: this.state.stock
        }
        this.props.onUpdateSelect(selectedOption)
      })
    }
  }
  //属性全部排列组合 函数
  permute(inputArr, outputArr) {
    const permuteArr = [];
    const arr = outputArr;
    const goodsOptions = this.state.goodsOptions;
    let finlSelect = '';
    function innerPermute(inputArr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (inputArr.length == len - 1) {
          if (inputArr.indexOf(arr[i]) < 0) {
            permuteArr.push((inputArr.concat(arr[i])).join('_'));
          }
          continue;
        }
        if (inputArr.indexOf(arr[i]) < 0) {
          innerPermute(inputArr.concat(arr[i]));
        }
      }
    }
    innerPermute(inputArr);
    goodsOptions.map((item) => {
      permuteArr.map((items) => {
        if (item.specs == items) {
          finlSelect = items
        }
      })
    })
    return finlSelect;
  }
  //选择数量
  countChange(type) {
    const { count, stock, optionid, withOutOptions } = this.state
    //减
    if (type === 'minus' && count !== 1) {
      this.setState({
        count: count - 1
      }, () => {
        let selectedOption = {
          count: this.state.count,
          optionid: this.state.optionid,
          stock: this.state.stock
        }
        this.props.onUpdateSelect(selectedOption)
      })
    }
    //加
    if (type === 'add') {
      if (withOutOptions && Number(count) >= Number(stock)) {
        Taro.showToast({
          title: '商品达到最大数量！',
          icon: 'none',
          mask: true,
          duration: 1400
        })
        this.setState({
          count: Number(stock) === 0 ? 1 : Number(stock)
        }, () => {
          let selectedOption = {
            count: this.state.count,
            optionid: this.state.optionid,
            stock: this.state.stock
          }
          this.props.onUpdateSelect(selectedOption)
        })
        return
      }
      if (Number(count) >= Number(stock) && optionid !== '') {
        Taro.showToast({
          title: '商品达到最大数量！',
          icon: 'none',
          mask: true,
          duration: 1400
        })
        this.setState({
          count: Number(stock) === 0 ? 1 : Number(stock)
        }, () => {
          let selectedOption = {
            count: this.state.count,
            optionid: this.state.optionid,
            stock: this.state.stock
          }
          this.props.onUpdateSelect(selectedOption)
        })
        return
      }
      if (Number(count) >= Number(stock) && optionid == '') {
        Taro.showToast({
          title: '商品达到最大数量！',
          icon: 'none',
          mask: true,
          duration: 1400
        })
        this.setState({
          count: Number(stock) === 0 ? 1 : Number(stock)
        }, () => {
          let selectedOption = {
            count: this.state.count,
            optionid: this.state.optionid,
            stock: this.state.stock
          }
          this.props.onUpdateSelect(selectedOption)
        })
        return
      }
      this.setState({
        count: count + 1
      }, () => {
        let selectedOption = {
          count: this.state.count,
          optionid: this.state.optionid,
          stock: this.state.stock
        }
        this.props.onUpdateSelect(selectedOption)
      })
    }
  }
  render() {
    const { isOpened, buyNow, selectOptionsBtn } = this.props
    const { goodsSpecs, selectImg, goodsInfo, optionsTxt, stock, finlPrice } = this.state
    return (
      <View className='FloatLayout'>
        < View className={isOpened ? 'layoutCover layoutShow' : 'layoutCover'} >
          <View className='layoutMask' onClick={this.onClose.bind(this)}></View>
          <View className='layoutMain'>
            <View className='layoutHeader'>
              <Image src={selectImg || goodsInfo.thumb} className='select_img' />
              <Image src={close} className='close' onClick={this.onClose.bind(this)} />
              <View className='header_main'>
                <View className='price_wrap'>
                  <View className='layoutPrice'>{`${finlPrice || goodsInfo.marketprice}`}</View>
                </View>
                {/* <View className='stock'>{(stock == '0' && finlPrice === '') ? '' : `库存: ${stock}`}</View> */}
                <View className='sku_info'>
                  <Text>{optionsTxt === '' ? '' : `已选择: ${optionsTxt}`} </Text>
                </View>
              </View>
            </View>
            <View className='layoutBody'>
              {
                goodsSpecs.map((item) => {
                  return (
                    <View className='layout-goods-group' key={item.id}>
                      <View className='options-title'>{item.title}</View>
                      <View className='options-list'>
                        {
                          item.items.map((list) => {
                            return (
                              <Text
                                className={list.select ? 'options active' : 'options'}
                                key={list.id}
                                onClick={this.selectOptions.bind(this, item.id, list.id)}
                              >
                                {list.title}
                              </Text>
                            )
                          })
                        }
                      </View>
                    </View>
                  )
                })
              }
              <View className='count-view'>
                <Text className='count-title'>数量</Text>
                <View className='inputNmber'>
                  <View className='btn minus' onClick={this.countChange.bind(this, 'minus')}></View>
                  <View className='number'>{this.state.count}</View>
                  <View className='btn add' onClick={this.countChange.bind(this, 'add')}></View>
                </View>
              </View>
            </View>
            <View className='footer'>
              {
                (selectOptionsBtn && goodsInfo.is_seckill)
                  ? <View className='btn-view'>
                    <View className='btn' onClick={this.props.onAddCart.bind(this, true)}>立即购买</View>
                  </View>
                  : ('')
              }
              {
                (selectOptionsBtn && !goodsInfo.is_seckill)
                  ? <View className='btn-view'>
                    <View className='btn add' onClick={this.props.onAddCart.bind(this, false)}>加入购物车</View>
                    <View className='btn' onClick={this.props.onAddCart.bind(this, true)}>立即购买</View>
                  </View>
                  : ('')
              }
              {
                (!selectOptionsBtn && !buyNow) &&
                <View className='btn' onClick={this.props.onAddCart.bind(this, false)}>加入购物车</View>
              }
              {
                (!selectOptionsBtn && buyNow) &&
                <View className='btn' onClick={this.props.onAddCart.bind(this, true)}>立即购买</View>
              }
            </View>
          </View>
        </View >
      </View >
    )
  }
}

export default OptionLayout; 