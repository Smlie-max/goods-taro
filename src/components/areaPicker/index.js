import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import address from './area.js'
export default class AreaPicker extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      addressJSON: address.addressJSON,
      multiIndex: [0, 0, 0],
      addressMulti: [],
      data: '',
      selectArea: '请选择地址'
    }
    this.onChange = this.onChange.bind(this)
    this.onColumnChange = this.onColumnChange.bind(this)
  }
  componentDidMount() {
    this.initAddress()
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      selectArea: nextProps.myAreas || '请选择地址'
    })
  }
  initAddress() {
    let addressMulti = [];
    let addressJSON = this.state.addressJSON;

    // 第一纬度
    let ArrayOne = [];
    for (let key in addressJSON) {
      ArrayOne.push(key);
    };
    addressMulti.push(ArrayOne);

    // 第二纬度
    let ArrayTwo = [];
    for (let key in addressJSON[ArrayOne[0]]) {
      ArrayTwo.push(key);
    };
    addressMulti.push(ArrayTwo);

    // 第三纬度
    let ArrayThree = addressJSON[ArrayOne[0]][ArrayTwo[0]];
    addressMulti.push(ArrayThree);

    this.setState({
      addressMulti: addressMulti
    });
  }

  onChange(e) {
    const { addressMulti, multiIndex } = this.state
    this.setState({
      multiIndex: e.detail.value,
      selectArea: addressMulti[0][multiIndex[0]] + ' ' + addressMulti[1][multiIndex[1]] + ' ' + addressMulti[2][multiIndex[2]]
    });
    const myAreas = addressMulti[0][multiIndex[0]] + ' ' + addressMulti[1][multiIndex[1]] + ' ' + addressMulti[2][multiIndex[2]]
    this.props.onSelectArea(myAreas)
  }
  getKeyList(obj) {
    let keyList = [];
    if (obj) {
      for (let key in obj) {
        keyList.push(key);
      };
    };
    return keyList;
  }
  onColumnChange(e) {
    let data = {
      addressMulti: this.state.addressMulti,
      multiIndex: this.state.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    let keyOne = null
    let keyTwo = null
    switch (e.detail.column) {
      case 0:
        // 计算第二纬度
        keyOne = data.addressMulti[0][data.multiIndex[0]];
        data.addressMulti[1] = this.getKeyList(this.state.addressJSON[keyOne]);
        // 计算第三纬度
        keyTwo = data.addressMulti[1][0];
        data.addressMulti[2] = this.state.addressJSON[keyOne][keyTwo];
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        // 计算第三纬度
        keyOne = data.addressMulti[0][data.multiIndex[0]];
        keyTwo = data.addressMulti[1][data.multiIndex[1]];
        data.addressMulti[2] = this.state.addressJSON[keyOne][keyTwo];
        data.multiIndex[2] = 0;
        break;
    }
    this.setState(data);

  }
  render() {
    const { addressMulti, multiIndex, selectArea } = this.state
    return (
      <View class="container">
        <Picker
          mode='multiSelector'
          onChange={this.onChange}
          onColumnChange={this.onColumnChange}
          value={multiIndex}
          range={addressMulti}>
          <View class="picker">
            {selectArea}
          </View>
        </Picker>
      </View>
    )
  }
}