import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import './index.less'
import searchIcon from '../../images/search-icon.png';

class Search extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmout () { }

  componentWillReceiveProps () { }

  render () {
    return (
      <View className='search'>
        <View className='search-view'>
        	<Input type='text' placeholder='最新时尚搭配' className='input'/>
        	<Image src={searchIcon} className='icon'/>
        </View>
      </View>
    )
  }
}