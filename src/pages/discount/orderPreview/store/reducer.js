
import * as constants from './constants';

const defaultState = {
	info:''
}
export default (state = defaultState, action) => {
  switch(action.type) {
		case constants.GET_INFO:
			return changeInfo(state, action);
		default:
			return state;
	}
}
const changeInfo = (state, action) => {
	return {
		info: action.info
	}
};