import axios from 'axios';
const userToken = JSON.parse(localStorage.getItem('userToken')) || null;

export const products = axios.create({
  baseURL: '/api/v1/products',
});

export const userLogin = axios.create({
  baseURL: '/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const upload = axios.create({
  baseURL: '/api/v1/upload',
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${userToken}`,
  },
});

export const getProfile = axios.create({
  baseURL: '/api/v1/users',
});

export const orders = axios.create({
  baseURL: '/api/v1/orders',
});
