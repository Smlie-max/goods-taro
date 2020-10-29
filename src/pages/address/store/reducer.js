import * as constants from './constants';
import Taro from '@tarojs/taro'
const defaultState = {
	addressList: [],
	myChoice: {
		address: '',
		realname: '',
		mobile: '',
		address_id: 0
	}
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case constants.CHANGE_ADDRESS_DATA:
			return changeAddresslist(state, action);
		case constants.CHOICE_ADDRESS:
			return choiceAddress(state, action);
		default:
			return state;
	}
}
const changeAddresslist = (state, action) => {
	const newState = JSON.parse(JSON.stringify(state));
	newState.addressList = action.addressList
	return newState
};
const choiceAddress = (state, action) => {
	const newState = JSON.parse(JSON.stringify(state));
	newState.addressList.map((item) => {
		if (item.id == action.id) {
			newState.myChoice.address = item.province + item.city + item.area + item.address;
			newState.myChoice.realname = item.realname;
			newState.myChoice.mobile = item.mobile
			newState.myChoice.address_id = item.id
		}
	})
	Taro.navigateBack();
	return newState
};