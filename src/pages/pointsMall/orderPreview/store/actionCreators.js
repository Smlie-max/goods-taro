import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const changeCouponList= (res,total) => ({
	type: constants.GET_COUPON_LIST,
	couponList: res.list,
	total:total
});
const reset= (res) => ({
	type: constants.RESET_COUPON_LIST,
	couponList: [],
});
export const getCouponList = (status, page) =>{
	return (dispatch) => {
		Request.post(api.getCouponList, {
			status: status,
			page: page
		}).then(
	    res =>{
	    	const result = res.data.data
	    	const total = result.total
	      	dispatch(changeCouponList(result,total));
	    }
	  )
	}
}  
export const resetCouponList = () =>{
	return (dispatch) => {
	    dispatch(reset());
	}
}  