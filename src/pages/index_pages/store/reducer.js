import * as constants from './constants';

const defaultState = {
	indexData: '',
	newData: ''
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case constants.CHANGE_INDEX_DATA:
			return changeIndexData(state, action);
		default:
			return state;
	}
}
const changeIndexData = (state, action) => {
	return {
		indexData: action.indexData,
		newData: action.newData
	}
};