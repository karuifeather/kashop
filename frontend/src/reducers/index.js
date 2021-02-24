import { combineReducers } from 'redux';

import { userAuthReducer, userRegisterReducer } from './userReducer';
import { cartReducer } from './cartReducer';
import { productListReducer, productReducer } from './productReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
  cart: cartReducer,
  loggedinUser: userAuthReducer,
  newUser: userRegisterReducer,
});
