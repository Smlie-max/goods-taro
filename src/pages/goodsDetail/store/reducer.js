import * as constants from './constants';
import Taro from '@tarojs/taro'
import Request from '../../../utils/request';
import { api } from '../../../utils/api';
const defaultState = {
	goodsOptions:[], //后台返回的所有可选的规格的组合（数组）
	goodsSpecs:[], //规格数组
	finlSelect: '', //选择的最终属性id数组的拼接起来的标识
	finlPrice:'', //选择规格后的单价
  final: [], //选择的最终属性id数组
  optionsTxt:'', //已选择的属性名称
  count:1, //数量
  optionid: '', //选择的规格id
  showLayout: false,
}
export default (state = defaultState, action) => {
  switch(action.type) {
		case constants.GET_GOODS_OPTIONS:
			return setOptions(state, action);
		case constants.CHANGE_SELECT:
			return changeSelect(state, action);
		case constants.CHANGE_COUNT:
			return changeCount(state, action);
		case constants.CONFIRM:
			return confirm(state, action);
		case constants.SHOW_LAYOUT:
			return onShowMask(state, action);
		default:
			return state;
	}
}
//获取规格
const setOptions = (state, action) => {
	return {
		goodsOptions: action.goodsOptions,
		goodsSpecs: action.goodsSpecs,
		finlSelect: '',
		finlPrice:'',
	  final: [], //选择的最终属性id组合
	  optionsTxt: '',
	  count:1,
	  optionid:'',
  	showLayout: false
	}
};
//选择规格
const changeSelect = (state, action) => {
    const pid = action.pid; //父级属性
    const cid = action.cid; //子级属性
    const newState = JSON.parse(JSON.stringify(state));
    newState.goodsSpecs.map((item,index) => {
 		if (item.id == pid) {
 			item.items.map((list) => {
 				list.select = false
 				if (list.id == cid) {
 					if(newState.final.indexOf(list.id) == -1 && !item.selectId){
 						newState.final.push(list.id)
 					}
 					if(item.selectId){
 						newState.final.splice(index, 1, list.id)
 					}
 					item.selectId = list.id;
 					list.select = true
 				}
 			})
 		}
 	})
	newState.finlSelect = permute([],newState.final,state)
  if (newState.final.length == newState.goodsSpecs.length) {
  	newState.goodsOptions.map((options) => {
  		if (newState.finlSelect == options.specs) {
  			newState.finlPrice = options.marketprice
  			newState.optionsTxt = options.title,
  			newState.optionid = options.id
  		}
  	})
  }
	return newState
};
const onShowMask = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state));
	newState.showLayout = action.status
	return newState
};
//选择数量
const changeCount = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state));
	newState.count = action.count
	return newState
};
//加入购物车
const confirm = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state));
  if(newState.optionsTxt=='' && newState.goodsSpecs!=''){
  	Taro.showToast({
  		title:'请选择规格！',
  		icon: 'none'
  	})
  }else if(action.buyNow){
  	setTimeout(()=> {
  		Taro.navigateTo({
	  		url:'/pages/orderPreview/index?is_cart='+ 0 +'&id=' + action.id +'&option_id=' + newState.optionid + '&total=' + newState.count
	  	})
			newState.showLayout = false
  	},100)
  }else{
  	Taro.showLoading({
  		title:'正在加入购物车'
  	})
		newState.showLayout = false
  	Request.post(api.pushCart, {
			id: action.id,
			total: newState.count,
			optionid: newState.optionid
		}).then(
	    res =>{
	    	const result = res.data
	    	Taro.hideLoading()
	    	if (result.code == 0) {
	    		Taro.showToast({
	    			title:'加入购物车成功',
	    			icon:'none'
	    		})
	    	}else{
	    		Taro.showToast({
	    			title: result.msg,
	    			icon: 'none'
	    		})
	    	}
	    }
	  )
  }
	return newState
};
//属性全部排列组合 函数
const permute = (inputArr,outputArr,defaultState) => {
	const permuteArr=[];
	const arr = outputArr;
	let finlSelect = '';
  const newState = JSON.parse(JSON.stringify(defaultState));
	function innerPermute(inputArr){
		for(let i=0,len=arr.length; i<len; i++) {
			if(inputArr.length == len - 1) {
				if(inputArr.indexOf(arr[i]) < 0) {
					permuteArr.push((inputArr.concat(arr[i])).join('_'));
				}
				continue;
			}
			if(inputArr.indexOf(arr[i]) < 0) {
				innerPermute(inputArr.concat(arr[i]));
			}
		}
	}
	innerPermute(inputArr);
	newState.goodsOptions.map((item) => {
		permuteArr.map((items) => {
			if (item.specs == items) {
				finlSelect = items
			}
		})
	})
	return finlSelect;
}
