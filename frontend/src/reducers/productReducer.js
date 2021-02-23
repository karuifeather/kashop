import {
  PRODUCT_DETAILS_REQ,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_REQ,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
} from '../actions/types';

export const productListReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQ:
      return { ...state, loading: true };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: [...action.payload],
      };
    case PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productReducer = (state = { item: { reviews: [] } }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQ:
      return { ...state, loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.payload,
      };
    case PRODUCT_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
