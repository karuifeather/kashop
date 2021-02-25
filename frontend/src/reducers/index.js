import { combineReducers } from 'redux';

import {
  userAuthReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateReducer,
} from './userReducer';
import { cartReducer } from './cartReducer';
import { productListReducer, productReducer } from './productReducer';
import { createOrderReducer, orderDetailsReducer } from './orderReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
  cart: cartReducer,
  loggedinUser: userAuthReducer,
  newUser: userRegisterReducer,
  userDetails: userDetailsReducer,
  updatedUserProfile: userUpdateReducer,
  createdOrder: createOrderReducer,
  orderDetails: orderDetailsReducer,
});
