import * as constants from './constants';

const defaultState = {
	navList: [],
	scrollLeft: 0,
	recordLeft: 0,
	recordIndex: -1,
	tabIndex: -1
}
export default (state = defaultState, action) => {
	switch (action.type) {
		case constants.CHANGE_NAVBAR_DATA:
			return changeNavlist(state, action);
		case constants.CHANGE_TAB_INDEX:
			return changeTabIndex(state, action);
		case constants.CHANGE_SCROLL_LEFT:
			return changeNavbarLeft(state, action);
		case constants.NAVBAR_RESET:
			return navbarReset(state, action);
		default:
			return state;
	}
}
const changeNavlist = (state, action) => {
	return {
		...state,
		navList: action.navList
	}
};
//改变tabIndex
const changeTabIndex = (state, action) => {
	return {
		...state,
		recordLeft: action.recordLeft,
		recordIndex: action.recordIndex
	}
};
const changeNavbarLeft = (state, action) => {
	return {
		...state,
		scrollLeft: state.recordLeft,
		tabIndex: state.recordIndex
	}
}
const navbarReset = (state, action) => {
	return {
		...state,
		scrollLeft: 0,
		tabIndex: -1
	}
}