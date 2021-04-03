import { combineReducers } from 'redux';

import {
  userAuthReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateReducer,
  userListReducer,
  userDeleteReducer,
} from './userReducer';
import { cartReducer } from './cartReducer';
import { productListReducer, productReducer } from './productReducer';
import {
  createOrderReducer,
  orderDetailsReducer,
  ordersMyListReducer,
} from './orderReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
  cart: cartReducer,
  loggedinUser: userAuthReducer,
  newUser: userRegisterReducer,
  userDetails: userDetailsReducer,
  usersList: userListReducer,
  userDelete: userDeleteReducer,
  updatedUserProfile: userUpdateReducer,
  createdOrder: createOrderReducer,
  orderDetails: orderDetailsReducer,
  myOrders: ordersMyListReducer,
});
