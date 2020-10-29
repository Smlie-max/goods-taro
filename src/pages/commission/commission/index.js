import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, ScrollView, Input } from '@tarojs/components'
// 组件引入
import Navbar from '../../../components/navbar';

import './index.less'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

import bgc from '../images/commission.png'
import Menu from './../../../components/menu/index';

class DistributionOrder extends Component {
    config = {
        navigationBarTitleText: '分销佣金',
        navigationBarBackgroundColor: '#253C6D',
        navigationBarTextStyle: 'white'
    }

    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }

    componentDidMount() {
        const that = this;
        // 请求参数,客户参数
        Request.post(api.abonus, {}).then(
            res => {
                const info = res.data.data;
                that.setState({
                    info: info
                })
            }
        )
    }

    jumpToDetail() {
        Taro.navigateTo({
            url: '/pages/commission/order/index'
        })
    }

    render() {
        const { info } = this.state
        return (
            <View className="CommissionMain">
                <Menu />
                <Image className='image' src={bgc} mode="widthFix"></Image>
                <Navbar bgColor='#253C6D'></Navbar>
                <View className='main-contant'>
                    <View className='level-contant'>{info.levelname}</View>
                    <View className='RMB-row'>
                        <View className='title'>累计佣金(¥)</View>
                        <View className='number'>{info.count_withdraw}</View>
                    </View>
                    <View className='RMB-row'>
                        <View className='title'>可提现佣金(¥)</View>
                        <View className='number'>{info.can_withdraw}</View>
                    </View>
                    <View className='card-contant'>
                        <View className='card-item'>
                            <View className='title'>已申请佣金(¥)</View>
                            <View className='number'>{info.apply_withdraw}</View>
                        </View>
                        <View className='card-item'>
                            <View className='title'>待打款佣金(¥)</View>
                            <View className='number'>{info.wait_withdraw}</View>
                        </View>
                        <View className='card-item'>
                            <View className='title'>成功提现佣金(¥)</View>
                            <View className='number'>{info.success_withdraw}</View>
                        </View>
                        <View className='card-item'>
                            <View className='title'>无效佣金(¥)</View>
                            <View className='fail'>{info.fail_withdraw}</View>
                        </View>
                    </View>
                    <View className='money-contant'>
                        <View className='item'>
                            <View className='title'>待收货佣金(¥)</View>
                            <View className='money'>{info.get_withdraw}</View>
                        </View>
                        <View className='item'>
                            <View className='title'>未结算佣金(¥)</View>
                            <View className='money'>{info.nopay_withdraw}</View>
                        </View>
                    </View>
                    <View className='button' onClick={this.jumpToDetail.bind(this)}>提现明细</View>
                </View>
            </View>
        )
    }
}

export default DistributionOrder;