import { combineReducers } from 'redux'
import navbarReducer from '../components/navbar/store/reducer'
import likeReducer from '../components/like/store/reducer'
import menuReducer from '../components/menu/store/reducer'
import addressReducer from '../pages/address/store/reducer'
import CartReducer from '../pages/cart/store/reducer'
import orderPreviewReducer from '../pages/orderPreview/store/reducer' 


export default combineReducers({
	navbar: navbarReducer, 
	like: likeReducer,
	address: addressReducer,
	menu: menuReducer,
	cart: CartReducer,
	orderPreview: orderPreviewReducer
}) 

 