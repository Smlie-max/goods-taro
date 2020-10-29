import Taro from '@tarojs/taro'
import Request from './request'
import { api } from './api';

let getStatus = false;
const getToken = async function () {
  const snsapi = 'snsapi_userinfo';
  if (Taro.getStorageSync('access_token')) {
    return true;
  }
  if (process.env.TARO_ENV === 'weapp') {
    return new Promise((resolve, reject) => {
      Taro.login({
        success(res) {
          if (res.code) {
            Request.post(api.login, {
              code: res.code
            }).then(res => {
              const result = res.data
              if (result.code == 0) {
                Taro.setStorageSync('access_token', result.data.access_token);
                Taro.setStorageSync('user_id', result.data.user_id);
                // getStatus = 'ok'
                getStatus = true
                resolve(getStatus)
              } else {
                Taro.showToast({
                  title: result.msg,
                  mask: true,
                  icon: 'none'
                });
              }
            }
            )
          } else {
            getStatus = false
            // getStatus = 'fail'
            reject(getStatus)
          }
        }
      })
    })
  } else if (process.env.TARO_ENV === 'h5') {
    const access_token = Taro.getStorageSync('access_token');
    if (access_token) {
      // 已登录
      return true
    }
    // 回调地址
    var redirect_uri = location.href;
    // 登录使用code
    var code = getUrlParam('code');
    if (!code) {
      // location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=" + snsapi + "&state=wxbase#wechat_redirect";
      Request.post(api.H5Login, {
        redirect_uri: redirect_uri,
        snsapi: 'snsapi_userinfo',
        // test: 1
      }).then(
        res => {
          const result = res.data
          if (result.code === 0) {
            location.href = result.data.url
          } else {
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      )
    } else {
      //获取用户信息
      Request.post(api.H5Login, {
        code: code,
        snsapi: snsapi,
        // test: 1
      }).then(
        res => {
          const result = res.data
          if (result.code === 0) {
            const is_label = res.data.data.is_label === '1' ? true : false
            Taro.setStorageSync('access_token', result.data.access_token);
            Taro.setStorageSync('userInfo', result.data.user_info);
            Taro.setStorageSync('is_login', true)
            Taro.setStorageSync('is_label', is_label) //是否已填资料
            Taro.setStorageSync('user_id', result.data.user_id) //user_id
            // var str_before = redirect_uri.split('code')[0];
            // var str_after = redirect_uri.split('wxbase')[1];
            window.close()
            location.href = redirect_uri
          } else {
            Taro.showToast({
              title: result.msg,
              icon: 'none'
            })
          }
        }
      )
    }
  }
}
//获取url中的参数
const getUrlParam = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}
export default getToken