import * as constants from './constants';

const defaultState = {
	menuList: [],
	ready: false,
	menuTop: 0,
	menuLeft: 0,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case constants.CHANGE_MENU_DATA:
			return changeMenulist(state, action)
		case constants.CHANGE_MENU_POSITION:
			return changePosition(state, action)
		default:
			return state;
	}
}
const changeMenulist = (state, action) => {
	return {
		...state,
		menuList: action.menuList
	}
};
//改变位置
const changePosition = (state, action) => {
	return {
		...state,
		menuLeft: action.menuLeft,
		menuTop: action.menuTop
	}
};