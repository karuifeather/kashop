import { combineReducers } from 'redux';

import { productListReducer, productReducer } from './productReducer';

export default combineReducers({
  products: productListReducer,
  currentProduct: productReducer,
});
