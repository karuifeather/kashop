import { combineReducers } from 'redux';

import { cartReducer } from './cartReducer';
import { productListReducer, productReducer } from './productReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
  cart: cartReducer,
});
