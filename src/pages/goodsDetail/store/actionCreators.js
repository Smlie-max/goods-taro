import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const setGoodsOptions= (res) => ({
	type: constants.GET_GOODS_OPTIONS,
	goodsOptions: res.options,
	goodsSpecs: res.specs
});
export const getOptions = (id) =>{
	return (dispatch) => {
		Request.post(api.goodsOptions, {
			id: id
		}).then(
	    res =>{
	    	const result = res.data.data
	      	dispatch(setGoodsOptions(result));
	    }
	  )
	}
}  
export const changeSelect = (pid, cid) =>{
	return (dispatch) => {
		dispatch({
			type: constants.CHANGE_SELECT,
			pid,
			cid
		});
	}
}  
 
export const changeCount = (count) =>{
	return (dispatch) => {
		dispatch({
			type: constants.CHANGE_COUNT,
			count
		});
	}
} 
export const showMask = (status) =>{
	return (dispatch) => {
		dispatch({
			type: constants.SHOW_LAYOUT,
			status
		});
	}
} 
export const confirm = (id, buyNow) =>{
	return (dispatch) => {
		dispatch({
			type: constants.CONFIRM,
			id,
			buyNow
		});
	}
}  