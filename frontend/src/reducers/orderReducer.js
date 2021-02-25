import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQ,
  ORDER_CREATE_SUCCESS,
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
