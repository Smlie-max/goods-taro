import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components'
import './index.less';
class Tabs extends Component {
  constructor() {
    super(...arguments)
    this.state = {

    }
  }

  changeID(index) {
    this.props.onchange(index)
  }

  render() {
    const { positionStyle, titleArry } = this.props
    return (
      <View className="type-contant" style={positionStyle}>
        {
          titleArry.map((item, index) => {
            return (
              <View className="item" key={item.id} onClick={this.changeID.bind(this, index)}>
                <View className={item.check ? "title active" : "title"}>{item.name}</View>
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default Tabs;