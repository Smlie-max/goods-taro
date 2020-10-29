import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.less'

import Request from '../../../utils/request';
import { api } from '../../../utils/api';

class Success extends Component {
    config = {
        navigationBarTitleText: '订单详情',
        navigationBarBackgroundColor: '#253C6D',
        navigationBarTextStyle: 'white'
    }

    constructor() {
        super(...arguments)
        this.state = {
            goods: [],
            order: {}
        }
    }

    componentWillMount() { }

    componentDidMount() {
        Taro.showLoading({
            title: '加载中'
        })
        Request.post(api.orderDetail, {
            id: this.$router.params.id
        }).then(
            res => {
                Taro.hideLoading()
                const info = res.data.data;
                this.setState({
                    goods: info.merch_array[0].goods[0],
                    order: info.order
                })
            }
        )
    }

    //返回
    getback() {
        Taro.navigateBack()
    }
    render() {
        const { goods, order } = this.state
        return (
            <View className='success'>
                <View className='header-contant'>
                    <View className='middle-contant'>
                        <View className='des'>感谢您对fdg商城的支持</View>
                    </View>
                </View>
                <View className='main-contant'>
                    <View className='goods-contant'>
                        <View className='img-contant'>
                            <Image className='img' src={goods.thumb} />
                        </View>
                        <View className='detail-contant'>
                            <View className='name'>
                                {goods.title}
                            </View>
                            <View className='money-contant'>
                                {
                                    order.price > 0 && <View className='price'>
                                        {
                                            order.price > 0 ? "￥" + order.price : " "
                                        }
                                    </View>
                                }
                                <View className='point'>
                                    {
                                        order.price > 0 && order.credit > 0 ? " + " : ""
                                    }
                                    {
                                        order.credit > 0 ? order.credit + "积分" : ""
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='order-detail'>
                        <View className='order-row'>
                            <View className='title'>订单编号</View>
                            <View className='key'>{order.ordersn}</View>
                        </View>
                        <View className='order-row'>
                            <View className='title'>兑换时间</View>
                            <View className='time'>
                                {order.createtime}
                            </View>
                        </View>
                        {
                            Number(order.price) > 0 &&
                            <View className='order-row'>
                                <View className='title'>使用金额</View>
                                <View className='key'>￥{order.price}</View>
                            </View>
                        }
                        {
                            Number(order.credit) > 0 &&
                            <View className='order-row'>
                                <View className='title'>使用积分</View>
                                <View className='key'>{order.credit}</View>
                            </View>
                        }
                    </View>
                    <View className='button-contant' onClick={this.getback.bind(this)}>确认返回</View>
                </View>
            </View>
        )
    }
}
export default Success;