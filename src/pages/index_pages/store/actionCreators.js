import * as constants from './constants';
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import TestOne from './../../pageTurn/test';
const changeData = (result, newData) => ({
	type: constants.CHANGE_INDEX_DATA,
	indexData: result,
	newData: newData
})
export const getIndexData = () => {
	return (dispatch) => {
		Request.post(api.test, {}).then(
			res => {
				// const result = res.data.data.info.data.items;
				const result = res.data.data;
				let newData = res.data.data
				for (let i = 0; i < newData.length; i++) {
					newData[i].class = 'one';
				}
				dispatch(changeData(result, newData));
			}
		)
	}
}


export const TestOne = () => {
	
	return (dispatch) => {
	}
}



