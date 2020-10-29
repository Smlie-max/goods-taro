import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const changeLikelist= (res) => ({
	type: constants.CHANGE_LIKE_DATA,
	likeList: res.list,
});
export const getLikeList = (data) =>{
	return (dispatch) => {
		Request.post(api.likeList, {}).then(
	    res =>{
	    	const result = res.data.data
	      dispatch(changeLikelist(result));
	    }
	  )
	}
}  