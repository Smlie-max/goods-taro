import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.less'
class SwiperGroups extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      clubs: [],
      animations: [],
      touchDot: '',
      done: false,
      time: 0,
      container: [], //记录当前5个位置为哪5个item，理解为5个容器
      curPos: 2, //记录当前显示位置是第几个容器（从0开始）
      zindex: [0, 10, 100, 10, 0], //与container中的对应
      curIndex: 0,//从显示位置的item在clubs中的index
      postions: [0, 1, 2, 3, 4],//container中5个容器所在位置
      interval: 0,
      animation1: {},
      animation2: {},
      animation3: {},
      animation4: {},
      animation5: {}
    }
  }

  componentWillMount() {
    //给5个容器赋值clubs0，1，2去到pos
    //pos的0，1，2，3，4为clubs的last，0，1，2，2+1
    //即pos的2（显示）位置是clubs的1位置
    this.setState({
      clubs: this.props.data
    }, () => {
      this.setPos(3, 1);
      setTimeout(() => {
        //初始化到正确的位置
        const animation1 = Taro.createAnimation({
          duration: 500,
          timingFunction: "ease",
          delay: 0
        })
        const animation2 = Taro.createAnimation({
          duration: 500,
          timingFunction: "ease",
          delay: 0
        })
        const animation3 = Taro.createAnimation({
          duration: 500,
          timingFunction: "ease",
          delay: 0
        })
        const animation4 = Taro.createAnimation({
          duration: 500,
          timingFunction: "ease",
          delay: 0
        })
        const animation5 = Taro.createAnimation({
          duration: 500,
          timingFunction: "ease",
          delay: 0
        })

        this.animation1 = animation1;
        this.animation2 = animation2;
        this.animation3 = animation3;
        this.animation4 = animation4;
        this.animation5 = animation5;

        this.animation1.translateX(-100).opacity(1).scale(0.7, 0.7).step();
        this.animation2.translateX(-50).opacity(1).scale(0.9, 0.9).step();
        this.animation3.translateX(0).opacity(1).scale(1, 1).step();
        this.animation4.translateX(50).opacity(1).scale(0.9, 0.9).step();
        this.animation5.translateX(100).opacity(1).scale(0.7, 0.7).step();

        this.setState({
          animation1: animation1.export(),
          animation2: animation2.export(),
          animation3: animation3.export(),
          animation4: animation4.export(),
          animation5: animation5.export()
        })
      }, 100)
    })
  }

  //设置位置
  /**
   * pos:显示位置在container中的位置
   * index：显示位置的clubs索引
   */
  setPos(pos, index) {
    let container = [];
    let p2 = pos;
    let p1 = this.findPrePos(p2);
    let p0 = this.findPrePos(p1);
    let p3 = this.findNextPos(p2);
    let p4 = this.findNextPos(p3);
    let i2 = index;
    let i1 = this.findPreIndex(i2);
    let i0 = this.findPreIndex(i1);
    let i3 = this.findNextIndex(i2);
    let i4 = this.findNextIndex(i3);
    container[p0] = this.state.clubs[i0];
    container[p1] = this.state.clubs[i1];
    container[p2] = this.state.clubs[i2];
    container[p3] = this.state.clubs[i3];
    container[p4] = this.state.clubs[i4];
    this.setState({
      container: container
    })
  }
  /**
   * container中的位置
   */
  findNextPos(pos) {
    if (pos != 4) {
      return pos + 1;
    }
    return 0;
  }
  findPrePos(pos) {
    if (pos != 0) {
      return pos - 1;
    }
    return 4;
  }

  //触摸开始事件
  touchstart(e) {
    this.state.touchDot = e.touches[0].pageX;
    var that = this;
    // this.state.interval = setInterval(function () {
    //   that.data.time += 1;
    // }, 100);
  }
  //触摸移动事件
  touchmove(e) {
    let touchMove = e.touches[0].pageX;
    let touchDot = this.state.touchDot;
    let time = this.state.time;

    //向左滑动
    if (touchMove - touchDot <= -40 && !this.state.done) {
      this.state.done = true;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && !this.state.done) {
      this.state.done = true;
      this.scrollRight();
    }
  }
  //触摸结束事件
  touchend(e) {
    clearInterval(this.state.interval);
    this.state.time = 0;
    this.state.done = false;
  }

  //向左滑动事件
  scrollLeft() {
    let container = this.state.container;
    let oldPos = this.state.curPos;
    let newPos = oldPos == 4 ? 0 : oldPos + 1;
    let newIndex = this.findNextIndex(this.state.curIndex);
    //先滑动，再赋值
    var animation1 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation2 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation3 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation4 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation5 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })

    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    this.animation5 = animation5;

    let distances = [];
    let newPostions = [];
    //用新位置找位移量
    for (let i = 0; i < container.length; i++) {
      let newPos = this.findPrePos(this.state.postions[i]);
      let distance = this.findNewDistance(newPos, i);
      distances.push(distance);
      newPostions.push(newPos);
    }
    this.animation1.translateX(distances[0][0]).opacity(distances[0][1]).scale(distances[0][2], distances[0][2]).step();
    this.animation2.translateX(distances[1][0]).opacity(distances[1][1]).scale(distances[1][2], distances[1][2]).step();
    this.animation3.translateX(distances[2][0]).opacity(distances[2][1]).scale(distances[2][2], distances[2][2]).step();
    this.animation4.translateX(distances[3][0]).opacity(distances[3][1]).scale(distances[3][2], distances[3][2]).step();
    this.animation5.translateX(distances[4][0]).opacity(distances[4][1]).scale(distances[4][2], distances[4][2]).step();
    this.setState({
      postions: newPostions,
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      animation5: animation5.export()
    })
    //赋值

    this.setPos(newPos, newIndex)
    this.setNewZindex(newPos)
    this.setState({
      curPos: newPos,
      curIndex: newIndex,
    })
  }
  //向右滑动事件
  scrollRight() {
    let container = this.state.container;
    let oldPos = this.state.curPos;
    let newPos = oldPos == 0 ? 4 : oldPos - 1;
    let newIndex = this.findPreIndex(this.state.curIndex);
    //先滑动，再赋值
    var animation1 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation2 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation3 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation4 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation5 = Taro.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })

    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    this.animation5 = animation5;

    let distances = [];
    let newPostions = [];
    //用新位置找位移量
    for (let i = 0; i < container.length; i++) {
      let newPos = this.findNextPos(this.state.postions[i]);
      let distance = this.findNewDistance(newPos, i);
      distances.push(distance);
      newPostions.push(newPos);
    }
    this.animation1.translateX(distances[0][0]).opacity(distances[0][1]).scale(distances[0][2], distances[0][2]).step();
    this.animation2.translateX(distances[1][0]).opacity(distances[1][1]).scale(distances[1][2], distances[1][2]).step();
    this.animation3.translateX(distances[2][0]).opacity(distances[2][1]).scale(distances[2][2], distances[2][2]).step();
    this.animation4.translateX(distances[3][0]).opacity(distances[3][1]).scale(distances[3][2], distances[3][2]).step();
    this.animation5.translateX(distances[4][0]).opacity(distances[4][1]).scale(distances[4][2], distances[4][2]).step();

    this.setState({
      postions: newPostions,
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      animation5: animation5.export()
    })
    //赋值

    this.setPos(newPos, newIndex)
    this.setNewZindex(newPos)
    this.setState({
      curPos: newPos,
      curIndex: newIndex,
    })
  }
  /**
   * newPos:新的他要到的的位置
   */
  findNewDistance(newPos, index) {
    let newDistances = [];
    switch (newPos) {
      // case 0:
      //   newDistances = [-100 + '%', 1, 0.8];
      //   break;
      // case 1:
      //   newDistances = [-50 + '%', 1, 0.9];
      //   break;
      // case 2:
      //   newDistances = [0 + '%', 1, 1];
      //   break;
      // case 3:
      //   newDistances = [50 + '%', 1, 0.9];
      //   break;
      // case 4:
      //   newDistances = [100 + '%', 1, 0.8];
      //   break;
      case 0:
        newDistances = [-100, 1, 0.7];
        break;
      case 1:
        newDistances = [-50, 1, 0.9];
        break;
      case 2:
        newDistances = [0, 1, 1];
        break;
      case 3:
        newDistances = [50, 1, 0.9];
        break;
      case 4:
        newDistances = [100, 1, 0.7];
        break;
    }
    return newDistances;
  }
  setNewZindex(newPos) {
    let zindexes = [];
    zindexes[newPos] = 100;
    let nextPos = this.findNextPos(newPos);
    zindexes[nextPos] = 10;
    let nnextPos = this.findNextPos(nextPos);
    zindexes[nnextPos] = 0;
    let prePos = this.findPrePos(newPos);
    zindexes[prePos] = 10;
    let pprePos = this.findPrePos(prePos);
    zindexes[pprePos] = 0;
    this.setState({
      zindex: zindexes
    })
  }
  findNextIndex(index) {
    if (index != this.state.clubs.length - 1) {
      return index + 1;
    }
    return 0;
  }
  findPreIndex(index) {
    if (index != 0) {
      return index - 1;
    }
    return this.state.clubs.length - 1;
  }

  handleClick(url) {
    if (url.indexOf('http') != -1) {
      if (process.env.TARO_ENV === 'h5') {
        location.href = url
      } else if (process.env.TARO_ENV === 'weapp') {
        Taro.navigateTo({
          url: `/pages/webView/index?url=${url}`
        })
      }
    } else {
      Taro.navigateTo({
        url: `${url}`
      })
    }
  }
  render() {
    const { container, curIndex, animation1, animation2, animation3, animation4, animation5, zindex, clubs } = this.state
    return (
      <View className='SwiperGroups'>
        {
          container.length > 0 &&
          <View
            className='box'
            onTouchStart={this.touchstart.bind(this)}
            onTouchMove={this.touchmove.bind(this)}
            onTouchEnd={this.touchend.bind(this)}
          >
            <block>
              <View className='club' animation={animation1} style={`z-index:${zindex[0]};`} onClick={this.handleClick.bind(this, container[0].linkurl)}>
                <Image src={container[0].imgurl} className='img' lazyLoad />
                <Text className='tips'>{container[0].title}</Text>
              </View>
              <View className='club' animation={animation2} style={`z-index:${zindex[1]};`} onClick={this.handleClick.bind(this, container[1].linkurl)}>
                <Image src={container[1].imgurl} className='img' lazyLoad />
                <Text className='tips'>{container[1].title}</Text>
              </View>
              <View className='club' animation={animation3} style={`z-index:${zindex[2]};`} onClick={this.handleClick.bind(this, container[2].linkurl)}>
                <Image src={container[2].imgurl} className='img' lazyLoad />
                <Text className='tips'>{container[2].title}</Text>
              </View>
              <View className='club' animation={animation4} style={`z-index:${zindex[3]};`} onClick={this.handleClick.bind(this, container[3].linkurl)}>
                <Image src={container[3].imgurl} className='img' lazyLoad />
                <Text className='tips'>{container[3].title}</Text>
              </View>
              <View className='club' animation={animation5} style={`z-index:${zindex[4]};`} onClick={this.handleClick.bind(this, container[4].linkurl)}>
                <Image src={container[4].imgurl} className='img' lazyLoad />
                <Text className='tips'>{container[4].title}</Text>
              </View>
            </block>
            <View className='dot-view'>
              {
                clubs.map((item, index) => {
                  return (
                    <View className={index === curIndex ? 'dot active' : 'dot'} key={`id${index}`}></View>
                  )
                })
              }
            </View>
          </View>
        }
      </View>
    )
  }
}

export default SwiperGroups