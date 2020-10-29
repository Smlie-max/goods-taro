import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image,Text ,Input} from '@tarojs/components'
import ShoppRequest from '../../utils/shoppRequest';
import { api } from '../../utils/api'
import logo from '../../images/fdg-logo.png'
import wxLogo from '../../images/wx-logo.png'
import './index.less'

class Getnumber extends Component {
  config = {
    navigationBarTitleText: '授权'
  }
  constructor() {
    super(...arguments)
    this.state = {
    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmout() { }

  componentWillReceiveProps() { }

  getPhoneNumber = (phoneNumber) => {
  
    var encryptedData = phoneNumber.detail.encryptedData;
         var iv = phoneNumber.detail.iv; 
        //  Taro.setStorageSync('number',15908692483);
         Taro.navigateBack();
         Taro.login({
           success(res) { 
             if (res.code) {
               ShoppRequest.post(api.getphone,
                 {
                   code: res.code,
                   encryptedData: encryptedData,
                   iv:iv,
                 }).then(function (res) {
                   Taro.setStorageSync('number',res.data.phoneNumber);
                   Taro.navigateBack();
                
                 }
                 )
             }
           }
         }
         )
       
 }

  render() {
    return (
      <View className='loginWrap'>
        <Image src={logo} className='logo' mode='widthFix'></Image>
        <Button className='login-btn' open-type="getPhoneNumber" hover-class='none' onGetphonenumber={this.getPhoneNumber}>
          <Image src={wxLogo} className='type-logo' />
          <Text>授权微信手机号码</Text>
        </Button>
      </View>
    )
  }
}

export default Getnumber;
