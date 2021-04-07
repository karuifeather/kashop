import {
  PRODUCT_DETAILS_REQ,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_REQ,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DELETE_REQ,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQ,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
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
        error: null,
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

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQ:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return {
        success: true,
        loading: false,
      };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQ:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return {
        success: true,
        loading: false,
        product: action.payload,
      };
    case PRODUCT_CREATE_RESET:
      return {};
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
