import Taro from '@tarojs/taro';
import defaultShareImg from '../images/defaultShareImg.jpg';

function withShare(opts = {}) {

  // 设置默认
  let defalutPath = '/pages/index/index?';
  let defalutTitle = 'FDG滴蕉蕉商城享购全球，正品直邮，去逛逛！';
  let defaultImageUrl = defaultShareImg;

  const user_id = Taro.getStorageSync('user_id');

  return function demoComponent(Component) {
    if (process.env.TARO_ENV === 'h5') {
      return Component;
    }
    class WithShare extends Component {
      async componentWillMount() {
        Taro.showShareMenu({
          withShareTicket: true
        });

        if (super.componentWillMount) {
          super.componentWillMount();
        }

      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        let { title, imageUrl, path = null } = opts;

        // 从继承的组件获取配置
        if (this.$setSharePath && typeof this.$setSharePath === 'function') {
          path = this.$setSharePath();
        }

        // 从继承的组件获取配置
        if (this.$setShareTitle && typeof this.$setShareTitle === 'function') {
          title = this.$setShareTitle();
        }

        // 从继承的组件获取配置
        if (this.$setShareImageUrl && typeof this.$setShareImageUrl === 'function') {
          imageUrl = this.$setShareImageUrl();
        }

        if (!path) {
          path = defalutPath;
        }
        // 每条分享都补充用户的分享id
        // 如果path不带参数，分享出去后解析的params里面会带一个{''： ''}
        const sharePath = `${path}&shareFromUser=${user_id}`;
        console.log(sharePath)
        return {
          title: title || defalutTitle,
          path: sharePath,
          imageUrl: imageUrl || defaultImageUrl
        };
      }
      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}

export default withShare;
