import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_REQ,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_REQ,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQ,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
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

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await orders.get(`/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.data.order });
  } catch (e) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: ORDER_PAY_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await orders.patch(`/${orderId}/pay`, paymentResult, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch({ type: ORDER_PAY_SUCCESS, payload: data.data.order });
  } catch (e) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};
