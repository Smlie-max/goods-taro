import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const changeInfo= (res) => ({
	type: constants.GET_INFO,
	info: res,
});
export const getMemberInfo  = (data) =>{
	return (dispatch) => {
	    Taro.showLoading({
	      title:'加载中'
	    })
	    Request.post(api.plusDetail, {
	      // id:this.$router.params.id
	      id:1
	    }).then(
	      res =>{
	        Taro.hideLoading()
	        const result = res.data
	        if(result.code == 0){
	      		dispatch(changeInfo(result.data));
	        }else{
	          Taro.showToast({
	            title: result.msg,
	            icon:'none'
	          })
	        }
	      }
	    )
	}
}  