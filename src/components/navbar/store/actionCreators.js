import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const changeNavlist = (result) => ({
	type: constants.CHANGE_NAVBAR_DATA,
	navList: result.nav_list,
});
export const getNavList = () => {
	return (dispatch) => {
		Request.post(api.NavbarList, {}).then(
			res => {
				const result = res.data.data || {}
				dispatch(changeNavlist(result));
			}
		)
	}
}
//改变tabIndex
export const changeTabIndex = (recordLeft, recordIndex) => {
	return (dispatch) => {
		dispatch({
			type: constants.CHANGE_TAB_INDEX,
			recordLeft,
			recordIndex
		});
	}
}
export const changeNavbarLeft = () => {
	return (dispatch) => {
		dispatch({
			type: constants.CHANGE_SCROLL_LEFT
		});
	}
}

export const navbarReset = () => {
	return (dispatch) => {
		dispatch({
			type: constants.NAVBAR_RESET
		});
	}
}
export const setIsNavbar = () => {
	return (dispatch) => {
		dispatch({
			type: constants.IS_NAVBAR
		});
	}
}
