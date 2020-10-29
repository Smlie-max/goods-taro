import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';

const changeMenulist = (res) => ({
	type: constants.CHANGE_MENU_DATA,
	menuList: res.menu_list,
});
const setMenuPosition = (menuLeft, menuTop) => ({
	type: constants.CHANGE_MENU_POSITION,
	menuLeft: menuLeft,
	menuTop: menuTop
});
export const getMenuList = () => {
	return (dispatch) => {
		Request.post(api.menuList, {}).then(
			res => {
				const result = res.data.data
				dispatch(changeMenulist(result));
			}
		)
	}
}
//改变位置
export const changePosition = (menuLeft, menuTop) => {
	return (dispatch) => {
		dispatch(setMenuPosition(menuLeft, menuTop));
	}
}  