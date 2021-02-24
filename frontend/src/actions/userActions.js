import { userLogin } from '../api';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQ,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQ,
  USER_REGISTER_SUCCESS,
} from './types';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQ });

    const { data } = await userLogin.post('/login', { email, password });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.data.user });

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
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQ });

    const { data } = await userLogin.post('', { name, email, password });

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.data.user });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.data.user });

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
