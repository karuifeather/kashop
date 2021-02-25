import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_REQ,
} from './types';
import { orders } from '../api';

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await orders.post('', order, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.data.order });
  } catch (e) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};
