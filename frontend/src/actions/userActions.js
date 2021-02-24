import { userLogin } from '../api';
import { USER_LOGIN_FAIL, USER_LOGIN_REQ, USER_LOGIN_SUCCESS } from './types';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQ });

    const { data } = await userLogin.post('/login');

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.data.user });

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
