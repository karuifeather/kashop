import { getProfile, userLogin } from '../api';
import {
  USER_DELETE_FAIL,
  USER_DELETE_REQ,
  USER_DELETE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQ,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQ,
  USER_LIST_RESET,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQ,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQ,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQ,
  USER_UPDATE_SUCCESS,
} from './types';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQ });

    const { data } = await userLogin.post('/login', { email, password });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: { user: data.data.user, token: data.token },
    });

    localStorage.setItem('userToken', JSON.stringify(data.token));
    localStorage.setItem('userInfo', JSON.stringify(data.data.user));
  } catch (e) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userInfo');

  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_LIST_RESET });
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQ });

    const { data } = await userLogin.post('', { name, email, password });

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: { user: data.data.user, token: data.token },
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: { user: data.data.user, token: data.token },
    });

    localStorage.setItem('userToken', JSON.stringify(data.token));
    localStorage.setItem('userInfo', JSON.stringify(data.data.user));
  } catch (e) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const getUserProfile = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await getProfile.get(`/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.data.user });
  } catch (e) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await getProfile.patch('profile', user, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch({ type: USER_UPDATE_SUCCESS, payload: data.data.user });
  } catch (e) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const getUsersProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await getProfile.get('', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    dispatch({ type: USER_LIST_SUCCESS, payload: data.data.users });
  } catch (e) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQ });

    const {
      loggedinUser: { userToken },
    } = getState();

    const { data } = await getProfile.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    dispatch({ type: USER_DELETE_SUCCESS, payload: data.data });
  } catch (e) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message,
    });
  }
};

export const userDetailsReset = () => {
  return {
    type: USER_DETAILS_RESET,
  };
};
