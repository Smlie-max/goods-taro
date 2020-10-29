import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components'

import './cardList.less'

class CardList extends Component {

    constructor() {
        super(...arguments)
    }

    getInGoodsDetail(goodsId) {
        Taro.navigateTo({
            url: `/pages/pointsMall/productDetail/index?id=${goodsId}`
        })
    }

    render() {
        const { imgSrc, title, show, goodsId } = this.props
        return <View className="list-item" onClick={this.getInGoodsDetail.bind(this, goodsId)}>
            <View className="goods-contant">
                <View className="image-contant">
                    <Image className="img" src={imgSrc}></Image>
                </View>
                <View className="title-contant">
                    <View className="title-name">{title}</View>
                    <View className="price">{show}</View>
                </View>
            </View>
            <View className="button-contant">兑换</View>
        </View>
    }
}

export default CardList;