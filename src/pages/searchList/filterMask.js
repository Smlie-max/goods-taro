import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'

import './filterMask.less'

export default class FilterMask extends Component {

  state = {
    priceMin: '',
    priceMax: '',
    brand_list: [],
    cate_list: []
  }

  componentDidMount() {

  }
  componentWillReceiveProps() {
    this.setState({
      priceMin: this.props.priceMin,
      priceMax: this.props.priceMax,
      brand_list: this.props.brandList,
      cate_list: this.props.cateList
    })
  }
  resetSearch = () => {
    const { brand_list, cate_list } = this.state
    brand_list.map((item) => {
      item.select = false
    })
    cate_list.map((item) => {
      item.select = false
    })
    this.setState({
      priceMin: '',
      priceMax: '',
      brand_list,
      cate_list
    })
  }

  /**
   * 确定选择
   * @param {} event
   */
  confirmSelect() {
    const { brand_list, cate_list } = this.state
    let brand = [] //选择的品牌id
    let cate = [] //选择的分类id
    brand_list.map((item) => {
      if (item.select) {
        brand.push(item.id)
      }
    })
    cate_list.map((item) => {
      if (item.select) {
        cate.push(item.id)
      }
    })
    let data = {
      priceMin: this.state.priceMin,
      priceMax: this.state.priceMax,
      brand: brand,
      cate: cate
    }
    this.props.onShowFilterMask()
    this.props.onConfirmSelect(data)
  }

  priceInput(type, { detail }) {
    let value = detail.value
    if (value && value > 0) {
      value = (value + '').replace(/\b(0+)/gi, '')
    } else {
      value = (value + '').replace(/\b(0+)/gi, 0)
    }
    if (type === 'min') {
      this.setState({
        priceMin: value
      })
    } else if (type === 'max') {
      this.setState({
        priceMax: value
      })
    }
  }
  /**
   * 确定属性
   * optionId:当前选择的属性id
   * optionArr：当前选择的属性的数组
   * type:属性类型 如分类，品牌
   */
  selectOption = (optionId, optionArr, type) => {
    optionArr.map((item) => {
      if (item.id == optionId) {
        item.select = !item.select
      }
    })
    this.setState({
      [type]: optionArr
    })
  }
  showFilterMask = () => {
    this.props.onShowFilterMask()
  }
  priceOnBlur() {
    const { priceMin, priceMax } = this.state
    if (priceMin && priceMax) {
      if (parseInt(priceMin) > parseInt(priceMax)) {
        this.setState({
          priceMin: priceMax,
          priceMax: priceMin,
        })
      }
    }
  }
  render() {
    const { priceMin, priceMax, brand_list, cate_list } = this.state
    const { showFilterMask } = this.props
    const filterContentClass = showFilterMask ? 'filter_mask_content search_animation' : 'filter_mask_content'
    return showFilterMask && <View className='filter_mask searchFilter'>
      <View className='filter_mask_layer' onClick={this.showFilterMask} />
      <View className={filterContentClass}>
        <View className='filter_main_box'>
          <View className='filter_options'>
            <View className='filter_options_title'>
              <Text>价格区间</Text>
            </View>
            <View className='filter_options_content options_content_price'>
              <Input
                className='price_input'
                type='number'
                value={priceMin}
                onInput={this.priceInput.bind(this, 'min')}
                cursorSpacing='20'
                maxlength='8'
                placeholder='最低价'
                onBlur={this.priceOnBlur.bind(this)}
              />
              <Text className='options_text'>-</Text>
              <Input
                className='price_input'
                type='number'
                value={priceMax}
                onInput={this.priceInput.bind(this, 'max')}
                cursorSpacing='20'
                maxlength='8'
                placeholder='最高价'
                onBlur={this.priceOnBlur.bind(this)}
              />
            </View>
          </View>
          {
            brand_list.length > 0 &&
            < View className='filter_options'>
              <View className='filter_options_title'>
                <Text className='options_title_text'>品牌</Text>
                {/* <Text className='filter_options_more'>更多</Text> */}
              </View>
              <View className='filter_options_content'>
                {
                  brand_list.map((item) => {
                    return (
                      <Text
                        className={item.select ? 'activity_item active' : 'activity_item'}
                        key={item.id}
                        onClick={this.selectOption.bind(this, item.id, brand_list, 'brand_list')}
                      >
                        {item.title}
                      </Text>
                    )
                  })
                }
              </View>
            </View>
          }
          {
            cate_list.length > 0 &&
            <View className='filter_options'>
              <View className='filter_options_title'>
                <Text className='options_title_text'>分类</Text>
                {/* <Text className='filter_options_more'>更多</Text> */}
              </View>
              <View className='filter_options_content'>
                {
                  cate_list.map((item) => {
                    return (
                      <Text
                        className={item.select ? 'activity_item active' : 'activity_item'}
                        key={item.id}
                        onClick={this.selectOption.bind(this, item.id, cate_list, 'cate_list')}
                      >
                        {item.name}
                      </Text>
                    )
                  })
                }
              </View>
            </View>
          }
          <View className='filter_confirm'>
            <View className='item_btn reset_filter' onClick={this.resetSearch.bind(this)}>重置</View>
            <View className='item_btn filter_confirm_btn' onClick={this.confirmSelect.bind(this)}>确定</View>
          </View>
        </View>
      </View>
    </View >
  }
}

FilterMask.defaultProps = {
  showFilterMask: false,
  brand_list: [
    {
      id: '1',
      name: '阿玛尼'
    }, {
      id: '2',
      name: '七匹狼'
    },
    {
      id: '3',
      name: '匹克'
    },
    {
      id: '4',
      name: '安踏'
    },
  ]
}
