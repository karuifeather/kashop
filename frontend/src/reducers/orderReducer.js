import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQ,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQ,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQ,
  ORDER_PAY_RESET,
  ORDER_PAY_SUCCESS,
} from '../actions/types';

export const createOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQ:
      return { loading: true, error: false };
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        error: false,
        success: true,
        order: action.payload,
      };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQ:
      return { ...state, loading: true, error: false };
    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        error: false,
        order: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQ:
      return { loading: true, error: false };
    case ORDER_PAY_SUCCESS:
      return {
        loading: false,
        error: false,
        success: true,
      };
    case ORDER_PAY_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};
