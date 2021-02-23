import { products } from '../api';
import {
  PRODUCT_DETAILS_REQ,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_REQ,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
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
