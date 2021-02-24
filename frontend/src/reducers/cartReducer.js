import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../actions/types';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      const itemExists = state.cartItems.find(
        (curr) => curr.product === item.product
      );

      if (itemExists) {
        return {
          ...state,
          cartItems: state.cartItems.map((curr) =>
            // if equal, return the (new) version of the existing quantity
            curr.product === itemExists.product ? item : curr
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (curr) => curr.product !== action.payload
        ),
      };
    default:
      return state;
  }
};
