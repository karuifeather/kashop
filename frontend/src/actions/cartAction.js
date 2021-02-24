import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../actions/types';
import { products } from '../api';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { product } = (await products.get(`/${id}`)).data.data;

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      quantity: qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: id });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
