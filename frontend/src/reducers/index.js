import { combineReducers } from 'redux';

import { cartReducer } from './cartReducer';

import {
  userAuthReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateByAdminReducer,
} from './userReducer';

import {
  productDeleteReducer,
  productListReducer,
  productReducer,
} from './productReducer';

import {
  createOrderReducer,
  orderDetailsReducer,
  ordersMyListReducer,
} from './orderReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
  deleteProduct: productDeleteReducer,
  cart: cartReducer,
  loggedinUser: userAuthReducer,
  newUser: userRegisterReducer,
  userDetails: userDetailsReducer,
  usersList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdateByAdmin: userUpdateByAdminReducer,
  updatedUserProfile: userUpdateReducer,
  createdOrder: createOrderReducer,
  orderDetails: orderDetailsReducer,
  myOrders: ordersMyListReducer,
});
