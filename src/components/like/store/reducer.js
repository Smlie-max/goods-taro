import * as constants from './constants';

const defaultState = {
	likeList: []
}

export default (state = defaultState, action) => {
  switch(action.type) {
		case constants.CHANGE_LIKE_DATA:
			return changeNavlist(state, action);
		default:
			return state;
	}
}
const changeNavlist = (state, action) => {
	return {
		likeList: action.likeList
	}
};