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
  createReviewReducer,
  productCreateReducer,
  productDeleteReducer,
  productListReducer,
  productReducer,
  productTopReducer,
  productUpdateReducer,
} from './productReducer';

import {
  createOrderReducer,
  deliverOrderReducer,
  orderDetailsReducer,
  ordersListReducer,
  ordersMyListReducer,
} from './orderReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
  topProducts: productTopReducer,
  deleteProduct: productDeleteReducer,
  createProduct: productCreateReducer,
  createReview: createReviewReducer,
  updateProduct: productUpdateReducer,
  cart: cartReducer,
  loggedinUser: userAuthReducer,
  newUser: userRegisterReducer,
  userDetails: userDetailsReducer,
  usersList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdateByAdmin: userUpdateByAdminReducer,
  updatedUserProfile: userUpdateReducer,
  createdOrder: createOrderReducer,
  deliverOrder: deliverOrderReducer,
  orderDetails: orderDetailsReducer,
  myOrders: ordersMyListReducer,
  allOrders: ordersListReducer,
});
