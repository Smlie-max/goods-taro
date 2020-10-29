import Taro from '@tarojs/taro'
import { api } from './api';
import { baseUrl } from '../config'
import Request from './request'
function uploadImg (imgList = []) {
  Taro.showLoading({
    title: '上传中'
  })
  //小程序
  if (process.env.TARO_ENV === 'weapp') {
    let promiseList = imgList.map((item) => {
      return new Promise(resolve => {
        Taro.uploadFile({
          url: baseUrl + api.uploadImg,
          filePath: item,
          name: 'file',
          success: (res) => {
            const data = JSON.parse(res.data).data;
            resolve(data);
          }
        });
      });
    });
    const result = Promise.all(promiseList).then((res) => {
      Taro.hideLoading()
      return res;
    }).catch((error) => {
    });
    return result;
  } else if (process.env.TARO_ENV === 'h5') {
    var wx = require('m-commonjs-jweixin');
    //公众号
    return new Promise(resolve => {
      var imagesList = []
      var localIds = imgList
      function upload() {
        var localId = localIds.pop()
        wx.uploadImage({
          localId: localId,
          success: function (res) {
            Request.post(api.wxUpload, {
              media_id: res.serverId,// 返回图片的服务器端ID
            }).then(
              res => {
                const data = res.data.data
                imagesList.push(data)
                if (localIds.length > 0) {
                  upload(localIds);
                } else {
                  Taro.hideLoading()
                  resolve(imagesList)
                }
              }
            )
          },
          fail: function (res) {
          }
        })
      }
      upload()
    })
  }
}
export default uploadImg