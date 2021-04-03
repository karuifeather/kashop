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
} from '../actions/types';

export const userAuthReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQ:
      return { ...state, loading: true, error: null };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        userToken: action.payload.token,
        userInfo: action.payload.user,
        error: null,
      };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQ:
      return { ...state, loading: true, error: null };
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        userToken: action.payload.token,
        userInfo: action.payload.user,
        error: null,
      };
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQ:
      return { ...state, loading: true, error: null };
    case USER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case USER_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQ:
      return { ...state, loading: true, error: null };
    case USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };
    case USER_LIST_RESET:
      return { users: [] };
    case USER_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQ:
      return { ...state, loading: true, error: null };
    case USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case USER_DETAILS_RESET:
      return { user: {} };
    case USER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQ:
      return { ...state, loading: true, error: null, success: false };
    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        success: true,
        error: null,
      };
    case USER_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};
