import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

const changeAddresslist= (res) => ({
	type: constants.CHANGE_ADDRESS_DATA,
	addressList: res.list,
});
export const getAddressList = (data) =>{
	return (dispatch) => {
		Request.post(api.addressList, {}).then(
	    res =>{
	    	const result = res.data.data
	      dispatch(changeAddresslist(result));
	    }
	  )
	}
}  
//选择地址
export const choiceAddress = (id) =>{
	return{
		type: constants.CHOICE_ADDRESS,
		id:id
	}

} 
//修改默认地址
// const changeDefault= (res) => ({
// 	type: constants.CHANGE_DEFAULT_ADDRESS,
// 	addressList: res.list,
// });
// async function get(data){
// 	const res =  await Request({
// 	  url: api.addressList,
// 	  method: 'GET',
// 	  data,
// 	});
// 	return res.data
// }
// export const setDefaultAddress = (data) =>{
// 	return (dispatch) => {
// 		get(data).then(
// 			res =>{
// 				dispatch(setDefaultAddress(res));
// 			}
// 		)
// 	}
// }  