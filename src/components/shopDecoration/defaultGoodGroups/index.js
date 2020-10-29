import Taro, { Component } from '@tarojs/taro'
import { View, Image,Text } from '@tarojs/components'
import cartIcon from '../../../images/cart-icon.png'
import shoukong from '../../../images/null.png'
import backgcolor from '../../../images/backgcolor.png'
import './index.less'

class DefaultGoodGroups extends Component {
  constructor() {
    super(...arguments);
    this.state = {
    }
  }

  linkTo(id) {
    Taro.navigateTo({
      url: '/pages/goodsDetail/index?id=' + id
    })
  }

  render() {
    const { data } = this.props
    return (
      <View className='DefaultGoodGroups'>
        {
          data.col === 1 &&
          data.data.map((item) => {
            return (
              <View className='col-1' key={item.gid} onClick={this.linkTo.bind(this, item.gid)}>
              <View className="col1img" style="background-image:../../../images/backgcolor.png">
                <Image src={item.thumb} className='goods-img' />
                <View   className="guding">
                      <Image src={shoukong}  className={item.total==0? 'xianshi' : 'yingchang'} />
                      </View>
                      </View>
                <View className='right'>
                  <View className='goods-name'>{item.title}</View>
                  {
                    item.sales&& <View className='goods-sale'>已售{item.sales}件</View>
                  }
                  <View className='goods-bottom'>
                    <View className='price-view'>
                      {
                        item.price && <View className='xian'>¥ {item.price}</View>
                      }
                    </View>
                  
                    <View className='xiantiao'></View> 
                  </View>
               
                </View>

              </View>
            )
          })
        }
      
<View className='aaa'>
      
        {
          data.col === 2 &&
        
          data.data.map((item) => {
            return (
             
                <View>
              <View className='col-2' key={item.gid} onClick={this.linkTo.bind(this, item.gid)} >
                <View className='pic-view'>
                  <Image src={item.thumb} className='img' />
                </View>
                <View  className="guding">
                      <Image src={shoukong}  className={item.total==0? 'xianshi' : 'yingchang'} />
                      </View>
                <View className='goods-name'>{item.title}</View>
                <View className='bottom-view'>
                  <View className='price-view'>
                    {
                      item.price && <View className='xian'>¥ {item.price}</View>
                    }
                  </View>
                 
                  
                </View>
              </View>
              </View>
             
            ) } )
         }
          </View>

          <View className="kuang">
     
        {
          data.col === 3 &&
          data.data.map((item) => {
            return (
              <View className="bbb">
              <View
                className='col-3'
                key={item.gid}
                onClick={this.linkTo.bind(this, item.gid)}
              >
                <Image src={item.thumb} className='goods-pic'></Image>
                <View   className="guding">
                      <Image src={shoukong}  className={item.total==0? 'xianshi' : 'yingchang'} />
                      </View>
                <View className='goods-name'>
                  {item.title}
                </View>
                <View className='goods-price'>
                  {
                    item.price && <Text>￥{item.price}</Text>
                  }
                  
                </View>
              </View>
                </View> 
            )
          }) 
           }
        </View>
      </View>
    )
  }
}

DefaultGoodGroups.defaultProps = {
  // data: {
  //   col: 3,
  //   data: [
  //     {
  //       id: 1,
  //       thumb: 'https://jdc.jd.com/img/240',
  //       title: '净化洁面啫喱30ml',
  //       marketprice: 69982,
  //       productprice: 30232,
  //       sale: 3260
  //     },
  //     {
  //       id: 2,
  //       thumb: 'https://jdc.jd.com/img/240',
  //       title: '净化洁面啫喱30ml',
  //       marketprice: 69982,
  //       productprice: 30232,
  //       sale: 3260
  //     },
  //     {
  //       id: 3,
  //       thumb: 'https://jdc.jd.com/img/240',
  //       title: '净化洁面啫喱30ml',
  //       marketprice: 69982,
  //       productprice: 30232,
  //       sale: 3260
  //     },
  //     {
  //       id: 4,
  //       thumb: 'https://jdc.jd.com/img/240',
  //       title: '净化洁面啫喱30ml',
  //       marketprice: 69982,
  //       productprice: 30232,
  //       sale: 3260
  //     },
  //     {
  //       id: 5,
  //       thumb: 'https://jdc.jd.com/img/240',
  //       title: '净化洁面啫喱30ml',
  //       marketprice: 69982,
  //       productprice: 30232,
  //       sale: 3260
  //     },
  //   ]
  // }
}

export default DefaultGoodGroups;
