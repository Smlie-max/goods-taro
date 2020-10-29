import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import { Provider } from '@tarojs/redux'
import getToken from './utils/getToken';
import wxConfig from './utils/wxConfig'

import '@tarojs/async-await'
import configStore from './store'
import './app.less'
const store = configStore()
class App extends Component {

    config = {
        pages: [
            'pages/index/index',
            'pages/test/index',
            'pages/certification/index',
            'pages/index_pages/index',
            'pages/activity/index',
            'pages/member/index',
            'pages/user/index',
            // 'pages/index_test/index',
            'pages/cart/index',
            'pages/order/index',
            'pages/orderDetail/index',
            'pages/userInfo/index',
            'pages/editUserInfo/index',
            'pages/goodsDetail/index',
            'pages/orderPreview/index',
            'pages/getnumber/index',
            'pages/coupon/index',
            'pages/couponCenter/index',
            'pages/article/index',
            'pages/recharge/index',
            'pages/initInfo/index',
            'pages/login/index',
            'pages/category/index',
            'pages/fillMemberData/index',
            'pages/interest/index',
            'pages/setting/index',
            'pages/search/index',
            'pages/searchList/index',
            'pages/openMember/index',
            'pages/address/index',
            'pages/follow/index',
            'pages/editAddress/index',
            'pages/reBind/index',
            'pages/notice/index',
            'pages/notice/noticeDetail',
            'pages/webView/index',
            'pages/record/index',
            'pages/categoryList/index',
            'pages/brandDetail/index',
            'pages/articleDetail/index',
            'pages/invoice/index',
            'pages/couponGoodsList/index',
            'pages/couponRule/index',
            'pages/conversion/index'
        ],
        subPackages: [{
            root: 'pages/orderRedPacket',
            pages: [
                'index',
            ]
        },
        {
            root: 'pages/gift',
            pages: [
                'giftList/index',
                'giftDetail/index',
                'giftDetail/success',
            ]
        },
        {
            root: 'pages/afterSale',
            pages: [
                'afterSaleList/index',
                'afterSaleDetail/index',
                'expressInfo/index',
                'chooseGoods/index',
                'formData/index'
            ]
        },
        {
            root: 'pages/evaluate',
            pages: [
                'index'
            ]
        },
        {
            root: 'pages/evaluateList',
            pages: [
                'index'
            ]
        },
        {
            root: 'pages/logistics',
            pages: [
                'index'
            ]
        },
        {
            root: 'pages/bargain',
            pages: [
                'bargain/index',
                'bargainList/index',
                'myBargain/index',
                'goodsDetail/index',
                'bargainDetail/index',
                'orderPreview/index'
            ]
        },
        {
            root: 'pages/groups',
            pages: [
                'groups/index',
                'groupsOrder/index',
                'myGroups/index',
                'goodsDetail/index',
                'search/index',
                'orderPreview/index',
                'orderDetail/index',
                'logistics/index'
            ]
        },
        {
            root: 'pages/discount/',
            pages: [
                'discount/index',
                // 'goodsDetail/index',
                'orderPreview/index'
            ]
        },
        {
            root: 'pages/pointsMall',
            pages: [
                'pointsMall/index',
                'sortList/index',
                'productDetail/index',
                'order/index',
                'success/index',
                'orderIntegral/index',
                'pointIntegral/index',
                'orderPreview/index'
            ]
        },
        {
            root: 'pages/discover',
            pages: [
                'index/index',
                'article/index',
                'recommend/index',
                'new/index',
                'video/index',
                'video/videoDetail',
                'mood/index',
            ]
        },
        {
            root: 'pages/commission',
            pages: [
                'home/index',
                'withdraw/index',
                'withdrawSuccess/index',
                'order/index',
                'detail/index',
                'commission/index',
                'distributionOrder/index',
                'myTeam/index',
                'myShop/index',
                'become/index',
                'ad/index',
                'article/index'
            ]
        },
        {
            root: 'pages/signIn',
            pages: [
                'index/index',
            ]
        },
        //  {
        //      root: 'pages/index_pages',
        //      pages: [
        //          'index_pages/index',

        //      ]
        //  },
        {
            root: 'pages/promotional',
            pages: [
                'discount/index',
                'addPrice/index'
            ]
        }
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'FDG滴蕉蕉',
            navigationBarTextStyle: 'black'
        },
        navigateToMiniProgramAppIdList: [
            "wx705ec2958e48acb8"
        ]
    }
    componentWillMount() {
        Taro.removeStorageSync('staust')
        if (process.env.TARO_ENV === 'h5') {
            wxConfig() //h5注入配置信息
            getToken()
        } else if (process.env.TARO_ENV === 'weapp') {
            if (Taro.getStorageSync('is_login') === '') {
                Taro.navigateTo({
                    url: '/pages/login/index'
                })
            }
        }
    }

    componentDidMount() { }

    componentDidShow() { }

    componentDidHide() { }


    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store} >
                <Index />
            </Provider>
        )
    }
}

Taro.render(<App />, document.getElementById('app'))
