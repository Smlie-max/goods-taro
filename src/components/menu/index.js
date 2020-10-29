import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import * as actionCreators from './store/actionCreators'
import menu from '../../images/menu.png'
import './index.less'
@connect(({ menu }) => ({
  menuList: menu.menuList,
  menuTop: menu.menuTop,
  menuLeft: menu.menuLeft
}), (dispatch) => ({
  changemenulist() {
    dispatch(actionCreators.getMenuList())
  },
  changePosition(menuLeft, menuTop) {
    dispatch(actionCreators.changePosition(menuLeft, menuTop))
  }
}))
class Menu extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      onMenu: false,
      screenHeight: 0,
      screenHeight: 0,
      touchs: 0,
      move: false,
      isLeft: false
    }
  }
  componentWillMount() {
    const _this = this
    Taro.getSystemInfo({
      success: function (res) {
        _this.setState({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
        if (_this.props.menuLeft === 0) {
          _this.props.changePosition(res.windowWidth - 58, res.windowHeight - 200)
        }
      }
    })
  }

  componentDidMount() {
    if (this.props.menuList.length === 0) {
      this.props.changemenulist()
    }
  }

  clickMenu = (e) => {
    e.stopPropagation()
    this.setState({
      onMenu: !this.state.onMenu
    })
  }

  linkTo = (url, e) => {
    e.stopPropagation()
    this.setState(prevState => ({
      onMenu: !prevState.onMenu
    }))
    if (url.indexOf('http') != -1) {
      if (process.env.TARO_ENV === 'h5') {
        location.href = url
      } else if (process.env.TARO_ENV === 'weapp') {
        Taro.navigateTo({
          url: `/pages/webView/index?url=${url}`
        })
      }
    } else {
      Taro.redirectTo({
        url: url
      })
    }
  }
  menuMoveEvent(e) {
    e.stopPropagation()
    e.preventDefault();
    if (this.state.onMenu) return
    let touchs = e.touches[0];
    let clientX = touchs.clientX;
    let clientY = touchs.clientY;
    if (clientX <= 24) return;
    if (clientX >= this.state.screenWidth - 24) return;
    if (this.state.screenHeight - clientY <= 24) return;
    if (clientY <= 24) return;
    const menuLeft = clientX - 24
    const menuTop = clientY - 24
    this.props.changePosition(menuLeft, menuTop);
  }
  menuEndEvent() {
    if (this.props.menuLeft < (this.state.screenWidth / 2 - 24)) {
      this.setState({
        move: true
      }, () => {
        this.setState({
          isLeft: true
        })
        this.props.changePosition(10, this.props.menuTop);
        setTimeout(() => {
          this.setState({
            move: false
          })
        }, 200);
      })
    } else {
      this.setState({
        move: true
      }, () => {
        this.setState({
          isLeft: false
        })
        this.props.changePosition(this.state.screenWidth - 58, this.props.menuTop);
        setTimeout(() => {
          this.setState({
            move: false
          })
        }, 200);
      })
    }
    if (this.props.menuTop > this.state.screenHeight - 200) {
      this.setState({
        move: true
      }, () => {
        this.props.changePosition(this.props.menuLeft, this.state.screenHeight - 200);
        setTimeout(() => {
          this.setState({
            move: false
          })
        }, 200);
      })
    }
    if (this.props.menuTop < 100) {
      this.setState({
        move: true
      }, () => {
        this.props.changePosition(this.props.menuLeft, 100);
        setTimeout(() => {
          this.setState({
            move: false
          })
        }, 200);
      })
    }
  }
  //禁止滑动
  preventTouchMove(e) {
    e.stopPropagation()
    e.preventDefault();
    return
  }
  render() {
    const { isLeft, move, onMenu } = this.state
    const { menuList, menuTop, menuLeft } = this.props
    const style = `left:${menuLeft}PX;top:${menuTop}PX`
    return (
      <View
        className={onMenu ? 'pages' : ''}
        onClick={this.clickMenu.bind(this)}
        onTouchMove={this.preventTouchMove.bind(this)}
      >
        <View className={onMenu ? 'active' : ''}>
          <View className={move ? 'menu menu_move' : 'menu'}
            onTouchMove={this.menuMoveEvent.bind(this)}
            onTouchEnd={this.menuEndEvent.bind(this)}
            style={style}
          >
            <Image
              className={move ? 'menu-icon menu_move' : 'menu-icon'}
              src={menu}
              onClick={this.clickMenu.bind(this)}
              style={style}
            />
            {
              menuList.map((item) => {
                return (
                  <Image
                    className={isLeft ? 'isLeft' : 'isRight'}
                    src={item.icon}
                    key={item.id}
                    onClick={this.linkTo.bind(this, item.url)}
                  />
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}

export default Menu
