import Taro from '@tarojs/taro'
import Request from './request';
import { api } from './api';
const wxConfig = async function () {
  return new Promise((resolve, reject) => {
    var wx = require('m-commonjs-jweixin');
    Request.post(api.wxConfig, {
      url: window.location.href.split('#')[0],
      // test: 1
    }).then(
      res => {
        Taro.hideLoading()
        const result = res.data;
        if (result.code === 0) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.data.appId, // 必填，公众号的唯一标识
            timestamp: result.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
            signature: result.data.signature,// 必填，签名
            jsApiList: [
              'chooseImage',
              'uploadImage',
              'chooseWXPay',
              'previewImage',
              'updateAppMessageShareData',
              'onMenuShareAppMessage',
              'updateTimelineShareData',
              'onMenuShareTimeline',
              'hideMenuItems',
              'showMenuItems',
            ] // 必填，需要使用的JS接口列表
          });
          wx.ready(function () {
            wx.hideOptionMenu();
          })
          resolve('success')
        } else {
          reject('fail')
        }
      }
    )
  })
}
export default wxConfig