import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
import cart from '..';

const defaultState = {
	cartData: {
		merch: []
	},
	ready: false,
}
export default (state = defaultState, action) => {
	switch (action.type) {
		case constants.GET_CART_DATA:
			return setCartData(state, action);
		case constants.CHANGE_CART_DATA:
			return changeCartData(state, action);
		case constants.CHANGE_COUNT_DATA:
			return changeCount(state, action);
		case constants.SELECT_DEL_MERCH:
			return selectDelMerch(state, action);
		case constants.SELECT_DEL_GOODS:
			return selectDelGoods(state, action);
		case constants.SELECT_DEL_ALL:
			return selectDelAll(state, action);
		case constants.REMOVE_GOODS:
			return removeGoods(state, action);
		case constants.COLLECT_GOODS:
			return collectGoods(state, action);
		default:
			return state;
	}
}
const setCartData = (state, action) => {
	return {
		cartData: action.cartData,
		ready: true
	}
};
const changeCartData = (state, action) => {
	return {
		cartData: action.cartData,
		ready: true
	}
};
const changeCount = (state, action) => {
	return {
		cartData: action.cartData,
		ready: true
	}
};
const selectDelMerch = (state, action) => {
	const newState = JSON.parse(JSON.stringify(state));
	const cartData = newState.cartData;
	cartData.merch.map((item) => {
		if (item.merchid === action.merchid) {
			item.allDelSelect = !item.allDelSelect;
			if (item.allDelSelect) {
				item.goods.map((list) => {
					list.goods_list.map((goods) => {
						goods.delSelected = true
					})
				})
			} else {
				item.goods.map((list) => {
					list.goods_list.map((goods) => {
						goods.delSelected = false
					})
				})
			}
		}
		//底部全选判断
		try {
			cartData.merch.forEach((merch) => {
				if (!merch.allDelSelect) {
					cartData.isDelCheckall = false
					throw '' //抛出异常跳出循环
				} else {
					cartData.isDelCheckall = true
				}
			})
		} catch (e) {
		}
	})
	return newState
};
const selectDelGoods = (state, action) => {
	let select_length = 0
	let length = 0
	const newState = JSON.parse(JSON.stringify(state));
	const cartData = newState.cartData;
	const merchBlock = cartData.merch.find((item) => (item.merchid === action.merchid))
	const typeBlock = merchBlock.goods[action.index].goods_list
	const goodsBlock = typeBlock.find((item) => (item.id === action.id))
	goodsBlock.delSelected = !goodsBlock.delSelected
	merchBlock.goods.map((item) => {
		length = length + item.goods_list.length
		item.goods_list.map((list) => {
			if (list.delSelected) {
				select_length = select_length + 1
			}
		})
	})
	// select_length === length ? merchBlock.allDelSelect : !merchBlock.allDelSelect
	if (select_length === length) {
		merchBlock.allDelSelect = true
	} else {
		merchBlock.allDelSelect = false
	}
	//选择单个商品删除的底部全选
	let merchAllDelLength = 0
	cartData.merch.map((item) => {
		if (item.allDelSelect) {
			merchAllDelLength = merchAllDelLength + 1
		}
	})
	if (merchAllDelLength === cartData.merch.length) {
		cartData.isDelCheckall = true
	} else {
		cartData.isDelCheckall = false
	}
	return newState
};
const selectDelAll = (state, action) => {
	const newState = JSON.parse(JSON.stringify(state));
	const cartData = newState.cartData;
	cartData.isDelCheckall = !cartData.isDelCheckall
	cartData.merch.map((item) => {
		if (cartData.isDelCheckall) {
			item.allDelSelect = true
			item.goods.map((list) => {
				list.goods_list.map((row) => {
					row.delSelected = true
				})
			})
		} else {
			item.allDelSelect = false
			item.goods.map((list) => {
				list.goods_list.map((row) => {
					row.delSelected = false
				})
			})
		}
	})
	return newState
};
const removeGoods = (state, action) => {
	const newState = JSON.parse(JSON.stringify(state));
	const merchData = newState.cartData.merch;
	let removeArr = [];
	merchData.map((item) => {
		item.goods.map((list) => {
			list.goods_list.map((row) => {
				if (row.delSelected) {
					removeArr.push(row.id)
				}
			})
		})
	})
	Request.post(api.cartRemove, {
		ids: JSON.stringify(removeArr)
	})
		.then(
			res => {
				Taro.hideLoading()
				const result = res.data
				Taro.showToast({
					title: result.msg,
					icon: 'none'
				})
				if (result.code === 0) {
					setTimeout(() => {
						Taro.redirectTo({
							url: '/pages/cart/index'
						})
					}, 1400)
				}
			}
		)
	return newState
};
const collectGoods = (state, action) => {
	const newState = JSON.parse(JSON.stringify(state));
	const merchData = newState.cartData.merch;
	let collectArr = [];
	merchData.map((item) => {
		item.goods.map((list) => {
			list.goods_list.map((row) => {
				if (row.delSelected) {
					collectArr.push(row.id)
				}
			})
		})
	})
	Request.post(api.collectGoods, {
		ids: JSON.stringify(collectArr)
	})
		.then(
			res => {
				Taro.hideLoading()
				const result = res.data
				Taro.showToast({
					title: result.msg,
					icon: 'none'
				})
				if (result.code == 0) {
					setTimeout(() => {
						Taro.redirectTo({
							url: '/pages/cart/index'
						})
					}, 1400)
				}
			}
		)
	return newState
};
