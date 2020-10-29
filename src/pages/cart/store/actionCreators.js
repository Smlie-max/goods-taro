import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const setCartData = (res) => ({
	type: constants.GET_CART_DATA,
	cartData: res
});
const changeCartData = (res) => ({
	type: constants.CHANGE_CART_DATA,
	cartData: res
});
export const getCartData = () => {
	return (dispatch) => {
		Request.post(api.myCart, {}).then(
			res => {
				const result = res.data.data
				dispatch(setCartData(result));
			}
		)
	}
}
//勾选商品
export const goodsChoice = (id, merchid, allcheck) => {
	return (dispatch) => {
		Taro.showLoading({
			title: '请求中'
		})
		Request.post(api.goodsChoice, {
			id: id,
			merchid: merchid,
			allcheck: allcheck
		}).then(
			res => {
				Taro.hideLoading()
				const result = res.data.data
				dispatch(changeCartData(result));
			}
		)
	}
}
export const changeCount = (id, value) => {
	return (dispatch) => {
		Taro.showLoading({
			title: '请求中'
		})
		Request.post(api.changeCount, {
			id: id,
			total: value
		})
			.then(
				res => {
					Taro.hideLoading()
					let result = res.data.data
					dispatch({
						type: constants.CHANGE_COUNT_DATA,
						cartData: result,
					});
				}
			)
	}
}
export const selectDelMerch = (merchid) => {
	return (dispatch) => {
		dispatch({
			type: constants.SELECT_DEL_MERCH,
			merchid: merchid
		});
	}
}
export const selectDelGoods = (merchid, index, id) => {
	return (dispatch) => {
		dispatch({
			type: constants.SELECT_DEL_GOODS,
			merchid,
			id,
			index
		});
	}
}
export const selectDelAll = () => {
	return (dispatch) => {
		dispatch({
			type: constants.SELECT_DEL_ALL
		});
	}
}
export const removeGoods = () => {
	return (dispatch) => {
		dispatch({
			type: constants.REMOVE_GOODS
		});
	}
}
export const collectGoods = () => {
	return (dispatch) => {
		dispatch({
			type: constants.COLLECT_GOODS
		});
	}
} 