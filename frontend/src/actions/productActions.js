import { products } from '../api';
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
} from '../actions/types';

export const getProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQ });

    const { data } = await products.get();

    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data.data.products });
  } catch (e) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQ });

    const { data } = await products.get(`/${id}`);

    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.data.product });
  } catch (e) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    await products.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (e) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await products.post(
      '',
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.data.product });
  } catch (e) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};
