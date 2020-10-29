import Taro from '@tarojs/taro'
import Request from './request';
import { api } from './api';
const bindParent = function (mid) {
  Request.post(api.bindParent, {
    mid: mid
  })
}
export default bindParent