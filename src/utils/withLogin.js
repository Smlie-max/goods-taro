import getToken from './getToken';
import Taro from '@tarojs/taro'

const LIFE_CYCLE_MAP = ['willMount', 'didMount', 'didShow'];

/**
 *
 * 登录鉴权
 *
 * @param {string} [lifecycle] 需要等待的鉴权完再执行的生命周期 willMount didMount didShow
 * @returns 包装后的Component
 *
 */
function withLogin(lifecycle = 'didMount') {
  // 异常规避提醒
  if (LIFE_CYCLE_MAP.indexOf(lifecycle) < 0) {
    console.warn(
      `传入的生命周期不存在, 鉴权判断异常 ===========> $_{lifecycle}`
    );
    return Component => Component;
  }

  return function withLoginComponent(Component) {
    // 避免H5兼容异常
    if (process.env.TARO_ENV === 'h5') {
      return Component;
    }

    // if (Taro.getStorageSync('access_token')) {
    if (Taro.getStorageSync('is_login')) {
      // console.log('已登录')
      return Component;
    } else {
      // console.log('未登录')
    }
    // 这里还可以通过redux来获取本地用户信息，在用户一次登录之后，其他需要鉴权的页面可以用判断跳过流程
    // @connect(({ user }) => ({
    //   userInfo: user.userInfo,
    // }))
    return class WithLogin extends Component {
      constructor(props) {
        super(props);
      }

      async componentWillMount() {
        if (super.componentWillMount) {
          if (lifecycle === LIFE_CYCLE_MAP[0]) {
            const res = await this.$_autoLogin();
            if (!res) return;
          }
          super.componentWillMount();
        }
      }

      async componentDidMount() {
        if (super.componentDidMount) {
          if (lifecycle === LIFE_CYCLE_MAP[1]) {
            const res = await this.$_autoLogin();
            if (!res) return;
          }
          super.componentDidMount();
        }
      }

      async componentDidShow() {
        if (super.componentDidShow) {
          if (lifecycle === LIFE_CYCLE_MAP[2]) {
            const res = await this.$_autoLogin();
            if (!res) return;
          }
          super.componentDidShow();
        }
      }
      async $_autoLogin() {
        // ...这里是登录逻辑
        Taro.redirectTo({
          url: `/pages/login/index`
        })
        await getToken()
        // return await getToken()
      }
    }
  }
}

export default withLogin;