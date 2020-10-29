import Taro from '@tarojs/taro'
import { h5ShareUrl } from '../config'

// 设置默认
const user_id = Taro.getStorageSync('user_id');
const defalutPath = '/pages/index/index?';
const defalutTitle = 'FDG滴蕉蕉';
const defaultDesc = 'FDG滴蕉蕉商城享购全球，正品直邮，去逛逛！';
const defaultImageUrl = '../images/defaultShareImg.jpg';

const shareConfig = (shareData = {}) => {
  if (process.env.TARO_ENV === 'weapp') {
    return
  }
  var wx = require('m-commonjs-jweixin');
  let { title, imageUrl, desc, path = null } = shareData;
  // path = h5ShareUrl + path
  if (!path) {
    path = defalutPath;
  }
  const sharePath = `${h5ShareUrl}${path}&shareFromUser=${user_id}`;

  wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
    wx.showMenuItems({
      menuList: [
        'menuItem:share:appMessage',
        'menuItem:share:timeline',
        'menuItem:favorite',
      ] // 要显示的菜单项
    });
    //分享到朋友
    if (wx.updateAppMessageShareData) {
      wx.updateAppMessageShareData({
        title: title || defalutTitle, // 分享标题
        desc: desc || defaultDesc, // 分享描述
        link: sharePath, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl || defaultImageUrl, // 分享图标
        success: function () {
          // 设置成功
          // alert('设置成功')
        }
      })
    } else {
      wx.onMenuShareAppMessage({
        title: title || defalutTitle, // 分享标题
        desc: desc || defaultDesc, // 分享描述
        link: sharePath, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl || defaultImageUrl, // 分享图标
        success: function () {
          // 设置成功
          // alert('设置成功')
        }
      })
    }
    //分享到朋友圈
    if (wx.updateTimelineShareData) {
      wx.updateTimelineShareData({
        title: title || defalutTitle, // 分享标题
        link: sharePath, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl || defaultImageUrl, // 分享图标
        success: function () {
          // 设置成功
        }
      })
    } else {
      wx.onMenuShareTimeline({
        title: title || defalutTitle, // 分享标题
        link: sharePath, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl || defaultImageUrl, // 分享图标
        success: function () {
          // 设置成功
        }
      })
    }
  })
}
export default shareConfig