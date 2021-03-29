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
import axios from 'axios';

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

export const payOrderCheckout = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: ORDER_PAY_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();
    console.log(userToken);

    const { data } = await axios.get(`/api/v1/orders/checkout/${orderId}`);

    dispatch({ type: ORDER_PAY_SUCCESS, payload: data.session });
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

// var stripe = Stripe("pk_test_51IM7NgEKp6LlVHgD0RCRi4BDPqBtRFRH73z4ETvDtFISXc7X0to0ukX8LkYVlYkrkSvMtiILZQTvsQRZOLJi9thB00kKshOOZz");
//     var checkoutButton = document.getElementById("checkout-button");
//     checkoutButton.addEventListener("click", function () {
//       fetch("/create-checkout-session", {
//         method: "POST",
//       })
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (session) {
//           return stripe.redirectToCheckout({ sessionId: session.id });
//         })
//         .then(function (result) {
//           // If redirectToCheckout fails due to a browser or network
//           // error, you should display the localized error message to your
//           // customer using error.message.
//           if (result.error) {
//             alert(result.error.message);
//           }
//         })
//         .catch(function (error) {
//           console.error("Error:", error);
//         });
//     });
